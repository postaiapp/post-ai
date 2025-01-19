import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class VerifyAccountDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Min(8)
    password: string;
}
export class CreatePostDto {
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

    @IsOptional()
    @Transform((obj) => new Date(obj.value))
    @IsDate()
    post_date: Date;

    @IsNotEmpty()
    @IsString()
    password: string;
}
