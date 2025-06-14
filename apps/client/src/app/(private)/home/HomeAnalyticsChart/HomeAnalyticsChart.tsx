import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AnalyticsChart = () => {
	const data = [
		{ name: 'Jan', posts: 8, alcance: 2400, engajamento: 6.8 },
		{ name: 'Fev', posts: 12, alcance: 3200, engajamento: 7.2 },
		{ name: 'Mar', posts: 15, alcance: 4100, engajamento: 8.1 },
		{ name: 'Abr', posts: 18, alcance: 4800, engajamento: 8.4 },
		{ name: 'Mai', posts: 22, alcance: 5200, engajamento: 7.9 },
		{ name: 'Jun', posts: 25, alcance: 6100, engajamento: 8.7 },
	];

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
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis
								dataKey="name"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: '#666' }}
							/>
							<YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
							<Tooltip
								contentStyle={{
									backgroundColor: 'white',
									border: 'none',
									borderRadius: '12px',
									boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
								}}
							/>
							<Line
								type="monotone"
								dataKey="alcance"
								stroke="url(#colorGradient1)"
								strokeWidth={3}
								dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
								activeDot={{ r: 8, fill: '#8b5cf6' }}
							/>
							<Line
								type="monotone"
								dataKey="posts"
								stroke="url(#colorGradient2)"
								strokeWidth={3}
								dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
								activeDot={{ r: 8, fill: '#06b6d4' }}
							/>
							<defs>
								<linearGradient id="colorGradient1" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor="#8b5cf6" />
									<stop offset="100%" stopColor="#ec4899" />
								</linearGradient>
								<linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor="#06b6d4" />
									<stop offset="100%" stopColor="#3b82f6" />
								</linearGradient>
							</defs>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
					<div className="text-center">
						<p className="text-2xl font-bold text-purple-600">+127%</p>
						<p className="text-sm text-gray-600">Crescimento</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-blue-600">6.1k</p>
						<p className="text-sm text-gray-600">Alcance Médio</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-green-600">8.4%</p>
						<p className="text-sm text-gray-600">Engajamento</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default AnalyticsChart;
