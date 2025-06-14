import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { BarChart3, Calendar, MessageSquare, Target, TrendingUp, Users } from 'lucide-react';

import AnalyticsChart from './HomeAnalyticsChart/HomeAnalyticsChart';
import PostsList from './HomePostList/HomePostList';
import QuickActions from './HomeQuickActions/HomeQuickActions';
import StatsCard from './HomeStatsCard/HomeStatsCard';

interface HomeProps {
	handleNavigateChat: () => void;
}

const Home = ({ handleNavigateChat }: HomeProps) => {
	type TrendType = 'up' | 'neutral' | 'down';

	const stats: Array<{
		title: string;
		value: string;
		change: string;
		icon: React.ElementType;
		trend: TrendType;
		color: string;
	}> = [
		{
			title: 'Total de Posts',
			value: '128',
			change: '+12% este mês',
			icon: BarChart3,
			trend: 'up',
			color: 'from-purple-500 to-pink-500',
		},
		{
			title: 'Alcance Total',
			value: '14.2k',
			change: '+3.2k este mês',
			icon: Users,
			trend: 'up',
			color: 'from-blue-500 to-cyan-500',
		},
		{
			title: 'Posts Agendados',
			value: '18',
			change: 'Próximos 7 dias',
			icon: Calendar,
			trend: 'neutral',
			color: 'from-green-500 to-emerald-500',
		},
		{
			title: 'Taxa de Engajamento',
			value: '8.4%',
			change: '+2.1% vs mês anterior',
			icon: TrendingUp,
			trend: 'up',
			color: 'from-orange-500 to-red-500',
		},
	];

	return (
		<div className="h-screen bg-gray-100">
			<div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10">
				<div className="mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
								<BarChart3 className="h-6 w-6 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
									Post Manager
								</h1>
								<p className="text-gray-600">Gerencie seus posts e crie conteúdo incrível</p>
							</div>
						</div>

						<Button
							className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
							onClick={handleNavigateChat}
						>
							<MessageSquare className="h-5 w-5 mr-2" />
							Criar Post com IA
						</Button>
					</div>
				</div>
			</div>

			<div className="mx-auto px-6 py-8 space-y-8 bg-gray-100">
				<QuickActions />

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<StatsCard key={index} {...stat} />
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<AnalyticsChart />
					</div>

					<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Target className="h-5 w-5 text-purple-500" />
								<span>Metas do Mês</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">Posts Publicados</span>
									<span className="text-sm font-medium">32/40</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
										style={{ width: '80%' }}
									></div>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">Alcance Meta</span>
									<span className="text-sm font-medium">14.2k/20k</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
										style={{ width: '71%' }}
									></div>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">Engajamento</span>
									<span className="text-sm font-medium">8.4%/10%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
										style={{ width: '84%' }}
									></div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<PostsList />
			</div>
		</div>
	);
};

export default Home;
