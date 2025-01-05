import { Module } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    controllers: [PostController],
    providers: [PostService, IgApiClient],
})
export class PostModule {}
