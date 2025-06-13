import { Injectable, Logger } from '@nestjs/common';
import { Uploader } from '@type/storage';
import { PLATFORMS_IDS, PLATFORMS_NAMES } from '@constants/platforms';
import { InstagramClient } from '@clients';
import FileUtils from '@utils/file';
import { CreatePlatformDto } from '../dto/platform.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InstagramStrategy {
	private readonly logger = new Logger(InstagramStrategy.name);
	private readonly appId: string;
	private readonly appSecret: string;
	private readonly redirectUri: string;

	constructor(
		private uploader: Uploader,
		private configService: ConfigService,
	) {
		this.appId = this.configService.get<string>('META_INSTAGRAM_APP_ID');
		this.appSecret = this.configService.get<string>('META_INSTAGRAM_SECRET_KEY');
		this.redirectUri = this.configService.get<string>('META_REDIRECT_URI');
	}

	async exchangeCodeForToken(code: string): Promise<{
		access_token: string;
		user_id: string;
	}> {
		try {
			const formData = new FormData();

			formData.append('client_id', this.appId);
			formData.append('client_secret', this.appSecret);
			formData.append('grant_type', 'authorization_code');
			formData.append('redirect_uri', this.redirectUri);
			formData.append('code', code);

			const response = await axios.post(
				'https://api.instagram.com/oauth/access_token',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);

			return {
				access_token: response.data.access_token,
				user_id: response.data.user_id,
			};
		} catch (error) {
			this.logger.error('Error exchanging code for token:', error);
			throw error;
		}
	}

	async getLongLivedToken(accessToken: string): Promise<{
		access_token: string;
	}> {
		const response = await InstagramClient({
			method: 'GET',
			url: '/access_token',
			params: {
				grant_type: 'ig_exchange_token',
				client_secret: this.appSecret,
				access_token: accessToken,
			},
		});

		return response.data;
	}

	async connect(data: CreatePlatformDto, userId: number) {
		const { access_token: shortLivedToken, user_id: instagramUserId } =
			await this.exchangeCodeForToken(data.code);

		const { access_token: longLivedToken } = await this.getLongLivedToken(shortLivedToken);

		console.log(longLivedToken, 'longLivedToken');

		console.log(instagramUserId, 'instagramUserId');

		const profileInfo = await this.getInstagramProfile(instagramUserId, longLivedToken);

		console.log(profileInfo, 'profileInfo');

		const avatarUrl = profileInfo.profile_picture_url
			? (await this.uploader.downloadAndUploadImage(profileInfo.profile_picture_url)).url
			: null;

		const mountedUserPlatformToCreate = {
			user_id: userId,
			platform_id: PLATFORMS_IDS.INSTAGRAM,
			name: PLATFORMS_NAMES.INSTAGRAM,
			display_name: profileInfo.name || profileInfo.username,
			avatar_url: avatarUrl ? FileUtils.getUnsignedUrl(avatarUrl) : null,
			profile_data: {
				instagram_user_id: instagramUserId,
				username: profileInfo.username,
				followers_count: profileInfo.followers_count,
				follows_count: profileInfo.follows_count,
				media_count: profileInfo.media_count,
				biography: profileInfo.biography,
				website: profileInfo.website,
			},
		};

		console.log(
			JSON.stringify(mountedUserPlatformToCreate, null, 4),
			'mountedUserPlatformToCreate',
		);

		return {
			accessToken: longLivedToken,
			platform: mountedUserPlatformToCreate,
		};
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
