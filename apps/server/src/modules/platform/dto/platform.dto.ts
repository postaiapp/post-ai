import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlatformDto {
	@IsNotEmpty()
	@IsString()
	code: string;

	@IsNotEmpty()
	@IsNumber()
	platform_id: number;
}

export class DisconnectPlatformDto {
	@IsNotEmpty()
	@IsNumber()
	user_platform_id: number;
}
