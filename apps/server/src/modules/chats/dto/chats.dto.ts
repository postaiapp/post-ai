import { PaginationDto } from '@common/dto/pagination.dto';
import { Escape } from 'class-sanitizer/decorators/sanitizers/escape.decorator';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';
// import { Multer } from 'multer';

export class CreateChatDto {
	@IsNotEmpty()
	@IsString()
	@Transform((params: TransformFnParams) => sanitizeHtml(params.value))
	@Escape()
	message: string;

	@IsOptional()
	@IsString()
	chatId: string;
}

export class RegenerateMessageDto {
	@IsNotEmpty()
	@IsString()
	message: string;

	@IsNotEmpty()
	@IsString()
	chatId: string;

	@IsNotEmpty()
	@IsString()
	interactionId: string;
}

export class ListChatInteractionsParamsDto {
	@IsNotEmpty()
	@IsString()
	chatId: string;
}

export class ListUserChatsQueryDto extends PaginationDto {}
