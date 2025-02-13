import { OpenaiService } from '@modules/openai/service/openai.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '@schemas/chat.schema';
import { SendMessageData } from '@type/chats';
import { Meta } from '@type/meta';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
	constructor(
		@InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
		private openaiService: OpenaiService
	) {}

	async sendMessage({ data, meta }: SendMessageData) {
		const { chatId, message } = data;
		let chat: ChatDocument;

		if (!!chatId) {
			chat = await this.chatModel.findOne({ _id: chatId, user_id: meta.userId });

			if (!chat) {
				throw new NotFoundException('CHAT_NOT_FOUND');
			}
		} else {
			chat = new this.chatModel({
				user_id: meta.userId.toString(),
				finished_at: null,
				interactions: [],
			});
		}

		// const { url } = await this.openaiService.generateImage({
		// 	prompt: data.message,
		// });

		const interactionBody = {
			user_id: meta.userId,
			request: message,
			response: 'url teste',
			is_regenerated: false,
		};

		chat.interactions.push(interactionBody);

		await chat.save();

		return {
			chat,
			interaction: interactionBody,
		};
	}

	// async regenerateResponse(chatId: string, interactionIndex: number, meta: Meta) {
	// 	const chat = await this.chatModel.findOne({ _id: chatId, user_id: meta.userId });

	// 	if (!chat || !chat.interactions[interactionIndex]) {
	// 		throw new NotFoundException('Chat ou interação não encontrada');
	// 	}

	// 	const interaction = chat.interactions[interactionIndex];

	// 	try {
	// 		const response = await this.openaiService.generateResponse(interaction.request);

	// 		chat.interactions[interactionIndex] = {
	// 			...interaction,
	// 			response,
	// 			status: 'completed',
	// 			finished_at: new Date(),
	// 		};

	// 		await chat.save();
	// 		return chat.interactions[interactionIndex];
	// 	} catch (error) {
	// 		chat.interactions[interactionIndex] = {
	// 			...interaction,
	// 			status: 'error',
	// 			finished_at: new Date(),
	// 		};

	// 		await chat.save();
	// 		throw error;
	// 	}
	// }

	async listChatInteractions(chatId: string, meta: Meta) {
		const chat = await this.chatModel.findOne({ _id: chatId, user_id: meta.userId });

		if (!chat) {
			throw new NotFoundException('CHAT_NOT_FOUND');
		}

		return chat.interactions.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
	}
}
