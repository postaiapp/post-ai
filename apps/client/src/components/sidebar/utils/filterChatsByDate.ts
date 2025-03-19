import { Chat } from '@common/interfaces/chat';
import { differenceInDays } from 'date-fns';

export const filterChatsByDate = (chats: Chat[]) => {
	const today = new Date();

	const todayChats: Chat[] = [];
	const yesterdayChats: Chat[] = [];
	const last7DaysChats: Chat[] = [];
	const last30DaysChats: Chat[] = [];

	chats.forEach((element) => {
		const daysDifference = differenceInDays(today, new Date(element.createdAt));

		if (daysDifference === 0) {
			todayChats.push(element);
		} else if (daysDifference === 1) {
			yesterdayChats.push(element);
		} else if (daysDifference <= 7) {
			last7DaysChats.push(element);
		} else {
			last30DaysChats.push(element);
		}
	});

	return {
		today: todayChats,
		yesterday: yesterdayChats,
		last7Days: last7DaysChats,
		last30Days: last30DaysChats,
	};
};
