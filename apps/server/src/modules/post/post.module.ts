import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostController } from './controller/post.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { UserPlatform } from '@models/user-platform.model';
import { AuthToken } from '@models/auth-token.model';
import { PostService } from './services/post.service';
import { PostContext } from './contexts/post.context';
import { InstagramPostStrategy } from './strategies/instagram-post.strategy';
import { TiktokPostStrategy } from './strategies/tiktok-post.strategy';
import { EmailService } from '@common/providers/email.service';

@Module({
	imports: [ConfigModule, SequelizeModule.forFeature([Post, UserPlatform, AuthToken])],
	controllers: [PostController],
	providers: [PostService, PostContext, InstagramPostStrategy, TiktokPostStrategy, EmailService],
	exports: [PostService, PostContext, InstagramPostStrategy, TiktokPostStrategy, EmailService],
})
export class PostModule {}
