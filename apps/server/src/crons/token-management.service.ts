import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InstagramAccount } from '@schemas/instagram-account.schema';
import { Post } from '@schemas/post.schema';
import { User } from '@schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class TokenManagementCron {
	private readonly logger = new Logger(InstagramAccount.name);
	private readonly TOKEN_CHECK_INTERVAL = 7;
	private readonly TOKEN_REFRESH_DATE = 60;

	constructor(
		private readonly instagramAuthService: InstagramAuthService,
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Post.name) private readonly postModel: Model<Post>
	) {}

	async getValidateUsersWhereConditions(lastLoginDate: Date, usersWithScheduledPosts: string[]) {
		const whereConditions = {
			$or: [
				{
					InstagramAccounts: {
						$elemMatch: {
							lastLogin: { $lte: lastLoginDate },
						},
					},
				},
				{
					'InstagramAccounts.accountId': { $in: usersWithScheduledPosts },
				},
			],
		};

		return whereConditions;
	}

	async validateUsersToken(lastLoginDate: Date, nextWeekDate: Date) {
		const usersWithScheduledPosts = await this.postModel.distinct('userId', {
			scheduledAt: {
				$gte: new Date(),
				$lte: nextWeekDate,
			},
			canceledAt: { $exists: false }
		});

		const whereCondition = await this.getValidateUsersWhereConditions(lastLoginDate, usersWithScheduledPosts.map(String));

		const users = await this.userModel
			.find(whereCondition, {
				_id: 1,
				InstagramAccounts: 1,
			})
			.lean();

		return users.flatMap((user) => user.InstagramAccounts.map((account) => ({ ...account, userId: user._id })));
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async checkTokenInSchedulePosts() {
		const nextWeekDate = new Date();
		nextWeekDate.setDate(nextWeekDate.getDate() + this.TOKEN_CHECK_INTERVAL);

		const lastLoginDate = new Date();
		lastLoginDate.setDate(lastLoginDate.getDate() - this.TOKEN_REFRESH_DATE);

		const usersToValidateToken = await this.validateUsersToken(lastLoginDate, nextWeekDate);

		for (const account of usersToValidateToken) {
			const { username, session, userId } = account;

			const isTokenValid = await this.instagramAuthService.restoreSession(username, session);

			if (!isTokenValid) {
				this.logger.error(`Token for user ${userId} is invalid`);
				await this.notifyUserAboutTokenRefresh(userId.toString());
			}

			await this.userModel.updateOne(
				{
					_id: userId,
					'InstagramAccounts.username': username,
				},
				{
					$set: {
						'InstagramAccounts.$.session': {
							...session,
							lastChecked: new Date(),
							isValid: false,
						},
					},
				}
			);

			this.logger.log(`Token for user ${userId} is checked`);

			return {
				message: 'Token is checked',
			};
		}
	}

	async notifyUserAboutTokenRefresh(userId: string) {
		//TODO: Implement notification system for user about token refresh EMAIL or SMS
		this.logger.error(`User ${userId} needs token refresh`);
	}
}
