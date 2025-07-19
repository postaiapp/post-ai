import { PostService } from '@modules/post/services/post.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Post } from '@models/post.model';
import * as dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import PQueue from 'p-queue';
import { Op } from 'sequelize';
import { UserPlatform } from '@models';

@Injectable()
export class PublishPostsCron {
	private readonly logger = new Logger(PostService.name);
	private readonly queue: PQueue;

	constructor(
		@InjectModel(Post) private postModel: typeof Post,
		private readonly postService: PostService,
	) {
		this.queue = new PQueue({ concurrency: 50 });
	}

	getPostsToPublish() {
		return this.postModel.findAll({
			where: {
				scheduledAt: {
					[Op.lte]: dayjs().toDate(),
				},
				canceledAt: null,
				publishedAt: null,
				failedToPost: {
					[Op.not]: true,
				},
				deletedAt: null,
			},
			include: {
				model: UserPlatform.scope(['withAuthToken', 'withPlatform']),
				as: 'account',
			},
			raw: true,
			nest: true,
		});
	}

	async publishPost(post: Post) {
		try {
			await this.postService.publishScheduledPost(post, post.account);
		} catch (error) {
			this.logger.error(`Error publishing post ${post.id}: ${error}`);

			await this.postModel.update(
				{
					failedToPost: true,
				},
				{ where: { id: post.id, deletedAt: null } },
			);
		}
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async run() {
		this.logger.log('[POSTS - CRON] Starting publish posts');

		const posts = await this.getPostsToPublish();

		if (isEmpty(posts)) {
			this.logger.log('[POSTS - CRON] No posts to publish');
			return;
		}

		posts.map(post => this.queue.add(() => this.publishPost(post)));

		await this.queue.onIdle();

		this.logger.log('[POSTS - CRON] Finished publish posts');
	}
}
