export interface EngagementMetrics {
	accountsEngaged: number;
	reach: number;
	views: number;
	profileViews: number;
	engagementRate: number;
	viewsPerReach: number;
}

export interface DashboardSummary {
	totalPosts: number;
	currentMonthPosts: number;
	scheduledPosts: number;
	publishedPosts: number;
	reach: number;
	accountsEngaged: number;
	views: number;
	profileViews: number;
	engagementRate: number;
	viewsPerReach: number;
}

export interface GetDashboardSummaryParams {
	userId: string;
	accessToken: string;
	period?: 'day' | 'week' | 'days_28';
	dbUserId?: number;
	dbUserPlatformId?: number;
}

export interface GetEngagementMetricsParams {
	userId: string;
	period?: 'day' | 'week' | 'days_28';
	accessToken: string;
}

export interface GetUserMediaParams {
	userId: string;
	accessToken: string;
	limit?: number;
}

export interface GetUserInsightsParams {
	userId: string;
	metric: string | string[];
	period: 'day' | 'week' | 'days_28';
	accessToken: string;
	since?: string;
	until?: string;
}

export interface GetPostEngagementParams {
	mediaId: string;
	accessToken: string;
}

export interface PostEngagementMetrics {
	impressions: number;
	likes: number;
	comments: number;
	shares: number;
	saves: number;
	totalEngagements: number;
	engagementRate: number;
}

/**
 * Interface abstrata para estratégias de insights de plataformas sociais
 * Cada plataforma (Instagram, TikTok, etc.) deve implementar esta interface
 */
export interface InsightsStrategy {
	/**
	 * Obtém resumo completo do dashboard para uma plataforma
	 */
	getDashboardSummary(params: GetDashboardSummaryParams): Promise<DashboardSummary>;

	/**
	 * Obtém métricas de engajamento de uma plataforma
	 */
	getEngagementMetrics(params: GetEngagementMetricsParams): Promise<EngagementMetrics>;

	/**
	 * Obtém posts/mídia do usuário
	 */
	getUserMedia(params: GetUserMediaParams): Promise<any[]>;

	/**
	 * Obtém insights específicos do usuário
	 */
	getUserInsights(params: GetUserInsightsParams): Promise<any>;

	/**
	 * Obtém métricas de engajamento de um post específico
	 */
	getPostEngagement(params: GetPostEngagementParams): Promise<PostEngagementMetrics>;
}
