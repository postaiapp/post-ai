import { Escape } from 'class-sanitizer/decorators/sanitizers/escape.decorator';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

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

export class CreateChatParamsDto {
	@IsOptional()
	@IsString()
	chatId: string;
}
