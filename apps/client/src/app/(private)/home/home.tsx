import PlatformSelect from '@components/PlatformSelect/PlatformSelectContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { POST_CREATION_TIMES, ENGAGEMENT_METRICS } from '@constants/home';
import { useInsights } from '@hooks/useInsights';
import {
	calculateEngagementRate,
	calculateAverageReachPerPost,
	calculatePotentialReach,
	calculateGrowthScore,
	calculatePlatformROI,
} from '@utils/insights';
import { formatTimeFromMinutes, formatLargeNumber } from '@utils/time';
import { BarChart3, Users, AlertTriangle } from 'lucide-react';

import { UserPlatform } from '@/common/interfaces/user-platforms';

import QuickActions from './HomeQuickActions/HomeQuickActions';

interface HomeProps {
	selectedPlatform: number;
	setSelectedPlatform: (platform: number) => void;
}

const Home = ({ selectedPlatform, setSelectedPlatform }: HomeProps) => {
	const {
		data: insightsData,
		isLoading,
		error,
	} = useInsights({
		userPlatformId: selectedPlatform,
	});

	const apiData = insightsData?.data;

	const data = apiData || {
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

	const onSelectPlatform = (userPlatform: UserPlatform) => {
		setSelectedPlatform(userPlatform.id);
	};

	const renderLoadingState = () => (
		<div className="h-screen bg-gray-100 flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
				<p className="mt-4 text-gray-600">Carregando dados de insights...</p>
			</div>
		</div>
	);

	const renderErrorState = () => (
		<div className="h-screen bg-gray-100 flex items-center justify-center">
			<div className="text-center">
				<AlertTriangle size={64} className="text-purple-500 mx-auto mb-4" />
				<p className="text-gray-700 text-lg font-medium">Nenhuma plataforma conectada</p>
				<p className="text-gray-500 mt-2">Conecte uma plataforma para começar a criar posts</p>
			</div>
		</div>
	);

	if (!selectedPlatform || selectedPlatform === 0) {
	} else if (isLoading && selectedPlatform > 0) {
		return renderLoadingState();
	} else if (error && selectedPlatform > 0) {
		return renderErrorState();
	}

	return (
		<TooltipProvider>
			<div className="h-screen bg-gray-100">
				<div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10">
					<div className="mx-auto px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
									<BarChart3 className="h-6 w-6 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-purple-500">Dashboard</h1>
									<p className="text-gray-600">Gerencie seus posts e crie conteúdo incrível</p>
								</div>
							</div>

							<PlatformSelect onSelectPlatform={onSelectPlatform} />
						</div>
					</div>
				</div>

				<div className="mx-auto px-6 py-8 space-y-8 bg-gray-100">
					<QuickActions />

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<Tooltip>
							<TooltipTrigger asChild>
								<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium text-gray-600">
											Total de Posts
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{data.totalPosts}</div>
										<p className="text-xs text-gray-500">{data.currentMonthPosts} este mês</p>
									</CardContent>
								</Card>
							</TooltipTrigger>
							<TooltipContent>
								<p>Número total de posts publicados na conta</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium text-gray-600">
											Alcance Total
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{formatLargeNumber(data.reach)}</div>
										<p className="text-xs text-gray-500">contas alcançadas</p>
									</CardContent>
								</Card>
							</TooltipTrigger>
							<TooltipContent>
								<p>Número total de contas únicas que viram seu conteúdo</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium text-gray-600">
											Posts Agendados
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{data.scheduledPosts}</div>
										<p className="text-xs text-gray-500">próximos 7 dias</p>
									</CardContent>
								</Card>
							</TooltipTrigger>
							<TooltipContent>
								<p>Posts programados para publicação nos próximos 7 dias</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium text-gray-600">
											Taxa de Engajamento
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{data.engagementRate.toFixed(1)}%</div>
										<p className="text-xs text-gray-500">média geral</p>
									</CardContent>
								</Card>
							</TooltipTrigger>
							<TooltipContent>
								<p>Porcentagem de contas que interagiram com seu conteúdo</p>
							</TooltipContent>
						</Tooltip>
					</div>

					{/* Cards de métricas detalhadas */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Users className="h-5 w-5 text-purple-500" />
									<span>Métricas de Engajamento</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="text-center p-4 bg-purple-50 rounded-lg">
												<div className="text-2xl font-bold text-purple-600">
													{data.accountsEngaged}
												</div>
												<div className="text-sm text-gray-600">Contas Engajadas</div>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Número de contas que interagiram com seu conteúdo</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<div className="text-center p-4 bg-blue-50 rounded-lg">
												<div className="text-2xl font-bold text-blue-600">
													{formatLargeNumber(data.views)}
												</div>
												<div className="text-sm text-gray-600">Visualizações</div>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Número total de visualizações do seu conteúdo</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<div className="text-center p-4 bg-green-50 rounded-lg">
												<div className="text-2xl font-bold text-green-600">
													{data.profileViews}
												</div>
												<div className="text-sm text-gray-600">Visitas ao Perfil</div>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Número de vezes que seu perfil foi acessado</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<div className="text-center p-4 bg-orange-50 rounded-lg">
												<div className="text-2xl font-bold text-orange-600">
													{data.viewsPerReach.toFixed(1)}x
												</div>
												<div className="text-sm text-gray-600">Views por Alcance</div>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Relação entre visualizações e alcance</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<BarChart3 className="h-5 w-5 text-purple-500" />
									<span>Análise de Posts</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<PostsAnalysisCard data={data} />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
};

const PostsAnalysisCard = ({ data }: { data: any }) => {
	const totalPosts = data.totalPosts || 0;
	const currentMonthPosts = data.currentMonthPosts || 0;
	const scheduledPosts = data.scheduledPosts || 0;
	const publishedPosts = data.publishedPosts || 0;
	const reach = data.reach || ENGAGEMENT_METRICS.AVERAGE_REACH_PER_POST;
	const accountsEngaged = data.accountsEngaged || 0;

	// Calcula tempo economizado primeiro
	const timeSaved = totalPosts * POST_CREATION_TIMES.TIME_SAVED_PER_POST;
	const avgTimePerPost = POST_CREATION_TIMES.MANUAL_CREATION_TIME;

	// Calcula métricas usando funções utilitárias
	// Usa a taxa de engajamento real do backend se disponível, senão calcula
	const engagementRate = data.engagementRate || calculateEngagementRate(accountsEngaged, reach);
	const avgReachPerPost = calculateAverageReachPerPost(reach, publishedPosts);
	const potentialReach = calculatePotentialReach(scheduledPosts, avgReachPerPost);
	const growthScore = calculateGrowthScore(currentMonthPosts, totalPosts, engagementRate);
	const platformROI = calculatePlatformROI(timeSaved, totalPosts, engagementRate);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-4">
				<div className="text-center p-4 bg-purple-50 rounded-lg group relative">
					<div className="text-2xl font-bold text-purple-500">{formatTimeFromMinutes(timeSaved)}</div>
					<div className="text-sm text-gray-600">Tempo Economizado</div>
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
						Tempo que você economizou
						<br />
						usando nossa plataforma
						<br />({POST_CREATION_TIMES.TIME_SAVED_PER_POST}min por post)
						<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
					</div>
				</div>
				<div className="text-center p-4 bg-purple-50 rounded-lg group relative">
					<div className="text-2xl font-bold text-purple-400">{formatLargeNumber(potentialReach)}</div>
					<div className="text-sm text-gray-600">Alcance Potencial</div>
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
						Pessoas que podem ver
						<br />
						seus posts agendados
						<br />({scheduledPosts} posts × {Math.round(avgReachPerPost)} alcance ×{' '}
						{ENGAGEMENT_METRICS.SCHEDULED_POST_MULTIPLIER}x boost)
						<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
					</div>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex justify-between items-center group relative">
					<span className="text-sm text-gray-600">Taxa de Engajamento</span>
					<span className="text-sm font-medium">{engagementRate.toFixed(1)}%</span>
					<div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
						Porcentagem de pessoas que
						<br />
						interagiram com seus posts
						<br />({accountsEngaged} engajamentos / {reach} alcance)
						<div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
					</div>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-purple-500 h-2 rounded-full"
						style={{
							width: `${Math.min(engagementRate, 100)}%`,
						}}
					></div>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex justify-between items-center group relative">
					<span className="text-sm text-gray-600">ROI da Plataforma</span>
					<span className="text-sm font-medium">
						{platformROI > 0 ? '+' : ''}
						{platformROI}%
					</span>
					<div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
						Retorno sobre investimento
						<br />
						da nossa plataforma
						<br />
						(Tempo + Engajamento - Custo)
						<div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
					</div>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className={`h-2 rounded-full ${platformROI >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
						style={{
							width: `${Math.min(Math.abs(platformROI), 100)}%`,
						}}
					></div>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex justify-between items-center group relative">
					<span className="text-sm text-gray-600">Score de Crescimento</span>
					<span className="text-sm font-medium">{growthScore}/100</span>
					<div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
						Score baseado em:
						<br />
						• Consistência (30%)
						<br />
						• Engajamento (40%)
						<br />• Crescimento (30%)
						<div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
					</div>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className={`h-2 rounded-full ${growthScore >= 70 ? 'bg-green-500' : growthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
						style={{
							width: `${growthScore}%`,
						}}
					></div>
				</div>
			</div>

			<div className="text-center p-3 bg-purple-50 rounded-lg group relative">
				<div className="text-sm font-medium text-purple-600">
					✨ {scheduledPosts > 0 ? `${scheduledPosts} posts agendados` : 'Comece a agendar posts!'}
				</div>
				<div className="text-xs text-gray-600 mt-1">
					{scheduledPosts > 0
						? `Economize ${formatTimeFromMinutes(scheduledPosts * POST_CREATION_TIMES.TIME_SAVED_PER_POST)} criando posts!`
						: growthScore >= 70
							? 'Excelente! Continue assim!'
							: growthScore >= 40
								? 'Bom progresso! Agende mais posts!'
								: 'Automatize sua presença online'}
				</div>
				<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
					Tempo médio para produzir
					<br />
					um post manualmente: {avgTimePerPost}min
					<br />
					Com nossa plataforma: {POST_CREATION_TIMES.PLATFORM_CREATION_TIME}min
					<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
				</div>
			</div>
		</div>
	);
};

export default Home;
