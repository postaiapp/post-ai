import { Body, Controller, Post } from '@nestjs/common';
import { VerifyAccountDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post('account')
    createAccount(@Body() createPostDto: VerifyAccountDto) {
        return this.postService.createAccount(createPostDto);
    }

    @Post()
    create(@Body() createPostDto: VerifyAccountDto) {
        return this.postService.create(createPostDto);
    }
}
