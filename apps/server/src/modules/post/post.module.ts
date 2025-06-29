import { EmailService } from '@common/providers/email.service';
import { AuthToken } from '@models/auth-token.model';
import { Post } from '@models/post.model';
import { UserPlatform } from '@models/user-platform.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostContext } from './contexts/post.context';
import { PostController } from './controller/post.controller';
import { MetaProvider } from './providers/meta.provider';
import { PostService } from './services/post.service';
import { MetaPostStrategy } from './strategies/meta-post.strategy';
import { TiktokPostStrategy } from './strategies/tiktok-post.strategy';

@Module({
	imports: [SequelizeModule.forFeature([Post, UserPlatform, AuthToken])],
	controllers: [PostController],
	providers: [
		PostService,
		PostContext,
		MetaPostStrategy,
		TiktokPostStrategy,
		EmailService,
		MetaProvider,
	],
	exports: [
		PostService,
		PostContext,
		MetaPostStrategy,
		TiktokPostStrategy,
		EmailService,
		MetaProvider,
	],
})
export class PostModule {}
