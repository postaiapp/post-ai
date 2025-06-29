import { FaPinterest } from 'react-icons/fa';
import { FaMeta, FaTiktok } from 'react-icons/fa6';

import { PlatformIcon } from '../interfaces/platforms';

export const PLATFORMS = {
	INSTAGRAM: 1,
	TIKTOK: 2,
};

export const PLATFORMS_ICONS: PlatformIcon[] = [
	{
		id: 1,
		label: 'Meta',
		key: 'meta',
		icon: <FaMeta className="h-5 w-5 text-blue-500" />,
		enabled: true,
	},
	{
		id: 2,
		label: 'Tik Tok',
		key: 'tiktok',
		icon: <FaTiktok className="h-5 w-5 text-gray-500" />,
		enabled: false,
	},
	{
		id: 3,
		label: 'Pinterest',
		key: 'pinterest',
		icon: <FaPinterest className="h-5 w-5 text-red-500" />,
		enabled: false,
	},
];
