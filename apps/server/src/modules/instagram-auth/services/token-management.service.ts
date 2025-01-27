import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InstagramAccount } from '@schemas/instagram-account.schema';
import { Post } from '@schemas/post.schema';
import { User } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';

@Injectable()
export class TokenManagement {
	private readonly logger = new Logger(InstagramAccount.name);
	private readonly TOKEN_CHECK_INTERVAL = 7;
	private readonly TOKEN_REFRESH_DATE = 60;

	constructor(
		private readonly ig: IgApiClient,
		@InjectModel(User.name) private readonly userModel: Model<User>
	) {}

	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async checkTokenInSchedulePosts() {
		const nextWeekDate = new Date();
		nextWeekDate.setDate(nextWeekDate.getDate() + this.TOKEN_CHECK_INTERVAL);

		const lastLoginDate = new Date();
		lastLoginDate.setDate(lastLoginDate.getDate() - this.TOKEN_REFRESH_DATE);

		const usersToValidateToken = await this.userModel
			.find({
				$or: [
					{
						'InstagramAccounts.scheduledPosts': {
							$elemMatch: {
								scheduledAt: {
									$gte: new Date(),
									$lte: nextWeekDate,
								},
							},
						},
					},
					{
						'InstagramAccounts.lastLogin': { $lte: lastLoginDate },
					},
				],
			})
			.lean();

		console.log('usersToValidateToken', usersToValidateToken);

		for (const user of usersToValidateToken) {
			const instagramAccounts = user?.InstagramAccounts || [];

			for (const account of instagramAccounts) {
				console.log('account', account);
				const { username, session } = account;

				if (!session?.token) continue;

				const isTokenValid = await this.verifyValidationToken(session?.token, account?.userId);

				if (!isTokenValid) {
					await this.notifyUserAboutTokenRefresh(user._id.toString());
				}

				await this.userModel.updateOne(
					{
						_id: user?._id,
						'InstagramAccounts.username': username,
					},
					{
						$set: {
							'InstagramAccounts.$.tokenStatus': {
								lastChecked: new Date(),
								isValid: isTokenValid,
							},
						},
					}
				);
			}
		}
	}

	async verifyValidationToken(token: string, userId: string) {
		try {
			await this.ig.state.deserialize(JSON.parse(token));
			await this.ig.user.info(userId);
			return true;
		} catch {
			return false;
		}
	}

	private async notifyUserAboutTokenRefresh(userId: string) {
		this.logger.log(`User ${userId} needs token refresh`);
	}
}
