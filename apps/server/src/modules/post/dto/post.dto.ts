import { Escape } from 'class-sanitizer';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class VerifyAccountDto {
    @IsNotEmpty()
    @IsString()
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    @Escape()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Min(8)
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    @Escape()
    password: string;
}
export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    @Escape()
    caption: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    img: string;

    @IsOptional()
    @IsDate()
    @Transform((obj) => new Date(obj.value))
    post_date: Date;

    @IsNotEmpty()
    @IsString()
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    @Escape()
    password: string;
}
