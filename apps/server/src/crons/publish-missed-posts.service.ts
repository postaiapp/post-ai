import { PostService } from '@modules/post/services/post.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Post } from '@schemas/post.schema';
import { User } from '@schemas/user.schema';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';

@Injectable()
export class PublishedMissedPostsCron {
	private readonly logger = new Logger(PostService.name);

	constructor(
		private readonly postService: PostService,
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Post.name) private readonly postModel: Model<Post>
	) {}

	@Cron(CronExpression.EVERY_MINUTE)
	async publishMissedPosts() {
		this.logger.log('Checking for missed posts');

		const postsScheduledMissed = await this.getPostsMissed();
		
		await Promise.all(
			postsScheduledMissed.map(async (post) => {
				const { userId, accountId, caption, imageUrl } = post;

				const user = await this.userModel.findOne(
					{
						_id: userId,
						'InstagramAccounts.accountId': accountId,
					},
					{ 'InstagramAccounts.$': 1 }
				).lean();

				if (!user || !user.InstagramAccounts?.length) {
					this.logger.warn(`No Instagram account found for user ${userId}`);
					return;
				}

				const account = user.InstagramAccounts[0];
				const { username, session } = account;

				await this.postService.publishPhotoOnInstagram(caption, username, session, imageUrl);

				await this.postModel.updateOne(
					{ _id: post._id },
					{
						$set: {
							publishedAt: dayjs().toDate(),
						},
					}
				);

				console.log(`Post ${post._id} published successfully`);
			})
		);

		this.logger.log('Missed posts check completed');
	}

	async getPostsMissed() {
		const postsScheduledMissed = await this.postModel
			.find({
				scheduledAt: {
					$lt: dayjs().toDate(),
				},
				canceledAt: { $eq: null },
				publishedAt: { $eq: null },
			})
			.lean();

		if (!postsScheduledMissed.length) {
			this.logger.log('No missed posts found');
			return;
		}

		return postsScheduledMissed
	}
}
