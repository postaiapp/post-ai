import { OpenaiService } from '@modules/openai/service/openai.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '@schemas/chat.schema';
import { Interaction } from '@schemas/interaction.schema';
import { SendMessageData } from '@type/chats';
import { Meta } from '@type/meta';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
	constructor(
		@InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
		private openaiService: OpenaiService
	) {}

	async findChat(chatId: string, userId: string) {
		const chat = await this.chatModel.findOne({
			_id: chatId,
			user_id: userId,
			finished_at: null,
		});

		if (!chat) {
			throw new NotFoundException('CHAT_NOT_FOUND');
		}

		return chat;
	}

	async sendMessage({ data, meta }: SendMessageData) {
		const { chatId, message } = data;
		let chat: ChatDocument;

		if (!!chatId) {
			chat = await this.findChat(chatId, meta.userId.toString());
		} else {
			chat = new this.chatModel({
				user_id: meta.userId.toString(),
				finished_at: null,
				interactions: [],
				first_message: message,
			});
		}

		const { url } = await this.openaiService.generateImage({
			prompt: data.message,
		});

		if (!url) {
			throw new BadRequestException('IMAGE_GENERATION_FAILED');
		}

		const interactionBody = {
			user_id: meta.userId.toString(),
			request: message,
			response: url,
			is_regenerated: false,
			created_at: dayjs().toDate(),
		};

		chat.interactions.push(interactionBody);

		await chat.save();

		return {
			chat: {
				userId: chat.user_id,
				interactions: chat.interactions,
				firstMessage: chat.first_message,
				id: chat._id,
				createdAt: chat.created_at,
			},
			interaction: {
				request: interactionBody.request,
				response: interactionBody.response,
				isRegenerated: interactionBody.is_regenerated,
			},
		};
	}

	async getChatContext(interactions: Interaction[]) {
		const context = interactions.map((interaction) => interaction.request).join('\n');

		return context;
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

		return chat.interactions.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
	}
}
