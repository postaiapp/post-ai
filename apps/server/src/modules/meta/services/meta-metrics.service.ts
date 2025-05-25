import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface GetMediaInsightsParams {
	mediaId: string;
	accessToken: string;
	metrics?: string[];
}

interface GetAccountInsightsParams {
	userId: string;
	accessToken: string;
	metrics?: string[];
	period?: 'day' | 'week' | 'month' | 'lifetime';
}

@Injectable()
export class MetaMetricsService {
	private readonly logger = new Logger(MetaMetricsService.name);
	private readonly apiVersion: string;

	constructor(private configService: ConfigService) {
		this.apiVersion = this.configService.get<string>('META_API_VERSION') || 'v21.0';
	}

	async getMediaInsights({
		mediaId,
		accessToken,
		metrics = ['engagement', 'impressions', 'reach', 'saved'],
	}: GetMediaInsightsParams): Promise<any> {
		try {
			const response = await axios.get(
				`https://graph.instagram.com/${this.apiVersion}/${mediaId}/insights`,
				{
					params: {
						metric: metrics.join(','),
						access_token: accessToken,
					},
				},
			);

			return response.data;
		} catch (error) {
			this.logger.error('Error getting media insights:', error);
			throw error;
		}
	}

	async getAccountInsights({
		userId,
		accessToken,
		metrics = ['profile_views', 'reach', 'impressions', 'follower_count'],
		period = 'day',
	}: GetAccountInsightsParams): Promise<any> {
		try {
			const response = await axios.get(
				`https://graph.instagram.com/${this.apiVersion}/${userId}/insights`,
				{
					params: {
						metric: metrics.join(','),
						period,
						access_token: accessToken,
					},
				},
			);

			return response.data;
		} catch (error) {
			this.logger.error('Error getting account insights:', error);
			throw error;
		}
	}

	async getMediaComments(mediaId: string, accessToken: string): Promise<any> {
		try {
			const response = await axios.get(
				`https://graph.instagram.com/${this.apiVersion}/${mediaId}/comments`,
				{
					params: {
						access_token: accessToken,
					},
				},
			);

			return response.data;
		} catch (error) {
			this.logger.error('Error getting media comments:', error);
			throw error;
		}
	}

	async getMediaLikes(mediaId: string, accessToken: string): Promise<any> {
		try {
			const response = await axios.get(
				`https://graph.instagram.com/${this.apiVersion}/${mediaId}/likes`,
				{
					params: {
						access_token: accessToken,
					},
				},
			);

			return response.data;
		} catch (error) {
			this.logger.error('Error getting media likes:', error);
			throw error;
		}
	}
}
