import { Sanitize } from '@decorators/sanitize.decorator';
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

export class ListPostsDto {
	@IsOptional()
	@IsString()
	@Sanitize()
	searchText: string;

	@IsNumber()
	@IsOptional()
	user_platform_id: number;

	@IsOptional()
	@IsNumber()
	@IsNotEmpty()
	page: number;

	@IsOptional()
	@IsNumber()
	@IsNotEmpty()
	items_per_page: number;
}
