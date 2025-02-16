import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import { CancelPostQueryDto, CreatePostDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() data: CreatePostDto, @Meta() meta: MetaType) {
		return this.postService.create({ data, meta });
	}

	@Post('canceled')
	@HttpCode(HttpStatus.OK)
	canceled(@Query() query: CancelPostQueryDto, @Meta() meta: MetaType) {
		return this.postService.cancelScheduledPost({
			query,
			meta,
		});
	}
}
