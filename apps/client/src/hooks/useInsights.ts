import { getDashboardInsights, GetDashboardParams } from '@processes/insights';
import { useQuery } from '@tanstack/react-query';

export const useInsights = (params: GetDashboardParams) => {
	return useQuery({
		queryKey: ['insights', 'dashboard', params.userPlatformId],
		queryFn: () => getDashboardInsights(params),
		enabled: !!params.userPlatformId,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
};
