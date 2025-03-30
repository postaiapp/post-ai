import { Sanitize } from '@decorators/sanitize.decorator';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @Sanitize()
    password: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Sanitize()
    email: string;
}

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Sanitize()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @Sanitize()
    password: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Sanitize()
    email: string;
}
