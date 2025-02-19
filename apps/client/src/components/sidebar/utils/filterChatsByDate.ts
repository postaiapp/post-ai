import { Chat } from '@common/interfaces/chat';

export const filterChatsByDate = (chats: Chat[]) => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const last7Days = new Date(today);
	last7Days.setDate(last7Days.getDate() - 7);

	const last30Days = new Date(today);
	last30Days.setDate(last30Days.getDate() - 30);

	const todayChats = chats.filter((chat) => {
		const chatDate = new Date(chat.createdAt);
		return chatDate.toDateString() === today.toDateString();
	});

	const yesterdayChats = chats.filter((chat) => {
		const chatDate = new Date(chat.createdAt);
		return chatDate.toDateString() === yesterday.toDateString();
	});

	const remainingChats = chats.filter((chat) => {
		const chatDate = new Date(chat.createdAt);
		return chatDate.toDateString() !== today.toDateString() && chatDate.toDateString() !== yesterday.toDateString();
	});

	const last7DaysChats = remainingChats.filter((chat) => {
		const chatDate = new Date(chat.createdAt);
		return chatDate >= last7Days && chatDate < yesterday;
	});

	const last30DaysChats = remainingChats.filter((chat) => {
		const chatDate = new Date(chat.createdAt);
		return chatDate >= last30Days && chatDate < last7Days;
	});

	return {
		today: todayChats,
		yesterday: yesterdayChats,
		last7Days: last7DaysChats,
		last30Days: last30DaysChats,
	};
};
