import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePost } from '../dto/post.dto';
import { PostService } from '../services/post.service';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    create(@Body() createPostBody: CreatePost) {
        return this.postService.create(createPostBody);
    }
}
