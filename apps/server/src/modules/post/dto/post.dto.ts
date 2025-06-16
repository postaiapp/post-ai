import { IsNotEmpty, IsOptional, IsString, ValidateIf, IsNumber } from 'class-validator';

export class CreatePostDto {
	@IsNumber()
	@IsNotEmpty()
	user_platform_id: number;

	@IsString()
	@IsNotEmpty()
	caption: string;

	@IsString()
	@IsNotEmpty()
	media_url: string;

	@IsString()
	@IsOptional()
	scheduled_at?: string;
}

export class CancelPostQueryDto {
	@IsString()
	@IsNotEmpty()
	@ValidateIf(obj => !obj.username)
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
