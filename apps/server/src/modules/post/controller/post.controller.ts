import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Post, Query, UseGuards, Get, Param } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import { CancelPostQueryDto, CreatePostDto, GetAllPostsQueryDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { Paginate } from '@decorators/pagination.decorator';
import { Pagination } from '@common/dto/pagination.dto';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	create(@Body() data: CreatePostDto, @Meta() meta: MetaType) {
		return this.postService.create({ data, meta });
	}

	@Post('cancel/:postId')
	cancel(@Param('postId') postId: string, @Meta() meta: MetaType) {
		return this.postService.cancelScheduledPost({
			postId,
			userId: meta.userId.toString(),
		});
	}

	@Get()
	getUserPosts(
		@Paginate({ perPage: 10 }) pagination: Pagination,
		@Meta() meta: MetaType
	) {
		return this.postService.getUserPostsWithDetails({ pagination, meta });
	}
}
