import { Pagination } from '@common/dto/pagination.dto';
import { EmailService } from '@common/providers/email.service';
import { Meta } from '@decorators/meta.decorator';
import { Paginate } from '@decorators/pagination.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Meta as MetaType } from '@type/meta';
import { CreatePostDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly emailService: EmailService,
	) {}

	@Post()
	@ApiBody({
		schema: {
			example: {
				username: 'instagramuser',
				caption: 'My awesome post! 🌟',
				img: 'https://example.com/image.jpg',
				post_date: '2024-03-20T10:00:00Z',
			},
		},
	})
	create(@Body() data: CreatePostDto, @Meta() meta: MetaType) {
		return this.postService.create({ data, meta });
	}

	@Post('cancel/:postId')
	@ApiParam({
		name: 'postId',
		example: '507f1f77bcf86cd799439011',
	})
	cancel(@Param('postId') postId: string, @Meta() meta: MetaType) {
		return this.postService.cancelScheduledPost({
			postId,
			userId: meta.userId.toString(),
		});
	}

	@Get()
	getUserPosts(@Paginate({ perPage: 10 }) pagination: Pagination, @Meta() meta: MetaType) {
		return this.postService.getUserPostsWithDetails({ pagination, meta });
	}

	@Get('recent')
	getRecentPosts(@Meta() meta: MetaType) {
		return this.postService.getRecentPosts({ meta });
	}
}
