import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InstagramAccount } from '@schemas/instagram-account.schema';
import { Post } from '@schemas/post.schema';
import { User } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { InstagramAuthService } from './instagram-auth.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenManagement {
	private readonly logger = new Logger(InstagramAccount.name);
	private readonly TOKEN_CHECK_INTERVAL = 7;
	private readonly TOKEN_REFRESH_DATE = 60;

	constructor(
		private readonly ig: IgApiClient,
		private readonly instagramAuthService: InstagramAuthService,
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Post.name) private readonly postModel: Model<Post>
	) {}

	async validateUsersToken(lastLoginDate: Date, nextWeekDate: Date) {
		const usersWithScheduledPosts = await this.postModel.distinct('userId', {
			scheduledAt: {
				$gte: new Date(),
				$lte: nextWeekDate,
			},
		});

		const users = await this.userModel
			.find(
				{
					$or: [
						{
							InstagramAccounts: {
								$elemMatch: {
									lastLogin: {
										$lte: lastLoginDate,
									},
								},
							},
						},
						{
							'InstagramAccounts.userId': { $in: usersWithScheduledPosts },
						},
					],
				},
				{
					_id: 1,
					InstagramAccounts: 1,
				}
			)
			.exec();

		return users.flatMap((user) => user.InstagramAccounts);
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async checkTokenInSchedulePosts() {
		const nextWeekDate = new Date();
		nextWeekDate.setDate(nextWeekDate.getDate() + this.TOKEN_CHECK_INTERVAL);

		const lastLoginDate = new Date();
		lastLoginDate.setDate(lastLoginDate.getDate() - this.TOKEN_REFRESH_DATE);

		const usersToValidateToken = await this.validateUsersToken(lastLoginDate, nextWeekDate);

		for (const account of usersToValidateToken) {
			const { username, session } = account;

			if (!session?.isValid) continue;

			const isTokenValid = await this.instagramAuthService.restoreSession(username, session);

			await this.userModel.updateOne(
				{
					_id: account.userId,
					'InstagramAccounts.username': username,
				},
				{
					$set: {
						'InstagramAccounts.$.session': {
							lastChecked: new Date(),
							isValid: isTokenValid,
						},
					},
				}
			);

			if (!isTokenValid) {
				await this.notifyUserAboutTokenRefresh(account.userId);
			}
		}
	}

	async notifyUserAboutTokenRefresh(userId: string) {
		this.logger.log(`User ${userId} needs token refresh`);
	}
}
