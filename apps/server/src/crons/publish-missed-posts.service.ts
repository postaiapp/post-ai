import { PostService } from '@modules/post/services/post.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Post } from '@schemas/post.schema';
import { User } from '@schemas/user.schema';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';

@Injectable()
export class PublishedMissedPostsCron {
	private readonly logger = new Logger(PostService.name);

	constructor(
		private readonly postService: PostService,
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Post.name) private readonly postModel: Model<Post>,
	) {}

	@Cron(CronExpression.EVERY_MINUTE)
	async publishMissedPosts() {
		this.logger.log('Checking for missed posts');

		const postsScheduledMissed = await this.getPostsMissed();

		if (isEmpty(postsScheduledMissed)) {
			this.logger.log('No missed posts found');
			return;
		}

		await Promise.all(
			postsScheduledMissed?.map(async post => {
				const { userId, accountId, caption, imageUrl } = post;

				const user = await this.userModel
					.findOne(
						{
							_id: userId,
							'InstagramAccounts.accountId': accountId,
						},
						{ 'InstagramAccounts.$': 1 },
					)
					.lean();

				if (!user || isEmpty(user.InstagramAccounts)) {
					this.logger.warn(`No Instagram account found for user ${userId}`);

					await this.postModel.updateOne(
						{ _id: post._id },
						{
							failedToPost: true,
						},
					);

					return;
				}

				const account = user.InstagramAccounts.filter(
					account => account.accountId === accountId,
				)[0];

				const { username, session } = account;

				const isPosted = await this.postService.publishPhotoOnInstagram(
					caption,
					username,
					session,
					imageUrl,
				);

				const changes = isPosted
					? {
							publishedAt: dayjs().toDate(),
						}
					: {
							failedToPost: true,
						};

				await this.postModel.updateOne({ _id: post._id }, changes);

				this.logger.log(
					`Post ${post._id} ${isPosted ? 'published successfully' : 'failed to publish'}`,
				);
			}),
		);

		this.logger.log('Missed posts check completed');
	}

	async getPostsMissed() {
		return await this.postModel
			.find({
				scheduledAt: {
					$lt: dayjs().toDate(),
				},
				canceledAt: null,
				publishedAt: null,
				failedToPost: {
					$ne: true,
				},
			})
			.lean();
	}
}
