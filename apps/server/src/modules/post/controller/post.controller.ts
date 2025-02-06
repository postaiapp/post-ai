import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from 'src/types/meta';
import { CreatePostDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    create(@Body() body: CreatePostDto, @Meta() meta: MetaType) {
        return this.postService.create({ body, meta });
    }
}
