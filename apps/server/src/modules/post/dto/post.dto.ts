import { IsNotEmpty, IsString, Min } from 'class-validator';

export class VerifyAccountDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Min(8)
    password: string;
}
