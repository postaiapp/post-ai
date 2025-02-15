import { BarChart, History, Home, Leaf, Lightbulb, Salad, Tag, TrendingUp } from 'lucide-react';

const itemsSideBar = [
	{
		title: 'Home',
		url: '/chat',
		icon: Home,
	},
	{
		title: 'History Posts',
		url: '/history',
		icon: History,
	},
];

const defaultPrompts = [
	{
		content: 'Post motivacional',
		icon: Lightbulb,
	},
	{
		content: 'Carrossel de marketing',
		icon: BarChart,
	},
	{
		content: 'Foco em nutrição',
		icon: Salad,
	},
	{
		content: 'Feed promocional',
		icon: Tag,
	},
	{
		content: 'Posts ao bem-estar',
		icon: Leaf,
	},
	{
		content: 'Aumentar engajamento',
		icon: TrendingUp,
	},
];

export { itemsSideBar, defaultPrompts };
