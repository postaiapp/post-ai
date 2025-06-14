import { EmailService } from '@common/providers/email.service';
import { DatabaseModule } from '@config/database.module';
import { Post as PostSequelizeModel, User as UserSequelizeModel } from '@models';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post, PostSchema } from '@schemas/post.schema';
import { User, UserSchema } from '@schemas/user.schema';
import { R2Storage } from '@storages/r2-storage';
import { IgApiClient } from 'instagram-private-api';
import { PostController } from './controller/post.controller';
import { PostService } from './services/post.service';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
		SequelizeModule.forFeature([PostSequelizeModel, UserSequelizeModel]),
	],
	controllers: [PostController],
	providers: [PostService, IgApiClient, InstagramAuthService, R2Storage, EmailService],
})
export class PostModule {}
