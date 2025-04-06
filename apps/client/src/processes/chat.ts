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

export const regenerateMessage = async ({
	message,
	chatId,
	interactionId,
}: {
	message: string;
	chatId: string;
	interactionId: string;
}): Promise<{ data: { chat: Chat; interaction: Interaction } }> => {
	const { data }: ClientResponse = await client.post(`/chats/interactions/regenerate`, {
		message,
		chatId,
		interactionId,
	});

	return data;
};

export const getChatInteractions = async ({ chatId }: { chatId: string }): Promise<{ data: Interaction[] }> => {
	const { data }: ClientResponse = await client.get(`/chats/interactions/${chatId}`);

	return data;
};

export const getUserChats = async ({
	page,
	limit,
}: {
	page?: number;
	limit?: number;
}): Promise<{ results: Chat[]; meta: { total: number; page?: number; limit?: number } }> => {
	const { data }: ClientResponse = await client.get(`/chats`, {
		params: {
			page,
			limit,
		},
	});

	return data.data;
};

export const generateCaption = async ({ chatId }: { chatId: string }): Promise<{ data: { caption: string } }> => {
	const { data }: ClientResponse = await client.get(`/chats/${chatId}/caption`);

	return data;
};
