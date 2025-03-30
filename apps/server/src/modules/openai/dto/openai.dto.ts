import { Sanitize } from '@decorators/sanitize.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOpenaiDto {
	@IsString()
	@IsNotEmpty()
	@Sanitize()
	prompt: string;
}
