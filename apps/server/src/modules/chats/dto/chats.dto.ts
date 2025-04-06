import { PaginationDto } from '@common/dto/pagination.dto';
import { Sanitize } from '@decorators/sanitize.decorator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
	@IsNotEmpty()
	@IsString()
	@Sanitize()
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

export class GenerateCaptionParamsDto {
	@IsNotEmpty()
	@IsString()
	chatId: string;
}
