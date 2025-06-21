import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlatformDto {
	@IsNotEmpty()
	@IsString()
	code: string;

	@IsNotEmpty()
	@IsNumber()
	platform_id: number;
}
