import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { BarChart3, Calendar, Settings, Sparkles, Zap } from 'lucide-react';
import { redirect } from 'next/navigation';

const QuickActions = () => {
	const actions = [
		{
			title: 'Criar com IA',
			description: 'Use IA para gerar posts incríveis',
			icon: Sparkles,
			color: 'from-purple-500 to-pink-500',
			action: () => redirect('/chat'),
		},
		{
			title: 'Agendar Posts',
			description: 'Programe seus posts para o momento ideal',
			icon: Calendar,
			color: 'from-blue-500 to-cyan-500',
			action: () => console.log('Agendar posts'),
		},
		{
			title: 'Analytics',
			description: 'Veja relatórios detalhados',
			icon: BarChart3,
			disabled: true, // Temporarily disabled, can be enabled later
			color: 'from-green-500 to-emerald-500',
			action: () => console.log('Ver analytics'),
		},
		{
			title: 'Configurações',
			description: 'Personalize suas preferências',
			icon: Settings,
			color: 'from-orange-500 to-red-500',
			action: () => redirect('/settings'),
		},
	];

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
			<CardContent className="p-6">
				<div className="flex items-center space-x-2 mb-6">
					<Zap className="h-5 w-5 text-yellow-500" />
					<h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{actions.map((action, index) => (
						<Button
							disabled={action.disabled}
							key={index}
							variant="ghost"
							className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-purple-50 transition-all duration-300 group"
							onClick={action.action}
						>
							<div
								className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
							>
								<action.icon className="h-6 w-6 text-white" />
							</div>
							<div className="text-center">
								<p className="font-medium text-gray-900">{action.title}</p>
								<p className="text-sm text-gray-500 pb-2">{action.description}</p>
								{action.disabled && <p className="text-xs text-purple-500">Em breve!</p>}
							</div>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default QuickActions;
