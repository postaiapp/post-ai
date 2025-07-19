import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { MoreHorizontal } from 'lucide-react';

const RECENT_POSTS = [
	{
		id: '1',
		title: 'post conteúdo',
		status: 'agendado',
		date: '19/02/2025, 20:15',
		platform: 'Instagram',
		alcance: '1.2k',
		imageSrc: null,
	},
	{
		id: '2',
		title: 'post teste',
		status: 'não publicado',
		date: '19/02/2025, 20:15',
		platform: 'Meta',
		alcance: '875',
		imageSrc:
			'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
	},
	{
		id: '3',
		title: 'post asasasa',
		status: 'cancelado',
		date: '19/02/2025, 20:15',
		platform: 'TikTok',
		alcance: '2.4k',
		imageSrc: null,
	},
	{
		id: '4',
		title: 'post asdasdasdsa',
		status: 'agendado',
		date: '20/02/2025, 20:15',
		platform: 'X',
		alcance: '650',
		imageSrc:
			'https://images.unsplash.com/photo-1576402187878-974f70c890a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1033&q=80',
	},
	{
		id: '5',
		title: 'post marketing digital',
		status: 'publicado',
		date: '18/02/2025, 15:30',
		platform: 'Instagram',
		alcance: '3.1k',
		imageSrc:
			'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1739&q=80',
	},
];

const RecentPostsHome = () => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'agendado':
				return 'bg-blue-100 text-blue-800';
			case 'publicado':
				return 'bg-green-100 text-green-800';
			case 'cancelado':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
			{RECENT_POSTS.map((post) => (
				<div
					key={post.id}
					className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
				>
					{/* Image */}
					<div className="aspect-video bg-gray-100 relative">
						{post.imageSrc ? (
							<img src={post.imageSrc} alt={post.title} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
								Sem imagem
							</div>
						)}
						<Button
							variant="ghost"
							size="sm"
							className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/80 hover:bg-white"
						>
							<MoreHorizontal className="h-3 w-3" />
						</Button>
					</div>

					{/* Content */}
					<div className="p-3">
						<h3 className="font-medium text-sm mb-2 truncate">{post.title}</h3>

						<div className="flex items-center justify-between text-xs text-gray-500 mb-2">
							<span>{post.platform}</span>
							<span>{post.alcance}</span>
						</div>

						<div className="flex items-center justify-between">
							<Badge variant="outline" className={`${getStatusColor(post.status)} border-0 text-xs`}>
								{post.status}
							</Badge>
							<span className="text-xs text-gray-400">{post.date.split(',')[0]}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default RecentPostsHome;
