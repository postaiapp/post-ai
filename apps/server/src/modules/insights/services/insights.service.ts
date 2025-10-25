import { Platform, UserPlatform, Post } from '@models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceBaseParamsWithFilterType } from '@type/service-base';
import { get } from 'lodash';
import * as dayjs from 'dayjs';
import { Op } from 'sequelize';
import { InsightsContext } from '../contexts/insights.context';
import { GetDashboardDto } from '../dtos/insights.dto';
import { DashboardSummary } from '../interfaces/insights-strategy.interface';

@Injectable()
export class InsightsService {
	constructor(
		private readonly insightsContext: InsightsContext,
		@InjectModel(Post)
		private readonly postModel: typeof Post,
	) {}

	async getUserPlatformInfo(
		userId: number,
		userPlatformId: number,
	): Promise<{
		accessToken: string;
		platform: Platform;
		externalId: string;
	}> {
		console.log('getUserPlatformInfo', userId, userPlatformId);

		const userPlatform = await UserPlatform.scope(['withPlatform', 'withAuthToken']).findOne({
			where: {
				id: userPlatformId,
				user_id: userId,
			},
			raw: true,
			nest: true,
			attributes: ['profile_data'],
		});

		if (!userPlatform) {
			throw new NotFoundException('USER_PLATFORM_NOT_FOUND');
		}

		const profileData = userPlatform.profile_data;
		const platformName = userPlatform.platform.name;

		// Obtém o ID externo baseado na plataforma
		const externalId = this.getExternalIdByPlatform(platformName, profileData);

		if (!externalId) {
			throw new NotFoundException(`EXTERNAL_ID_NOT_FOUND for platform: ${platformName}`);
		}

		return {
			accessToken: userPlatform.auth_token.access_token,
			platform: userPlatform.platform,
			externalId,
		};
	}

	private getExternalIdByPlatform(platformName: string, profileData: any): string {
		switch (platformName) {
			case 'INSTAGRAM':
				return get(profileData, 'instagram_user_id');
			case 'TIKTOK':
				return get(profileData, 'tiktok_user_id');
			case 'FACEBOOK':
				return get(profileData, 'facebook_user_id');
			case 'TWITTER':
				return get(profileData, 'twitter_user_id');
			default:
				return get(profileData, `${platformName.toLowerCase()}_user_id`);
		}
	}

	async getDashboard({
		filter,
		meta,
	}: ServiceBaseParamsWithFilterType<
		Record<string, unknown>,
		GetDashboardDto
	>): Promise<DashboardSummary> {
		const { accessToken, platform, externalId } = await this.getUserPlatformInfo(
			meta.userId,
			filter.userPlatformId,
		);

		const scheduledPosts = await this.getScheduledPostsCount(
			meta.userId,
			filter.userPlatformId,
		);

		const strategy = this.insightsContext.getStrategy(platform as Platform);

		const dashboardData = await strategy.getDashboardSummary({
			userId: externalId,
			accessToken,
			dbUserId: meta.userId,
			dbUserPlatformId: filter.userPlatformId,
		});

		return {
			...dashboardData,
			scheduledPosts,
		};
	}

	private async getScheduledPostsCount(userId: number, userPlatformId: number): Promise<number> {
		const now = dayjs();
		const nextWeek = now.add(7, 'day');

		const count = await this.postModel.count({
			where: {
				creator_id: userId,
				account_id: userPlatformId,
				scheduled_at: {
					[Op.between]: [now.toDate(), nextWeek.toDate()],
				},
				canceled_at: null,
			},
		});

		return count;
	}

	getSupportedPlatforms(): string[] {
		return this.insightsContext.getSupportedPlatforms();
	}
}
