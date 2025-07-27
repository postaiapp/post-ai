import { Fragment } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Separator } from '@components/ui/separator';
import { PLATFORMS } from '@constants/platforms';
import { useInsights } from '@hooks/useInsights';
import InstagramLogo from '@public/instagram-logo.png';
import TiktokLogo from '@public/tiktok-logo.png';
import { userStore } from '@stores/index';
import { 
	BarChart3, 
	Calendar, 
	ChevronDown, 
	Link, 
	LoaderCircle, 
	LogOut, 
	Settings, 
	SquareArrowOutUpRight, 
	Trash, 
	TrendingUp, 
	Users, 
	LucideIcon 
} from 'lucide-react';
import { mountAllStats } from '@utils/insights';
import { getColorByInitials, getInitials } from '@utils/avatar';
import Image from 'next/image';

import AnalyticsChart from './HomeAnalyticsChart/HomeAnalyticsChart';
import QuickActions from './HomeQuickActions/HomeQuickActions';
import StatsCard from './HomeStatsCard/HomeStatsCard';

interface HomeProps {
	selectedPlatform: number;
	setSelectedPlatform: (platform: number) => void;
	accounts?: any[];
	handleDisconnectPlatform?: (account: any) => void;
	openPlatformModal?: () => void;
}

const Home = ({ selectedPlatform, setSelectedPlatform, accounts, handleDisconnectPlatform, openPlatformModal }: HomeProps) => {
	const { data: insightsData, isLoading, error } = useInsights({
		userPlatformId: selectedPlatform,
	});

	const getFallbackData = () => ({
		totalPosts: 0,
		currentMonthPosts: 0,
		scheduledPosts: 0,
		reach: 0,
		accountsEngaged: 0,
		views: 0,
		engagementRate: 0,
		viewsPerReach: 0,
		reachGrowth: 0,
		engagementGrowth: 0,
		performanceData: [],
	});

	const data = insightsData?.data || getFallbackData();
	const stats = mountAllStats(data);

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
				<p className="text-red-600">Erro ao carregar dados: {error?.message}</p>
				<p className="text-gray-500 mt-2">Verifique se você tem uma conta Instagram conectada</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg"
				>
					Tentar novamente
				</button>
			</div>
		</div>
	);

	if (isLoading) {
		return renderLoadingState();
	}

	if (error) {
		return renderErrorState();
	}

	return (
		<div className="h-screen bg-gray-100">
			<div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10">
				<div className="mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
								<BarChart3 className="h-6 w-6 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-purple-500">
									Dashboard
								</h1>
								<p className="text-gray-600">Gerencie seus posts e crie conteúdo incrível</p>
							</div>
						</div>

						{/* Dropdown de plataformas */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="flex items-center justify-between rounded-lg h-9 px-3 gap-2 border border-gray-200 hover:bg-gray-50"
								>
									<div className="flex items-center gap-2">
										<Link size={16} className="text-purple-500" />
										<span className="text-sm text-gray-500">Ver plataformas</span>
									</div>

									<ChevronDown size={14} className="text-gray-400" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-72 p-2 shadow-lg rounded-xl">
								{!accounts || accounts.length === 0 ? (
									<DropdownMenuItem disabled className="text-sm text-gray-500 px-4 py-2.5">
										Nenhuma plataforma encontrada
									</DropdownMenuItem>
								) : (
									accounts.map(account => (
										<Fragment key={account.id}>
											<DropdownMenuItem
												className="flex justify-between items-center px-2 rounded-lg hover:!bg-white focus:!bg-white"
												onClick={e => {
													e.stopPropagation();
												}}
											>
												<div className="flex items-center gap-2 w-full">
													<Image
														src={account.avatar_url || ''}
														alt="Avatar"
														width={32}
														height={32}
														className="rounded-full"
													/>
													<div className="flex flex-col">
														<div className="flex items-center gap-2">
															<span className="text-sm text-gray-700 max-w-[120px] truncate">
																{account.display_name}
															</span>

															{account?.platform_id === PLATFORMS.INSTAGRAM && (
																<Image
																	src={InstagramLogo.src}
																	alt="Instagram Logo"
																	width={16}
																	height={16}
																/>
															)}

															{account?.platform_id === PLATFORMS.TIKTOK && (
																<Image
																	src={TiktokLogo.src}
																	alt="Tiktok Logo"
																	width={18}
																	height={18}
																/>
															)}
														</div>
														<span className="flex-1 text-xs text-gray-500">
															@{account.profile_data?.username}
														</span>
													</div>
												</div>

												{handleDisconnectPlatform && (
													<Button
														variant="tertiary"
														disabled={account.loading}
														size="sm"
														onClick={e => {
															e.stopPropagation();
															handleDisconnectPlatform(account);
														}}
													>
														{account.loading && <LoaderCircle size={16} className="animate-spin" />}
														{!account.loading && <Trash size={16} className="text-red-500" />}
													</Button>
												)}
											</DropdownMenuItem>
										</Fragment>
									))
								)}
								<Separator className="my-2" />
								{openPlatformModal && (
									<DropdownMenuItem
										className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg"
										onClick={openPlatformModal}
									>
										<div className="flex items-center gap-2 text-purple-600">
											<SquareArrowOutUpRight size={18} />
											<span className="text-sm font-medium">Adicionar nova plataforma</span>
										</div>
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			<div className="mx-auto px-6 py-8 space-y-8 bg-gray-100">
				<QuickActions />

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<StatsCard key={index} {...stat} icon={getIconForStat(index)} />
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<AnalyticsChart performanceData={data.performanceData} />
					</div>

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
	);
};

const getIconForStat = (index: number): LucideIcon => {
	const icons = [BarChart3, Users, Calendar, TrendingUp];
	return icons[index] || BarChart3;
};

const PostsAnalysisCard = ({ data }: { data: any }) => {
	const totalPosts = data.totalPosts || 0;
	const currentMonthPosts = data.currentMonthPosts || 0;
	const scheduledPosts = data.scheduledPosts || 0;
	const reach = data.reach || 0;
	const engagementRate = data.engagementRate || 0;
	
	// Calcula métricas de valor para o usuário
	const avgReachPerPost = totalPosts > 0 ? reach / totalPosts : 0;
	const potentialReach = scheduledPosts * avgReachPerPost;
	const timeSaved = totalPosts * 15; // 15 min por post em média
	const avgTimePerPost = totalPosts > 0 ? 15 : 0; // Tempo médio para produzir um post
	
	return (
		<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
					<div className="text-center p-4 bg-purple-50 rounded-lg group relative">
						<div className="text-2xl font-bold text-purple-500">
							{timeSaved >= 60 ? `${Math.floor(timeSaved / 60)}h ${timeSaved % 60}min` : `${timeSaved}min`}
						</div>
						<div className="text-sm text-gray-600">Tempo Economizado</div>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
							Tempo que você economizou<br />
							usando nossa plataforma
							<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
						</div>
					</div>
					<div className="text-center p-4 bg-purple-50 rounded-lg group relative">
						<div className="text-2xl font-bold text-purple-400">
							{potentialReach >= 1000 ? (potentialReach / 1000).toFixed(1) + 'k' : potentialReach}
						</div>
						<div className="text-sm text-gray-600">Alcance Potencial</div>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
							Pessoas que podem ver<br />
							seus posts agendados
							<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
						</div>
					</div>
				</div>
			
			<div className="space-y-3">
				<div className="flex justify-between items-center group relative">
					<span className="text-sm text-gray-600">Taxa de Engajamento</span>
					<span className="text-sm font-medium">{engagementRate.toFixed(1)}%</span>
					<div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
						Porcentagem de pessoas que<br />
						interagiram com seus posts
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
					<span className="text-sm text-gray-600">Eficiência de Criação</span>
					<span className="text-sm font-medium">
						{totalPosts > 0 ? ((currentMonthPosts / totalPosts) * 100).toFixed(1) : '0'}%
					</span>
					<div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
						Posts criados este mês<br />
						vs total de posts
						<div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
					</div>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-purple-400 h-2 rounded-full"
						style={{
							width: `${totalPosts > 0 ? (currentMonthPosts / totalPosts) * 100 : 0}%`,
						}}
					></div>
				</div>
			</div>
			
			<div className="text-center p-3 bg-purple-50 rounded-lg group relative">
				<div className="text-sm font-medium text-purple-600">
					✨ {scheduledPosts > 0 ? `${scheduledPosts} posts agendados` : 'Comece a agendar posts!'}
				</div>
				<div className="text-xs text-gray-600 mt-1">
					{scheduledPosts > 0 ? 'Seus posts estão prontos para o futuro!' : 'Automatize sua presença online'}
				</div>
				<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
					Tempo médio para produzir<br />
					um post: {avgTimePerPost} minutos
					<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
				</div>
			</div>
		</div>
	);
};

export default Home;
