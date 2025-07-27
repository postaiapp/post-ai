import { MetaProvider } from '@common/providers/meta.provider';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Logger } from 'testcontainers/build/common';
import { Post } from '@models/post.model';
import {
	InsightsStrategy,
	EngagementMetrics,
	GetEngagementMetricsParams,
	GetUserMediaParams,
	GetUserInsightsParams,
	GetPostEngagementParams,
	PostEngagementMetrics,
	GetDashboardSummaryParams,
	DashboardSummary,
} from '../interfaces/insights-strategy.interface';


interface InsightData {
	name: string;
	period: string;
	total_value: { value: number };
}

@Injectable()
export class MetaInsightsStrategy extends MetaProvider implements InsightsStrategy {
	private readonly metaInsightsStrategyLogger = new Logger(MetaInsightsStrategy.name);

	constructor() {
		super();
	}

	async getUserPostsFromDatabase(userId: number, userPlatformId: number) {
		try {
			const posts = await Post.findAll({
				where: {
					creatorId: userId,
					accountId: userPlatformId.toString(),
				},
				order: [['createdAt', 'DESC']],
			});

			return posts;
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting user posts from database:', error);
			return [];
		}
	}

	async getPostMetricsFromDatabase(userId: number, userPlatformId: number) {
		const posts = await this.getUserPostsFromDatabase(userId, userPlatformId);

		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		const totalPosts = posts.length;
		const currentMonthPosts = posts.filter(post => {
			const postDate = new Date(post.createdAt);
			return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
		}).length;

		const scheduledPosts = posts.filter(post => {
			return post.scheduledAt && new Date(post.scheduledAt) > now;
		}).length;

		// Calcula posts publicados (não agendados)
		const publishedPosts = posts.filter(post => {
			return !post.scheduledAt || new Date(post.scheduledAt) <= now;
		}).length;

		return {
			totalPosts,
			currentMonthPosts,
			scheduledPosts,
			publishedPosts,
		};
	}

	async getUserMedia(params: GetUserMediaParams): Promise<any[]> {
		const { userId, accessToken, limit = 100 } = params;
		const apiParams = {
			fields: 'id,media_type,media_url,permalink,timestamp,caption',
			limit,
			access_token: accessToken,
		};

		try {
			const res = await super.getMetaUserMedia({ userId, params: apiParams });
			return res.data;
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting user media:', error);
			throw error;
		}
	}

	async getUserInsights(params: GetUserInsightsParams) {
		const { userId, metric, period, accessToken, since, until } = params;
		const apiParams: any = {
			metric: Array.isArray(metric) ? metric.join(',') : metric,
			period,
			access_token: accessToken,
			metric_type: 'total_value',
		};

		// Adiciona since e until se fornecidos
		if (since) {
			apiParams.since = since;
		}
		if (until) {
			apiParams.until = until;
		}

		try {
			const res = await super.getMetaUserInsights({
				params: apiParams,
				userId,
			});
			
			return res;
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting user insights:', error);
			throw error;
		}
	}

	async getEngagementMetrics(params: GetEngagementMetricsParams): Promise<EngagementMetrics> {
		const { userId, period = 'days_28', accessToken } = params;
		try {
			// Usar período de 28 dias com datas específicas
			const now = dayjs();
			const since = now.subtract(28, 'day');
			
			const response = await this.getUserInsights({
				userId,
				metric: ['accounts_engaged', 'reach', 'views', 'profile_views'],
				period: 'days_28',
				since: since.toISOString(),
				until: now.toISOString(),
				accessToken,
			});

			const metricsMap = new Map<string, number>();

			if (response.data && Array.isArray(response.data)) {
				response.data.forEach((insight: InsightData) => {
					const value = insight.total_value?.value || 0;
					metricsMap.set(insight.name, value);
				});
			}

			const accountsEngaged = metricsMap.get('accounts_engaged') || 0;
			const reach = metricsMap.get('reach') || 0;
			const views = metricsMap.get('views') || 0;
			const profileViews = metricsMap.get('profile_views') || 0;

			const engagementRate = reach > 0 ? (accountsEngaged / reach) * 100 : 0;
			const viewsPerReach = reach > 0 ? views / reach : 0;

			return {
				accountsEngaged,
				reach,
				views,
				profileViews,
				engagementRate: Number(engagementRate.toFixed(2)),
				viewsPerReach: Number(viewsPerReach.toFixed(2)),
			};
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting engagement metrics:', error);
			
			// Verifica se é erro de insights não disponíveis
			if (error.message?.includes('insights') || error.message?.includes('permission')) {
				// Para contas pessoais, vamos usar dados estimados baseados nos posts
				return this.getEstimatedMetricsFromPosts(userId, accessToken);
			}
			
			// Retorna dados zerados quando há erro na API
			return {
				accountsEngaged: 0,
				reach: 0,
				views: 0,
				profileViews: 0,
				engagementRate: 0,
				viewsPerReach: 0,
			};
		}
	}



	private calculateCurrentMonthPosts(userMedia: any[]) {
		const now = dayjs();
		return userMedia.filter((post: any) => {
			const postDate = dayjs(post.timestamp);
			return (
				postDate.month() === now.month() &&
				postDate.year() === now.year()
			);
		}).length;
	}

	private calculateScheduledPosts(userMedia: any[]) {
		const today = dayjs();
		return userMedia.filter((post: any) => {
			const postDate = dayjs(post.timestamp);
			return postDate.isAfter(today);
		}).length;
	}



	async getDashboardSummary(params: GetDashboardSummaryParams): Promise<DashboardSummary> {
		const { userId, accessToken, period = 'days_28', dbUserId, dbUserPlatformId } = params;
		try {
			const [userMedia, engagementMetrics, postMetrics] = await Promise.all([
				this.getUserMedia({ userId, accessToken }),
				this.getEngagementMetrics({ userId, accessToken, period }),
				dbUserId && dbUserPlatformId
					? this.getPostMetricsFromDatabase(dbUserId, dbUserPlatformId)
					: Promise.resolve({ totalPosts: 0, currentMonthPosts: 0, scheduledPosts: 0, publishedPosts: 0 }),
			]);

			// Usa dados da base de dados se disponível, senão usa dados da API
			const totalPosts = postMetrics.totalPosts || userMedia?.length || 0;
			const currentMonthPosts =
				postMetrics.currentMonthPosts || this.calculateCurrentMonthPosts(userMedia || []);
			const scheduledPosts =
				postMetrics.scheduledPosts || this.calculateScheduledPosts(userMedia || []);
			const publishedPosts = postMetrics.publishedPosts || 0;

			return {
				totalPosts,
				currentMonthPosts,
				scheduledPosts,
				publishedPosts,
				reach: engagementMetrics.reach,
				accountsEngaged: engagementMetrics.accountsEngaged,
				views: engagementMetrics.views,
				profileViews: engagementMetrics.profileViews,
				engagementRate: engagementMetrics.engagementRate,
				viewsPerReach: engagementMetrics.viewsPerReach,
			};
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting dashboard summary:', error);

			return {
				totalPosts: 0,
				currentMonthPosts: 0,
				scheduledPosts: 0,
				publishedPosts: 0,
				reach: 0,
				accountsEngaged: 0,
				views: 0,
				profileViews: 0,
				engagementRate: 0,
				viewsPerReach: 0,
			};
		}
	}

	async getPostEngagement(params: GetPostEngagementParams): Promise<PostEngagementMetrics> {
		const { mediaId, accessToken } = params;
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

	private async getEstimatedMetricsFromPosts(userId: string, accessToken: string): Promise<EngagementMetrics> {
		try {
			const userMedia = await this.getUserMedia({ userId, accessToken });
			
			// Calcula métricas baseadas no número de posts
			const totalPosts = userMedia.length;
			const estimatedReach = totalPosts * 150; // Estimativa: 150 pessoas por post
			const estimatedEngagement = Math.floor(estimatedReach * 0.03); // 3% de engajamento
			const estimatedViews = estimatedReach * 2.5; // 2.5x mais views que reach
			const estimatedProfileViews = Math.floor(estimatedReach * 0.1); // 10% do reach

			return {
				accountsEngaged: estimatedEngagement,
				reach: estimatedReach,
				views: estimatedViews,
				profileViews: estimatedProfileViews,
				engagementRate: 3.0, // 3% fixo
				viewsPerReach: 2.5,
			};
		} catch (error) {
			this.metaInsightsStrategyLogger.error('Error getting estimated metrics:', error);
			return {
				accountsEngaged: 0,
				reach: 0,
				views: 0,
				profileViews: 0,
				engagementRate: 0,
				viewsPerReach: 0,
			};
		}
	}
}
