import { InstagramClient } from '@clients';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MetaAuthService {
	private readonly logger = new Logger(MetaAuthService.name);
	private readonly appId: string;
	private readonly appSecret: string;
	private readonly redirectUri: string;

	constructor(private configService: ConfigService) {
		this.appId = this.configService.get<string>('META_INSTAGRAM_APP_ID');
		this.appSecret = this.configService.get<string>('META_INSTAGRAM_SECRET_KEY');
		this.redirectUri = this.configService.get<string>('META_REDIRECT_URI');
	}

	async exchangeCodeForToken(code: string): Promise<{
		access_token: string;
		user_id: string;
	}> {
		try {
			console.log(this.redirectUri, 'this.redirectUri');
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

			console.log('response', response.data);

			return {
				access_token: response.data.access_token,
				user_id: response.data.user_id,
			};
		} catch (error) {
			console.log('error', JSON.stringify(error.response.data, null, 2));
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

	async refreshLongLivedToken(accessToken: string): Promise<{
		access_token: string;
		token_type: string;
		expires_in: number;
	}> {
		const response = await InstagramClient({
			method: 'GET',
			url: '/refresh_access_token',
			params: {
				grant_type: 'ig_refresh_token',
				access_token: accessToken,
			},
		});

		return response.data;
	}
}
