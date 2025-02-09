import { Escape } from 'class-sanitizer/decorators/sanitizers/escape.decorator';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateOpenaiDto {
	@IsString()
	@IsNotEmpty()
	@Transform((params: TransformFnParams) => sanitizeHtml(params.value))
	@Escape()
	prompt: string;
}
