import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  // @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  // @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  email: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  // @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  // @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  // @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  email: string;
}
