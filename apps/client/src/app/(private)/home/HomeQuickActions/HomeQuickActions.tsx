import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Calendar, Settings, Sparkles, Zap, History } from 'lucide-react';
import { redirect } from 'next/navigation';

const QuickActions = () => {
	const actions = [
		{
			title: 'Criar com IA',
			description: 'Use IA para gerar posts incríveis',
			icon: Sparkles,
			action: () => redirect('/chat'),
		},
		{
			title: 'Agendar Posts',
			description: 'Programe seus posts para o momento ideal',
			icon: Calendar,
			action: () => console.log('Agendar posts'),
		},
		{
			title: 'Histórico de Posts',
			description: 'Veja todos os seus posts',
			icon: History,
			action: () => redirect('/history'),
		},
		{
			title: 'Configurações',
			description: 'Personalize suas preferências',
			icon: Settings,
			action: () => redirect('/settings'),
		},
	];

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
			<CardContent className="p-6">
				<div className="flex items-center space-x-2 mb-6">
					<Zap className="h-5 w-5 text-purple-500" />
					<h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{actions.map((action, index) => (
						<Button
							key={index}
							variant="ghost"
							className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-purple-50 transition-all duration-300 group"
							onClick={action.action}
						>
							<div
								className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md border border-gray-100`}
							>
								<action.icon className="h-6 w-6 text-purple-500" />
							</div>
							<div className="text-center">
								<p className="font-medium text-gray-900">{action.title}</p>
								<p className="text-sm text-gray-500 pb-2">{action.description}</p>
							</div>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default QuickActions;
