import { ClientResponse } from '@common/interfaces/api';
import { Chat, Interaction } from '@common/interfaces/chat';

import client from './api';

export const sendMessage = async ({
	message,
	chatId,
}: {
	message: string;
	chatId?: string;
}): Promise<{ data: { chat: Chat; interaction: Interaction } }> => {
	const { data }: ClientResponse = await client.post(`/chats/messages`, {
		message,
		chatId,
	});

	return data;
};

export const getChatInteractions = async ({ chatId }: { chatId: string }): Promise<{ data: Interaction[] }> => {
	const { data }: ClientResponse = await client.get(`/chats/interactions/${chatId}`);

	return data;
};
