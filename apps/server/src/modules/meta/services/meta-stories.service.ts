import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface CreateStoryContainerParams {
	imageUrl: string;
	accessToken: string;
	userId: string;
}

@Injectable()
export class MetaStoriesService {
	private readonly logger = new Logger(MetaStoriesService.name);
	private readonly apiVersion: string;

	constructor(private configService: ConfigService) {
		this.apiVersion = this.configService.get<string>('META_API_VERSION') || 'v21.0';
	}

	async createStoryContainer({
		imageUrl,
		accessToken,
		userId,
	}: CreateStoryContainerParams): Promise<{ id: string }> {
		try {
			const response = await axios.post(
				`https://graph.instagram.com/${this.apiVersion}/${userId}/media`,
				{
					image_url: imageUrl,
					media_type: 'STORIES',
					access_token: accessToken,
				},
			);

			return response.data;
		} catch (error) {
			this.logger.error('Error creating story container:', error);
			throw error;
		}
	}

	async publishStory(
		creationId: string,
		accessToken: string,
		userId: string,
	): Promise<{ id: string }> {
		try {
			const response = await axios.post(
				`https://graph.instagram.com/${this.apiVersion}/${userId}/media_publish`,
				{
					creation_id: creationId,
					access_token: accessToken,
				},
			);

			return response.data;
		} catch (error) {
			this.logger.error('Error publishing story:', error);
			throw error;
		}
	}

	async getStoryStatus(
		mediaId: string,
		accessToken: string,
	): Promise<{
		status_code: string;
		status: string;
	}> {
		try {
			const response = await axios.get(
				`https://graph.instagram.com/${this.apiVersion}/${mediaId}`,
				{
					params: {
						fields: 'status_code,status',
						access_token: accessToken,
					},
				},
			);

			return response.data;
		} catch (error) {
			this.logger.error('Error getting story status:', error);
			throw error;
		}
	}
}
