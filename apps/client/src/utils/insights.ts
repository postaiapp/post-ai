import { DashboardInsights } from '@processes/insights';
import { ENGAGEMENT_METRICS } from '@constants/home';

export const formatNumber = (num: number): string => {
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'k';
	}
	return num.toString();
};

export const getTrendType = (growth: number): 'up' | 'down' | 'neutral' => {
	if (growth > 0) return 'up';
	if (growth < 0) return 'down';
	return 'neutral';
};

export const mountTotalPostsStats = (data: DashboardInsights) => ({
	title: 'Total de Posts',
	value: data.totalPosts?.toString() || '0',
	change: data.currentMonthPosts ? `${data.currentMonthPosts} este mês` : '0 este mês',
	trend: 'up' as const,
});

export const mountReachStats = (data: DashboardInsights) => ({
	title: 'Alcance Total',
	value: formatNumber(data.reach || 0),
	change: data.reachGrowth ? `${data.reachGrowth > 0 ? '+' : ''}${data.reachGrowth}% este mês` : '0% este mês',
	trend: getTrendType(data.reachGrowth || 0),
});

export const mountScheduledPostsStats = (data: DashboardInsights) => ({
	title: 'Posts Agendados',
	value: data.scheduledPosts?.toString() || '0',
	change: 'Próximos 7 dias',
	trend: 'neutral' as const,
});

export const mountEngagementStats = (data: DashboardInsights) => ({
	title: 'Taxa de Engajamento',
	value: `${data.engagementRate?.toFixed(1) || '0'}%`,
	change: data.engagementGrowth ? `${data.engagementGrowth > 0 ? '+' : ''}${data.engagementGrowth}% vs mês anterior` : '0% vs mês anterior',
	trend: getTrendType(data.engagementGrowth || 0),
});

export const mountAllStats = (data: DashboardInsights) => [
	mountTotalPostsStats(data),
	mountReachStats(data),
	mountScheduledPostsStats(data),
	mountEngagementStats(data),
];

export const calculateProgressPercentage = (current: number, target: number): number => {
	return Math.min((current / target) * 100, 100);
};

/**
 * Calcula a taxa de engajamento baseada em dados reais ou usa fallback
 * @param accountsEngaged - Número de contas engajadas
 * @param reach - Alcance total
 * @returns Taxa de engajamento em porcentagem
 */
export const calculateEngagementRate = (accountsEngaged: number, reach: number): number => {
	if (reach > 0) {
		return (accountsEngaged / reach) * 100;
	}
	return ENGAGEMENT_METRICS.AVERAGE_ENGAGEMENT_RATE;
};

/**
 * Calcula o alcance médio por post
 * @param totalReach - Alcance total
 * @param publishedPosts - Número de posts publicados
 * @returns Alcance médio por post
 */
export const calculateAverageReachPerPost = (totalReach: number, publishedPosts: number): number => {
	if (publishedPosts > 0) {
		return totalReach / publishedPosts;
	}
	return ENGAGEMENT_METRICS.AVERAGE_REACH_PER_POST;
};

/**
 * Calcula o alcance potencial baseado em posts agendados
 * @param scheduledPosts - Número de posts agendados
 * @param avgReachPerPost - Alcance médio por post
 * @returns Alcance potencial estimado
 */
export const calculatePotentialReach = (scheduledPosts: number, avgReachPerPost: number): number => {
	if (scheduledPosts > 0) {
		return scheduledPosts * avgReachPerPost * ENGAGEMENT_METRICS.SCHEDULED_POST_MULTIPLIER;
	}
	return 0;
};

/**
 * Calcula o crescimento de performance baseado na consistência de posts
 * @param currentMonthPosts - Posts criados no mês atual
 * @param totalPosts - Total de posts criados
 * @param engagementRate - Taxa de engajamento atual
 * @returns Score de crescimento (0-100)
 */
export const calculateGrowthScore = (currentMonthPosts: number, totalPosts: number, engagementRate: number): number => {
	// Fatores que contribuem para o score:
	// 1. Consistência de posts (30% do score)
	// 2. Taxa de engajamento (40% do score)
	// 3. Crescimento mensal (30% do score)
	
	const consistencyScore = Math.min((currentMonthPosts / 15) * 30, 30); // Meta: 15 posts/mês
	const engagementScore = Math.min((engagementRate / 5) * 40, 40); // Meta: 5% de engajamento
	const growthScore = Math.min((currentMonthPosts / Math.max(totalPosts / 12, 1)) * 30, 30); // Crescimento vs média mensal
	
	return Math.round(consistencyScore + engagementScore + growthScore);
};

/**
 * Calcula o ROI (Return on Investment) da plataforma
 * @param timeSaved - Tempo economizado em minutos
 * @param totalPosts - Total de posts criados
 * @param engagementRate - Taxa de engajamento
 * @returns ROI estimado em porcentagem
 */
export const calculatePlatformROI = (timeSaved: number, totalPosts: number, engagementRate: number): number => {
	if (totalPosts === 0) return 0;
	
	// Calcula o valor do tempo economizado (considerando valor hora de R$ 50)
	const timeValue = (timeSaved / 60) * 50;
	
	// Calcula o valor do engajamento gerado (considerando R$ 0.10 por engajamento)
	const engagementValue = (totalPosts * 500 * engagementRate / 100) * 0.10;
	
	// ROI = (valor gerado - custo) / custo * 100
	const totalValue = timeValue + engagementValue;
	const estimatedCost = totalPosts * 2; // Custo estimado de R$ 2 por post
	
	return Math.round((totalValue - estimatedCost) / estimatedCost * 100);
}; 