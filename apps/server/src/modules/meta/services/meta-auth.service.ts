import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MetaAuthService {
  private readonly logger = new Logger(MetaAuthService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('META_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('META_CLIENT_SECRET');
    this.redirectUri = this.configService.get<string>('META_REDIRECT_URI');
  }

  async getAuthUrl(): Promise<string> {
    const scopes = [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement'
    ].join(',');

    return `https://api.instagram.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${scopes}&response_type=code`;
  }

  async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    user_id: string;
  }> {
    try {
      const response = await axios.post('https://api.instagram.com/oauth/access_token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        code
      });

      return {
        access_token: response.data.access_token,
        user_id: response.data.user_id
      };
    } catch (error) {
      this.logger.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  async getLongLivedToken(accessToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    try {
      const response = await axios.get('https://graph.instagram.com/access_token', {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: this.clientSecret,
          access_token: accessToken
        }
      });

      return response.data;
    } catch (error) {
      this.logger.error('Error getting long-lived token:', error);
      throw error;
    }
  }

  async refreshLongLivedToken(accessToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    try {
      const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: accessToken
        }
      });

      return response.data;
    } catch (error) {
      this.logger.error('Error refreshing long-lived token:', error);
      throw error;
    }
  }
}
