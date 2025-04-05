import { Sanitize } from '@decorators/sanitize.decorator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class InstagramAuthDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	@Sanitize()
	password: string;

	@IsString()
	@IsNotEmpty()
	@Sanitize()
	username: string;
}
export class DeleteInstagramAuthDto {
	@IsString()
	@IsNotEmpty()
	username: string;
}
