import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MetaAuthService } from './meta-auth.service';
import { UserPlatform } from '@models/user-platform.model';
import { AuthToken } from '@models/auth-token.model';
import { Uploader } from '@type/storage';
import axios from 'axios';
import moment from 'moment';

@Injectable()
export class MetaAccountService {
	private readonly logger = new Logger(MetaAccountService.name);

	constructor(
		private configService: ConfigService,
		private metaAuthService: MetaAuthService,
		private uploader: Uploader,
	) {}

	async connectAccount(code: string, userId: number): Promise<UserPlatform> {
		try {
			const { access_token: shortLivedToken, user_id: instagramUserId } =
				await this.metaAuthService.exchangeCodeForToken(code);

			const { access_token: longLivedToken } =
				await this.metaAuthService.getLongLivedToken(shortLivedToken);

			const profileInfo = await this.getInstagramProfile(instagramUserId, longLivedToken);

			const avatarUrl = profileInfo.profile_picture_url
				? (await this.uploader.downloadAndUploadImage(profileInfo.profile_picture_url)).url
				: null;

			const userPlatform = await UserPlatform.create({
				user_id: userId,
				platform_id: 1,
				name: 'instagram',
				display_name: profileInfo.name || profileInfo.username,
				avatar_url: avatarUrl,
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

			await AuthToken.create({
				name: 'instagram_token',
				user_platform_id: userPlatform.id,
				access_token: longLivedToken,
				expires_at: moment().add(60, 'days').format(),
			});

			return userPlatform;
		} catch (error) {
			this.logger.error('Error connecting Instagram account:', error);
			throw error;
		}
	}

	private async getInstagramProfile(userId: string, accessToken: string) {
		try {
			const response = await axios.get(`https://graph.facebook.com/v19.0/${userId}`, {
				params: {
					fields: 'username,name,profile_picture_url,media_count,followers_count,follows_count,biography,website',
					access_token: accessToken,
				},
			});
			return response.data;
		} catch (error) {
			this.logger.error('Error fetching Instagram profile:', error);
			throw error;
		}
	}
}
