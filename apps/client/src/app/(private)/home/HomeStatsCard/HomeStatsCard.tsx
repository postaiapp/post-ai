import { Card, CardContent } from '@components/ui/card';
import { LucideIcon, Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface StatsCardProps {
	title: string;
	value: string;
	change: string;
	icon: LucideIcon;
	trend: 'up' | 'down' | 'neutral';
	color: string;
}

const StatsCard = ({ title, value, change, icon: Icon, trend, color }: StatsCardProps) => {
	const getTrendIcon = () => {
		switch (trend) {
			case 'up':
				return <TrendingUp className="h-4 w-4 text-green-500" />;
			case 'down':
				return <TrendingDown className="h-4 w-4 text-red-500" />;
			default:
				return <Minus className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 group">
			<CardContent className="p-6">
				<div className="flex items-center justify-between mb-4">
					<div
						className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
					>
						<Icon className="h-6 w-6 text-white" />
					</div>
					{getTrendIcon()}
				</div>

				<div className="space-y-2">
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-3xl font-bold text-gray-900">{value}</p>
					<p className="text-sm text-gray-500 flex items-center space-x-1">
						<span>{change}</span>
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default StatsCard;
