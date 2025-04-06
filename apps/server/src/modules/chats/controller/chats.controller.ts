import { Pagination } from '@common/dto/pagination.dto';
import { Meta } from '@decorators/meta.decorator';
import { Paginate } from '@decorators/pagination.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Get, Param, Post, Query, Response, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';
import { CreateChatDto, GenerateCaptionParamsDto, ListChatInteractionsParamsDto, RegenerateMessageDto } from '../dto/chats.dto';
import { ChatsService } from '../services/chats.service';
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController extends BaseController {
	constructor(private chatService: ChatsService) {
		super();
	}

	@Post('messages')
	@ApiBody({
		schema: {
			example: {
				message: "Generate a caption for my healthy food post",
				chatId: "507f1f77bcf86cd799439011"
			}
		}
	})
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

	@Post('interactions/regenerate')
	@ApiBody({
		schema: {
			example: {
				message: "Make it more engaging",
				chatId: "507f1f77bcf86cd799439011",
				interactionId: "507f1f77bcf86cd799439012"
			}
		}
	})
	async regenerateMessage(
		@Body() data: RegenerateMessageDto,
		@Meta() meta: MetaType,
		@Response() res: ExpressResponse
	) {
		try {
			const response = await this.chatService.regenerateMessage({
				data,
				meta,
			});

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Get('interactions/:chatId')
	@ApiParam({
		name: 'chatId',
		example: '507f1f77bcf86cd799439011'
	})
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
	async listUserChats(@Meta() meta: MetaType, @Paginate() pagination: Pagination, @Response() res: ExpressResponse) {
		try {
			const response = await this.chatService.listUserChats({
				userId: meta.userId.toString(),
				pagination,
			});

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Get(':chatId/caption')
	@ApiParam({
		name: 'chatId',
		example: '507f1f77bcf86cd799439011'
	})
	async generateCaption(@Param() params: GenerateCaptionParamsDto, @Meta() meta: MetaType, @Response() res: ExpressResponse) {
		try {
			const response = await this.chatService.generateCaption({ filter: params, meta });

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}
}
