import { Sanitize } from '@decorators/sanitize.decorator';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	@Sanitize()
	caption: string;

	@IsOptional()
	@IsString()
	@IsUrl()
	img: string;

	@IsOptional()
	@IsDate()
	@Transform((obj) => obj.value && new Date(obj.value))
	post_date: Date;
}

export class CancelPostQueryDto {
	@IsString()
	@IsNotEmpty()
	@ValidateIf((obj) => !obj.username)
	postId: string;
}

export class GetAllPostsQueryDto {
	@IsOptional()
	@IsNumber()
	page: number;

	@IsOptional()
	@IsNumber()
	limit: number;
}


