import { Platform, UserPlatform } from '@models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceBaseParamsWithFilterType } from '@type/service-base';
import { get } from 'lodash';
import { InsightsContext } from '../contexts/insights.context';
import { GetDashboardDto } from '../dtos/insights.dto';

@Injectable()
export class InsightsService {
	constructor(private readonly insightsContext: InsightsContext) {}

	async getUserPlatformInfo(
		userId: number,
		userPlatformId: number,
	): Promise<{
		accessToken: string;
		platform: Platform;
		externalId: string;
	}> {
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

		const externalId = get(profileData, 'instagram_user_id');

		if (!externalId) {
			throw new NotFoundException('EXTERNAL_ID_NOT_FOUND');
		}

		return {
			accessToken: userPlatform.auth_token.access_token,
			platform: userPlatform.platform,
			externalId,
		};
	}

	async getDashboard({
		filter,
		meta,
	}: ServiceBaseParamsWithFilterType<Record<string, unknown>, GetDashboardDto>) {
		const { accessToken, platform, externalId } = await this.getUserPlatformInfo(
			meta.userId,
			filter.userPlatformId,
		);

		const strategy = this.insightsContext.getStrategy(platform as Platform);

		return strategy.getDashboardSummary({ userId: externalId, accessToken });
	}
}
