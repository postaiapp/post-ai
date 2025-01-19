import { Escape } from 'class-sanitizer/decorators/sanitizers/escape.decorator';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class InstagramAuthDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    @Escape()
    password: string;

    @IsString()
    @IsNotEmpty()
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    @Escape()
    username: string;
}
