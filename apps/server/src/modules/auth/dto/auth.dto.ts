import { Escape } from 'class-sanitizer/decorators/sanitizers/escape.decorator';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  @Escape()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  @Escape()
  email: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  @Escape()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  @Escape()
  password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  @Escape()
  email: string;
}
