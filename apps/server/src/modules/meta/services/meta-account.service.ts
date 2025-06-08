import { Injectable, Logger } from '@nestjs/common';
import { MetaAuthService } from './meta-auth.service';
import { Uploader } from '@type/storage';
import { PLATFORMS_IDS, PLATFORMS_NAMES } from '@constants/platforms';
import { InjectModel } from '@nestjs/sequelize';
import { AuthToken } from '@models/auth-token.model';
import { UserPlatform } from '@models/user-platform.model';
import { InstagramClient } from '@clients';
import FileUtils from '@utils/file';
import * as dayjs from 'dayjs';

@Injectable()
export class MetaAccountService {
	private readonly logger = new Logger(MetaAccountService.name);

	constructor(
		@InjectModel(AuthToken)
		private authTokenModel: typeof AuthToken,
		@InjectModel(UserPlatform)
		private userPlatformModel: typeof UserPlatform,
		private metaAuthService: MetaAuthService,
		private uploader: Uploader,
	) {}

	async connectAccount(code: string, userId: number): Promise<UserPlatform> {
		try {
			console.log('code', code);
			console.log('userId', userId);
			const { access_token: shortLivedToken, user_id: instagramUserId } =
				await this.metaAuthService.exchangeCodeForToken(code);

			console.log('shortLivedToken', shortLivedToken);
			console.log('instagramUserId', instagramUserId);

			const { access_token: longLivedToken } =
				await this.metaAuthService.getLongLivedToken(shortLivedToken);

			console.log('longLivedToken', longLivedToken);

			const profileInfo = await this.getInstagramProfile(instagramUserId, longLivedToken);

			console.log('profileInfo', JSON.stringify(profileInfo, null, 4));

			const avatarUrl = profileInfo.profile_picture_url
				? (await this.uploader.downloadAndUploadImage(profileInfo.profile_picture_url)).url
				: null;

			const userPlatform = await this.userPlatformModel.create({
				user_id: userId,
				platform_id: PLATFORMS_IDS.INSTAGRAM,
				name: PLATFORMS_NAMES.INSTAGRAM,
				display_name: profileInfo.name || profileInfo.username,
				avatar_url: FileUtils.getUnsignedUrl(avatarUrl),
				profile_data: {
					instagram_user_id: instagramUserId,
					username: profileInfo.username,
					followers_count: profileInfo.followers_count,
					follows_count: profileInfo.follows_count,
					media_count: profileInfo.media_count,
					biography: profileInfo.biography,
					website: profileInfo.website,
				},
			});

			console.log('userPlatform', userPlatform);

			await this.authTokenModel.create({
				name: 'instagram_token',
				user_platform_id: userPlatform.id,
				access_token: longLivedToken,
				expires_at: dayjs().add(60, 'days').format(),
			});

			return userPlatform;
		} catch (error) {
			this.logger.error('Error connecting Instagram account:', error);
			throw error;
		}
	}

	private async getInstagramProfile(userId: string, accessToken: string) {
		const response = await InstagramClient({
			method: 'GET',
			url: `/${userId}`,
			params: {
				fields: 'username,name,profile_picture_url,media_count,followers_count,follows_count,biography,website',
				access_token: accessToken,
			},
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return response.data;
	}
}
