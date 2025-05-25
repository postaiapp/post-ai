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
      const response = await axios.post('https://api.instagram.com/oauth/access_token', {
        client_id: this.appId,
        client_secret: this.appSecret,
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
          client_secret: this.appSecret,
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
