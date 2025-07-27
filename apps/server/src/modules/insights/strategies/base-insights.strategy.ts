import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Post } from '@models/post.model';
import {
	InsightsStrategy,
	EngagementMetrics,
	DashboardSummary,
	GetDashboardSummaryParams,
	GetEngagementMetricsParams,
	GetUserMediaParams,
	GetUserInsightsParams,
	GetPostEngagementParams,
	PostEngagementMetrics,
} from '../interfaces/insights-strategy.interface';

/**
 * Classe base abstrata para estratégias de insights
 * Fornece implementações padrão e utilitários comuns
 */
@Injectable()
export abstract class BaseInsightsStrategy implements InsightsStrategy {
	/**
	 * Obtém resumo completo do dashboard
	 * Implementação padrão que pode ser sobrescrita
	 */
	async getDashboardSummary(params: GetDashboardSummaryParams): Promise<DashboardSummary> {
		const { userId, accessToken, period = 'days_28', dbUserId, dbUserPlatformId } = params;

		try {
			const [userMedia, engagementMetrics, postMetrics] = await Promise.all([
				this.getUserMedia({ userId, accessToken }),
				this.getEngagementMetrics({ userId, accessToken, period }),
				dbUserId && dbUserPlatformId
					? this.getPostMetricsFromDatabase(dbUserId, dbUserPlatformId)
					: Promise.resolve({
							totalPosts: 0,
							currentMonthPosts: 0,
							scheduledPosts: 0,
							publishedPosts: 0,
					  }),
			]);

			const totalPosts = postMetrics.totalPosts || userMedia?.length || 0;
			const currentMonthPosts = postMetrics.currentMonthPosts || this.calculateCurrentMonthPosts(userMedia || []);
			const scheduledPosts = postMetrics.scheduledPosts || this.calculateScheduledPosts(userMedia || []);
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
			return this.getFallbackDashboardData();
		}
	}

	/**
	 * Métodos abstratos que devem ser implementados pelas estratégias específicas
	 */
	abstract getEngagementMetrics(params: GetEngagementMetricsParams): Promise<EngagementMetrics>;
	abstract getUserMedia(params: GetUserMediaParams): Promise<any[]>;
	abstract getUserInsights(params: GetUserInsightsParams): Promise<any>;
	abstract getPostEngagement(params: GetPostEngagementParams): Promise<PostEngagementMetrics>;

	/**
	 * Obtém métricas de posts da base de dados
	 * Implementação comum para todas as plataformas
	 */
	protected async getPostMetricsFromDatabase(userId: number, userPlatformId: number) {
		try {
			const posts = await Post.findAll({
				where: {
					creatorId: userId,
					accountId: userPlatformId.toString(),
				},
				order: [['createdAt', 'DESC']],
			});

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

			const publishedPosts = posts.filter(post => {
				return !post.scheduledAt || new Date(post.scheduledAt) <= now;
			}).length;

			return {
				totalPosts,
				currentMonthPosts,
				scheduledPosts,
				publishedPosts,
			};
		} catch (error) {
			return {
				totalPosts: 0,
				currentMonthPosts: 0,
				scheduledPosts: 0,
				publishedPosts: 0,
			};
		}
	}

	/**
	 * Calcula posts do mês atual
	 */
	protected calculateCurrentMonthPosts(userMedia: any[]): number {
		const now = new Date();
		return userMedia.filter((post: any) => {
			const postDate = new Date(post.timestamp);
			return (
				postDate.getMonth() === now.getMonth() &&
				postDate.getFullYear() === now.getFullYear()
			);
		}).length;
	}

	/**
	 * Calcula posts agendados
	 */
	protected calculateScheduledPosts(userMedia: any[]): number {
		const today = new Date();
		return userMedia.filter((post: any) => {
			const postDate = new Date(post.timestamp);
			return postDate >= today;
		}).length;
	}

	/**
	 * Gera dados de fallback para o dashboard
	 */
	protected getFallbackDashboardData(): DashboardSummary {
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

	/**
	 * Atualiza dados de métricas com base no insight recebido
	 */
	protected updateMetricData(data: any, insight: any): void {
		const metricValue = insight.total_value?.value || 0;

		if (insight.name === 'reach') {
			data.reach = metricValue;
		}
		if (insight.name === 'accounts_engaged') {
			data.accountsEngaged = metricValue;
		}
		if (insight.name === 'views') {
			data.views = metricValue;
		}
		if (insight.name === 'profile_views') {
			data.profileViews = metricValue;
		}
	}
} 
