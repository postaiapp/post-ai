import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { Post, PostSchema } from '@schemas/post.schema';
import { User, UserSchema } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { InstagramAuthController } from './controller/instagram-auth.controller';
import { InstagramAuthService } from './services/instagram-auth.service';
import { StorageModule } from '@storages/storage.module';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
		StorageModule,
	],
	controllers: [InstagramAuthController],
	providers: [
		InstagramAuthService,
		IgApiClient
	],
})
export class InstagramAuthModule {}
