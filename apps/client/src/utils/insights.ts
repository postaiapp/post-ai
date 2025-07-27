import { DashboardInsights } from '@processes/insights';

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