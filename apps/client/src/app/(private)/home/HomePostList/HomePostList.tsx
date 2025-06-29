import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { CheckCircle, Clock, Eye, Heart, MessageCircle, MoreHorizontal, XCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

const PostsList = () => {
	const posts = [
		{
			id: 1,
			title: 'Post Motivacional - Sucesso no Marketing Digital',
			platform: 'Instagram',
			status: 'agendado',
			date: '19/02/2025',
			views: '1.2k',
			likes: '234',
			comments: '45',
			image: '/lovable-uploads/76a0e767-5220-4a1e-8148-b0ca2607d22a.png',
			preview: 'Descubra as estratégias que transformaram nossos resultados...',
		},
		{
			id: 2,
			title: 'Post sobre Receita Especial',
			platform: 'Meta',
			status: 'não publicado',
			date: '19/02/2025',
			views: '875',
			likes: '156',
			comments: '28',
			image: null,
			preview: 'Uma receita incrível que vai surpreender toda a família...',
		},
		{
			id: 3,
			title: 'Dicas de Produtividade',
			platform: 'TikTok',
			status: 'cancelado',
			date: '19/02/2025',
			views: '2.4k',
			likes: '378',
			comments: '67',
			image: null,
			preview: 'Organize sua rotina com essas dicas práticas...',
		},
		{
			id: 4,
			title: 'Marketing Digital para Iniciantes',
			platform: 'X',
			status: 'agendado',
			date: '20/02/2025',
			views: '650',
			likes: '89',
			comments: '23',
			image: null,
			preview: 'Primeiros passos no mundo do marketing digital...',
		},
		{
			id: 5,
			title: 'Tendências 2025',
			platform: 'Instagram',
			status: 'publicado',
			date: '18/02/2025',
			views: '3.1k',
			likes: '567',
			comments: '89',
			image: null,
			preview: 'As principais tendências que vão dominar 2025...',
		},
	];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'agendado':
				return (
					<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
						<Clock className="h-3 w-3 mr-1" />
						Agendado
					</Badge>
				);
			case 'publicado':
				return (
					<Badge className="bg-green-100 text-green-800 hover:bg-green-200">
						<CheckCircle className="h-3 w-3 mr-1" />
						Publicado
					</Badge>
				);
			case 'cancelado':
				return (
					<Badge className="bg-red-100 text-red-800 hover:bg-red-200">
						<XCircle className="h-3 w-3 mr-1" />
						Cancelado
					</Badge>
				);
			case 'não publicado':
				return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Rascunho</Badge>;
			default:
				return <Badge>Desconhecido</Badge>;
		}
	};

	const getPlatformColor = (platform: string) => {
		switch (platform) {
			case 'Instagram':
				return 'bg-gradient-to-r from-purple-500 to-pink-500';
			case 'Meta':
				return 'bg-blue-600';
			case 'TikTok':
				return 'bg-black';
			case 'X':
				return 'bg-gray-800';
			default:
				return 'bg-gray-500';
		}
	};

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Últimos Posts</span>
					<Button variant="outline" size="sm" onClick={() => redirect('/history')}>
						Ver Todos
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{posts.map((post) => (
						<div
							key={post.id}
							className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-all duration-300 group"
						>
							<div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
								{post.image ? (
									<img src={post.image} alt={post.title} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
										<span className="text-gray-400 text-xs">Sem imagem</span>
									</div>
								)}
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-center space-x-2 mb-1">
									<h4 className="font-medium text-gray-900 truncate">{post.title}</h4>
									<div
										className={`px-2 py-1 rounded text-xs text-white ${getPlatformColor(post.platform)}`}
									>
										{post.platform}
									</div>
								</div>
								<p className="text-sm text-gray-600 truncate mb-2">{post.preview}</p>
								<div className="flex items-center space-x-4 text-sm text-gray-500">
									<span className="flex items-center space-x-1">
										<Eye className="h-4 w-4" />
										<span>{post.views}</span>
									</span>
									<span className="flex items-center space-x-1">
										<Heart className="h-4 w-4" />
										<span>{post.likes}</span>
									</span>
									<span className="flex items-center space-x-1">
										<MessageCircle className="h-4 w-4" />
										<span>{post.comments}</span>
									</span>
								</div>
							</div>

							<div className="flex items-center space-x-4">
								<div className="text-right">
									{getStatusBadge(post.status)}
									<p className="text-sm text-gray-500 mt-1">{post.date}</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default PostsList;
