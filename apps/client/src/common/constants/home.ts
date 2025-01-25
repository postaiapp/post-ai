import { BarChart, Calendar, History, Home, Leaf, Lightbulb, Salad, Search, Tag, TrendingUp } from 'lucide-react';

export const itemsSideBar = [
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
    {
        title: 'Calendar',
        url: '/calendar',
        icon: Calendar,
    },
    {
        title: 'Search',
        url: '/search',
        icon: Search,
    },
];

export const defaultPrompts = [
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
