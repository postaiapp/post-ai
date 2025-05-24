import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface CreateMediaContainerParams {
  imageUrl: string;
  caption?: string;
  accessToken: string;
  userId: string;
}

interface PublishMediaParams {
  creationId: string;
  accessToken: string;
  userId: string;
}

@Injectable()
export class MetaFeedService {
  private readonly logger = new Logger(MetaFeedService.name);
  private readonly apiVersion: string;

  constructor(private configService: ConfigService) {
    this.apiVersion = this.configService.get<string>('META_API_VERSION') || 'v18.0';
  }

  async createMediaContainer({
    imageUrl,
    caption,
    accessToken,
    userId
  }: CreateMediaContainerParams): Promise<{ id: string }> {
    try {
      const response = await axios.post(
        `https://graph.instagram.com/${this.apiVersion}/${userId}/media`,
        {
          image_url: imageUrl,
          caption,
          access_token: accessToken
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error creating media container:', error);
      throw error;
    }
  }

  async publishMedia({
    creationId,
    accessToken,
    userId
  }: PublishMediaParams): Promise<{ id: string }> {
    try {
      const response = await axios.post(
        `https://graph.instagram.com/${this.apiVersion}/${userId}/media_publish`,
        {
          creation_id: creationId,
          access_token: accessToken
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error publishing media:', error);
      throw error;
    }
  }

  async getMediaStatus(mediaId: string, accessToken: string): Promise<{
    status_code: string;
    status: string;
  }> {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/${this.apiVersion}/${mediaId}`,
        {
          params: {
            fields: 'status_code,status',
            access_token: accessToken
          }
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error getting media status:', error);
      throw error;
    }
  }

  async createCarouselContainer(
    mediaIds: string[],
    caption: string,
    accessToken: string,
    userId: string
  ): Promise<{ id: string }> {
    try {
      const response = await axios.post(
        `https://graph.instagram.com/${this.apiVersion}/${userId}/media`,
        {
          media_type: 'CAROUSEL',
          children: mediaIds.join(','),
          caption,
          access_token: accessToken
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error creating carousel container:', error);
      throw error;
    }
  }
}
