import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { PostController } from './controller/post.controller';
import { PostService } from './services/post.service';
import { Post, PostSchema } from '@schemas/post.schema';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
	],
	controllers: [PostController],
	providers: [PostService, IgApiClient, InstagramAuthService],
})
export class PostModule {}
