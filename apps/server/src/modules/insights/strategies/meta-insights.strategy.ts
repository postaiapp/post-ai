import { MetaProvider } from '@common/providers/meta.provider';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Logger } from 'testcontainers/build/common';

interface EngagementMetrics {
	accountsEngaged: number;
	reach: number;
	views: number;
	engagementRate: number;
	viewsPerReach: number;
}

interface InsightData {
	name: string;
	period: string;
	total_value: { value: number };
}

@Injectable()
export class MetaInsightsStrategy extends MetaProvider {
	private readonly metaInsightsStrategyLogger = new Logger(MetaInsightsStrategy.name);

	constructor() {
		super();
	}

	async getUserMedia({
		userId,
		accessToken,
		limit = 100,
	}: {
		userId: string;
		accessToken: string;
		limit?: number;
	}) {
		const params = {
			fields: 'id,media_type,media_url,permalink,timestamp,caption',
			limit,
			access_token: accessToken,
		};

		try {
			const res = await super.getMetaUserMedia({ userId, params });

			return res.data;
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting user media:', error);
			throw error;
		}
	}

	async getUserInsights({
		userId,
		metric,
		period,
		since,
		until,
		accessToken,
	}: {
		userId: string;
		metric: string | string[];
		period: 'day' | 'week' | 'days_28';
		since?: string;
		until?: string;
		accessToken: string;
	}) {
		const params: any = {
			metric: Array.isArray(metric) ? metric.join(',') : metric,
			period,
			access_token: accessToken,
			metric_type: 'total_value',
		};

		if (since) params.since = since;
		if (until) params.until = until;

		try {
			const res = await super.getMetaUserInsights({
				params,
				userId,
			});

			return res;
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting user insights:', error);
			throw error;
		}
	}

	async getEngagementMetrics({
		userId,
		period = 'days_28',
		accessToken,
	}: {
		userId: string;
		period?: 'day' | 'week' | 'days_28';
		accessToken: string;
	}): Promise<EngagementMetrics> {
		try {
			const response = await this.getUserInsights({
				userId,
				metric: ['accounts_engaged', 'reach', 'views'],
				period,
				accessToken,
			});

			const metricsMap = new Map<string, number>();

			response.data.forEach((insight: InsightData) => {
				metricsMap.set(insight.name, insight.total_value?.value || 0);
			});

			const accountsEngaged = metricsMap.get('accounts_engaged') || 0;
			const reach = metricsMap.get('reach') || 0;
			const views = metricsMap.get('views') || 0;

			const engagementRate = reach > 0 ? (accountsEngaged / reach) * 100 : 0;
			const viewsPerReach = reach > 0 ? views / reach : 0;

			return {
				accountsEngaged,
				reach,
				views,
				engagementRate: Number(engagementRate.toFixed(2)),
				viewsPerReach: Number(viewsPerReach.toFixed(2)),
			};
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting engagement metrics:', error);
			throw error;
		}
	}

	async getPerformanceData({
		userId,
		accessToken,
		days = 30,
	}: {
		userId: string;
		accessToken: string;
		days?: number;
	}) {
		try {
			const endDate = moment().format('YYYY-MM-DD');
			const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');

			const insights = await this.getUserInsights({
				userId,
				metric: ['reach', 'accounts_engaged', 'views'],
				period: 'day',
				since: startDate,
				until: endDate,
				accessToken,
			});

			const processedData = insights.data.map((insight: InsightData) => ({
				metric: insight.name,
				value: insight.total_value?.value || 0,
				period: insight.period,
			}));

			return processedData;
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting performance data:', error);
			throw error;
		}
	}

	async getDashboardSummary({
		userId,
		accessToken,
		period = 'days_28',
	}: {
		userId: string;
		accessToken: string;
		period?: 'day' | 'week' | 'days_28';
	}) {
		try {
			const [userMedia, engagementMetrics, performanceData] = await Promise.all([
				this.getUserMedia({ userId, accessToken }),
				this.getEngagementMetrics({ userId, accessToken, period }),
				this.getPerformanceData({ userId, accessToken }),
			]);

			const totalPosts = userMedia?.length || 0;

			return {
				totalPosts,
				reach: engagementMetrics.reach,
				accountsEngaged: engagementMetrics.accountsEngaged,
				views: engagementMetrics.views,
				engagementRate: engagementMetrics.engagementRate,
				viewsPerReach: engagementMetrics.viewsPerReach,
				performanceData,
			};
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting dashboard summary:', error);
			throw error;
		}
	}

	async getPostEngagement({ mediaId, accessToken }: { mediaId: string; accessToken: string }) {
		try {
			const insights = await super.getMediaInsights({
				mediaId,
				metric: ['reach', 'impressions', 'likes', 'comments', 'shares', 'saves'],
				accessToken,
			});

			const metricsMap = new Map();
			insights.data.forEach((metric: any) => {
				metricsMap.set(metric.name, metric.value);
			});

			const reach = metricsMap.get('reach') || 0;
			const likes = metricsMap.get('likes') || 0;
			const comments = metricsMap.get('comments') || 0;
			const shares = metricsMap.get('shares') || 0;
			const saves = metricsMap.get('saves') || 0;

			const totalEngagements = likes + comments + shares + saves;
			const engagementRate = reach > 0 ? (totalEngagements / reach) * 100 : 0;

			return {
				impressions: metricsMap.get('impressions') || 0,
				likes,
				comments,
				shares,
				saves,
				totalEngagements,
				engagementRate: Number(engagementRate.toFixed(2)),
			};
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting post engagement:', error);
			throw error;
		}
	}
}
