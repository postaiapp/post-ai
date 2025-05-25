import { Controller, Get, Post, Body, Query, Param, UseGuards, Response } from '@nestjs/common';
import { MetaAuthService } from '../services/meta-auth.service';
import { MetaFeedService } from '../services/meta-feed.service';
import { MetaStoriesService } from '../services/meta-stories.service';
import { MetaMetricsService } from '../services/meta-metrics.service';
import { AuthGuard } from '@guards/auth.guard';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';

@Controller('meta')
@UseGuards(AuthGuard)
export class MetaController extends BaseController {
	constructor(
		private readonly metaAuthService: MetaAuthService,
		private readonly metaFeedService: MetaFeedService,
		private readonly metaStoriesService: MetaStoriesService,
		private readonly metaMetricsService: MetaMetricsService,
	) {
		super();
	}

	@Post('auth/callback')
	async handleAuthCallback(@Body('code') code: string, @Response() res: ExpressResponse) {
		try {
			const tokenData = await this.metaAuthService.exchangeCodeForToken(code);
			const longLivedToken = await this.metaAuthService.getLongLivedToken(
				tokenData.access_token,
			);

			return this.sendSuccess({
				data: {
					...tokenData,
					...longLivedToken,
				},
				res,
			});
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Post('feed/post')
	async createFeedPost(
		@Body()
		body: {
			imageUrl: string;
			caption?: string;
			accessToken: string;
			userId: string;
		},
		@Response() res: ExpressResponse,
	) {
		try {
			const container = await this.metaFeedService.createMediaContainer(body);
			const published = await this.metaFeedService.publishMedia({
				creationId: container.id,
				accessToken: body.accessToken,
				userId: body.userId,
			});

			return this.sendSuccess({ data: published, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Post('stories/post')
	async createStory(
		@Body()
		body: {
			imageUrl: string;
			accessToken: string;
			userId: string;
		},
		@Response() res: ExpressResponse,
	) {
		try {
			const container = await this.metaStoriesService.createStoryContainer(body);
			const published = await this.metaStoriesService.publishStory(
				container.id,
				body.accessToken,
				body.userId,
			);

			return this.sendSuccess({ data: published, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Get('metrics/media/:mediaId')
	async getMediaMetrics(
		@Response() res: ExpressResponse,
		@Param('mediaId') mediaId: string,
		@Query('accessToken') accessToken: string,
		@Query('metrics') metrics?: string,
	) {
		try {
			const data = await this.metaMetricsService.getMediaInsights({
				mediaId,
				accessToken,
				metrics: metrics?.split(','),
			});

			return this.sendSuccess({ data, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Get('metrics/account')
	async getAccountMetrics(
		@Response() res: ExpressResponse,
		@Query('userId') userId: string,
		@Query('accessToken') accessToken: string,
		@Query('metrics') metrics?: string,
		@Query('period') period?: 'day' | 'week' | 'month' | 'lifetime',
	) {
		try {
			const data = await this.metaMetricsService.getAccountInsights({
				userId,
				accessToken,
				metrics: metrics?.split(','),
				period,
			});

			return this.sendSuccess({ data, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}
}
