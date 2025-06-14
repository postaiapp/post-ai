import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

import { HomeRecentPosts } from './HomeRecentPosts';

const HomePage = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold text-purple-700">Post Manager</h1>
				<p className="text-muted-foreground">Gerencie seus posts e crie conteúdo incrível</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3 mb-8">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Total de Posts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-700">128</div>
						<p className="text-xs text-muted-foreground">+12% este mês</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Alcance Total</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-700">14.2k</div>
						<p className="text-xs text-muted-foreground">+3.2k este mês</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Posts Agendados</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-700">18</div>
						<p className="text-xs text-muted-foreground">Próximos 7 dias</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Últimos Posts</CardTitle>
				</CardHeader>
				<CardContent>
					<HomeRecentPosts />
				</CardContent>
			</Card>
		</div>
	);
};

export default HomePage;
