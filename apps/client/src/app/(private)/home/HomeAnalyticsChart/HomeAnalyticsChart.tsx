import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { TrendingUp, Calendar, Users, Eye } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PerformanceData {
	date: string;
	reach: number;
	accountsEngaged: number;
	views: number;
	profileViews: number;
}

interface AnalyticsChartProps {
	performanceData?: PerformanceData[];
}

const AnalyticsChart = ({ performanceData }: AnalyticsChartProps) => {
	const formatChartData = (data: PerformanceData[] = []) => {
		return data
			.filter(item => item.date && item.date !== 'Invalid Date' && item.date !== 'Invalid date')
			.map(item => {
				const date = new Date(item.date);
				// Verifica se a data é válida
				if (isNaN(date.getTime())) {
					return null;
				}
				return {
					name: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
					alcance: item.reach,
					engajamento: item.accountsEngaged,
					visualizacoes: item.views,
					date: date,
				};
			})
			.filter(item => item !== null)
			.sort((a, b) => a!.date.getTime() - b!.date.getTime());
	};

	const chartData = formatChartData(performanceData);

	const calculateTotalReach = (data: PerformanceData[] = []) => {
		return data.reduce((sum, day) => sum + day.reach, 0);
	};

	const calculateTotalEngagement = (data: PerformanceData[] = []) => {
		return data.reduce((sum, day) => sum + day.accountsEngaged, 0);
	};

	const calculateAverageEngagementRate = (totalReach: number, totalEngagement: number) => {
		if (totalReach === 0) return 0;
		return (totalEngagement / totalReach) * 100;
	};

	const calculateGrowthPercentage = (data: PerformanceData[] = []) => {
		if (data.length < 2) return 0;

		const midPoint = Math.floor(data.length / 2);
		const firstHalf = data.slice(0, midPoint);
		const secondHalf = data.slice(midPoint);

		const firstHalfReach = firstHalf.reduce((sum, day) => sum + day.reach, 0);
		const secondHalfReach = secondHalf.reduce((sum, day) => sum + day.reach, 0);

		if (firstHalfReach === 0) return 0;
		return ((secondHalfReach - firstHalfReach) / firstHalfReach) * 100;
	};

	const totalReach = calculateTotalReach(performanceData);
	const totalEngagement = calculateTotalEngagement(performanceData);
	const avgEngagementRate = calculateAverageEngagementRate(totalReach, totalEngagement);
	const growthPercentage = calculateGrowthPercentage(performanceData);

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<TrendingUp className="h-5 w-5 text-purple-500" />
					<span>Análise de Performance</span>
				</CardTitle>
				<CardDescription>
					Acompanhe o crescimento dos seus posts e engajamento ao longo do tempo
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#1e1b4b" opacity={0.2} />
							<XAxis
								dataKey="name"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: '#c7d2fe' }}
							/>
							<YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#c7d2fe' }} />
							<Tooltip
								content={({ active, payload, label }) => {
									if (active && payload && payload.length) {
										return (
											<div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
												<div className="flex items-center space-x-2 mb-3">
													<Calendar className="h-4 w-4 text-purple-500" />
													<span className="font-semibold text-gray-800">{label}</span>
												</div>
												<div className="space-y-2">
													<div className="flex items-center space-x-2">
														<Users className="h-4 w-4 text-purple-500" />
														<span className="text-sm text-gray-600">Alcance:</span>
														<span className="font-medium text-purple-600">{payload[0]?.value}</span>
													</div>
													<div className="flex items-center space-x-2">
														<Eye className="h-4 w-4 text-purple-300" />
														<span className="text-sm text-gray-600">Engajamento:</span>
														<span className="font-medium text-purple-300">{payload[1]?.value}</span>
													</div>
													<div className="text-xs text-gray-500 mt-2">
														Alcance: Pessoas que viram seu conteúdo
													</div>
													<div className="text-xs text-gray-500">
														Engajamento: Pessoas que interagiram
													</div>
												</div>
											</div>
										);
									}
									return null;
								}}
							/>
							<Line
								type="monotone"
								dataKey="alcance"
								stroke="url(#colorGradient1)"
								strokeWidth={4}
								dot={{ fill: '#a855f7', strokeWidth: 2, r: 6 }}
								activeDot={{ r: 8, fill: '#a855f7' }}
							/>
							<Line
								type="monotone"
								dataKey="engajamento"
								stroke="url(#colorGradient2)"
								strokeWidth={3}
								dot={{ fill: '#d8b4fe', strokeWidth: 2, r: 5 }}
								activeDot={{ r: 7, fill: '#d8b4fe' }}
							/>
							<defs>
								<linearGradient id="colorGradient1" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor="#a855f7" />
									<stop offset="100%" stopColor="#9333ea" />
								</linearGradient>
								<linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor="#d8b4fe" />
									<stop offset="100%" stopColor="#c084fc" />
								</linearGradient>
							</defs>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
					<div className="text-center group relative">
						<p className="text-2xl font-bold text-purple-500">
							{growthPercentage > 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
						</p>
						<p className="text-sm text-gray-600">Crescimento</p>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
							Variação percentual do alcance<br />
							comparado ao período anterior
							<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
						</div>
					</div>
					<div className="text-center group relative">
						<p className="text-2xl font-bold text-purple-400">
							{totalReach >= 1000 ? (totalReach / 1000).toFixed(1) + 'k' : totalReach}
						</p>
						<p className="text-sm text-gray-600">Alcance Total</p>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
							Total de pessoas que viram<br />
							seu conteúdo no período
							<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
						</div>
					</div>
					<div className="text-center group relative">
						<p className="text-2xl font-bold text-purple-500">{avgEngagementRate.toFixed(1)}%</p>
						<p className="text-sm text-gray-600">Engajamento</p>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
							Taxa média de interação<br />
							(comentários, curtidas, etc.)
							<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default AnalyticsChart;
