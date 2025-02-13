import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Get, Param, Post, Response, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';
import { CreateChatDto } from '../dto/chats.dto';
import { ChatsService } from '../services/chats.service';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController extends BaseController {
	constructor(private chatService: ChatsService) {
		super();
	}

	@Post('messages')
	async sendMessage(@Body() body: CreateChatDto, @Response() res: ExpressResponse, @Meta() meta: MetaType) {
		try {
			const response = await this.chatService.sendMessage({
				data: body,
				meta,
			});

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	// @Post(':chatId/interactions/:index/regenerate')
	// async regenerateResponse(@Param('chatId') chatId: string, @Param('index') index: number) {
	// 	return this.chatService.regenerateResponse(chatId, index);
	// }

	@Get('interactions/:chatId')
	async listChatInteractions(
		@Param('chatId') chatId: string,
		@Meta() meta: MetaType,
		@Response() res: ExpressResponse
	) {
		try {
			const response = await this.chatService.listChatInteractions(chatId, meta);

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}
}
