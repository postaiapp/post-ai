import { Chat } from '@common/interfaces/chat';
import { differenceInDays } from 'date-fns';

type FilteredChats = {
	today: Chat[];
	yesterday: Chat[];
	last7Days: Chat[];
	last30Days: Chat[];
};

export const filterChatsByDate = (chats: Chat[]): FilteredChats => {
	const today = new Date();

	return chats.reduce<FilteredChats>(
		(acc, chat) => {
			const daysDifference = differenceInDays(today, new Date(chat.createdAt));

			const categoryMap: Record<string, keyof FilteredChats> = {
				'0': 'today',
				'1': 'yesterday',
			};

			const category = categoryMap[daysDifference] || (daysDifference <= 7 ? 'last7Days' : 'last30Days');
			acc[category].push(chat);

			return acc;
		},
		{ today: [], yesterday: [], last7Days: [], last30Days: [] }
	);
};
