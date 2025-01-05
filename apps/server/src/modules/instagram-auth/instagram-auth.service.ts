import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class InstagramAuthService {
    constructor(private readonly configService: ConfigService) {}

    private readonly clientId = this.configService.get('INSTAGRAM_CLIENT_ID');
    private readonly clientSecret = this.configService.get('INSTAGRAM_CLIENT_SECRET');
    private readonly redirectUri = this.configService.get('INSTAGRAM_REDIRECT_URI');

    async exchangeCodeForToken(code: string): Promise<any> {
        const response = await axios.post('https://api.instagram.com/oauth/access_token', null, {
            params: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'authorization_code',
                redirect_uri: this.redirectUri,
                code,
            },
        });
        return response.data;
    }

    async getUserProfile(accessToken: string): Promise<any> {
        const response = await axios.get('https://graph.instagram.com/me', {
            params: {
                fields: 'id,username',
                access_token: accessToken,
            },
        });
        return response.data;
    }
}
