import { MetaProvider } from '@modules/post/providers/meta.provider';
import { Injectable } from '@nestjs/common';
import { Logger } from 'testcontainers/build/common';

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

			return res;
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

	// --- Get Reach Insights ---
	async getReachInsights({
		userId,
		period = 'days_28',
		accessToken,
	}: {
		userId: string;
		period?: 'day' | 'week' | 'days_28';
		accessToken: string;
	}) {
		return this.getUserInsights({
			userId,
			metric: 'reach',
			period,
			accessToken,
		});
	}

	// --- Get Engagement Insights ---
	async getEngagementInsights({
		userId,
		period = 'days_28',
		accessToken,
	}: {
		userId: string;
		period?: 'day' | 'week' | 'days_28';
		accessToken: string;
	}) {
		return this.getUserInsights({
			userId,
			metric: ['engagement', 'reach', 'impressions'],
			period,
			accessToken,
		});
	}

	// --- Get Performance Data (para o gráfico) ---
	async getPerformanceData({
		userId,
		accessToken,
		startDate,
		endDate,
	}: {
		userId: string;
		accessToken: string;
		startDate: string;
		endDate: string;
	}) {
		// Para dados temporais, você precisará fazer múltiplas requisições
		// ou usar dados diários e agregar
		const insights = await this.getUserInsights({
			userId,
			metric: ['reach', 'impressions', 'engagement'],
			period: 'day',
			since: startDate,
			until: endDate,
			accessToken,
		});

		return insights;
	}

	// --- Calculate Engagement Rate ---
	async calculateEngagementRate({
		userId,
		accessToken,
	}: {
		userId: string;
		accessToken: string;
	}) {
		const insights = await this.getEngagementInsights({
			userId,
			accessToken,
		});

		// Extrair valores de engagement e reach
		const engagementData = insights.data.find((d: any) => d.name === 'engagement');
		const reachData = insights.data.find((d: any) => d.name === 'reach');

		if (engagementData && reachData) {
			const engagement = engagementData.values[0]?.value || 0;
			const reach = reachData.values[0]?.value || 0;

			const engagementRate = reach > 0 ? (engagement / reach) * 100 : 0;

			return {
				engagement,
				reach,
				engagementRate: Number(engagementRate.toFixed(1)),
			};
		}

		return { engagement: 0, reach: 0, engagementRate: 0 };
	}

	async getDashboardSummary({ userId, accessToken }: { userId: string; accessToken: string }) {
		try {
			const [allMedia, reachInsights, engagementData] = await Promise.all([
				this.getUserMedia({ userId, accessToken }),
				this.getReachInsights({ userId, accessToken }),
				this.calculateEngagementRate({ userId, accessToken }),
			]);

			console.log('allMedia', allMedia);
			console.log('reachInsights', reachInsights);
			console.log('engagementData', engagementData);

			const totalPosts = allMedia.count;
			const reach = reachInsights.data[0]?.values[0]?.value || 0;

			return {
				totalPosts,
				reach,
				engagement: engagementData.engagementRate,
				// Posts agendados devem vir do seu banco de dados
				scheduledPosts: 0, // Implementar no seu sistema
			};
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting dashboard summary:', error);
			throw error;
		}
	}
}
