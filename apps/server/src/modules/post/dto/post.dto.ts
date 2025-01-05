import { IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class VerifyAccountDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Min(8)
    password: string;
}
export class CreatePost {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    caption: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    img: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
