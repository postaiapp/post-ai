import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Meta as MetaType } from '@type/meta';
import { CreatePostDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { Response as ExpressResponse } from 'express';
import BaseController from '@utils/base-controller';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('posts')
export class PostController extends BaseController {
	constructor(private readonly postService: PostService) {
		super();
	}

	@Post()
	async create(
		@Body() data: CreatePostDto,
		@Meta() meta: MetaType,
		@Response() res: ExpressResponse,
	) {
		try {
			console.log(data, meta, 'data, meta')
			const response = await this.postService.create(data, meta.userId);

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			console.log('error', error);
			return this.sendError({ error, res });
		}
	}
}
