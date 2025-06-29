import { Platform, UserPlatform } from '@models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceBaseParamsWithFilterType } from '@type/service-base';
import { InsightsContext } from '../contexts/insights.context';
import { GetDashboardDto } from '../dtos/insights.dto';

@Injectable()
export class InsightsService {
	constructor(private readonly insightsContext: InsightsContext) {}

	async getUserPlatformInfo(
		userId: number,
		platformId: number,
	): Promise<{
		accessToken: string;
		platform: Platform;
	}> {
		const userPlatform = await UserPlatform.scope(['withPlatform', 'withAuthToken']).findOne({
			where: {
				platform_id: platformId,
				user_id: userId,
			},
			raw: true,
			nest: true,
		});

		if (!userPlatform) {
			throw new NotFoundException('USER_PLATFORM_NOT_FOUND');
		}

		return {
			accessToken: userPlatform.auth_token.access_token,
			platform: userPlatform.platform,
		};
	}

	async getDashboard({
		filter,
		meta,
	}: ServiceBaseParamsWithFilterType<Record<string, unknown>, GetDashboardDto>) {
		const { accessToken, platform } = await this.getUserPlatformInfo(
			meta.userId,
			filter.platformId,
		);

		const strategy = this.insightsContext.getStrategy(platform as Platform);

		return strategy.getDashboardSummary({ userId: meta.userId, accessToken });
	}
}
