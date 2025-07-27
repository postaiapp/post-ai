import api from '@processes/api';

export interface GetDashboardParams {
	userPlatformId: number;
}

export interface DashboardInsights {
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

export interface DashboardResponse {
	data: DashboardInsights;
	success: boolean;
	message?: string;
}

export const getDashboardInsights = async (params: GetDashboardParams): Promise<DashboardResponse> => {
	const response = await api.get('/insights/dashboard', {
		params: {
			userPlatformId: params.userPlatformId,
		},
	});

	return response.data;
}; 