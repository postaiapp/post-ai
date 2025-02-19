import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Get, Param, Post, Query, Response, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';
import { CreateChatDto, ListChatInteractionsParamsDto, ListUserChatsQueryDto } from '../dto/chats.dto';
import { ChatsService } from '../services/chats.service';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController extends BaseController {
	constructor(private chatService: ChatsService) {
		super();
	}

	@Post('messages')
	async sendMessage(@Body() data: CreateChatDto, @Response() res: ExpressResponse, @Meta() meta: MetaType) {
		const options = {
			data,
			meta,
		};

		try {
			const response = await this.chatService.sendMessage(options);

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Get('interactions/:chatId')
	async listChatInteractions(
		@Param() params: ListChatInteractionsParamsDto,
		@Meta() meta: MetaType,
		@Response() res: ExpressResponse
	) {
		const options = {
			params,
			meta,
		};

		try {
			const response = await this.chatService.listChatInteractions(options);

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Get()
	async listUserChats(
		@Query() query: ListUserChatsQueryDto,
		@Meta() meta: MetaType,
		@Response() res: ExpressResponse
	) {
		try {
			const response = await this.chatService.listUserChats({
				userId: meta.userId.toString(),
				pagination: { limit: query.limit, page: query.page },
			});

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}
}
