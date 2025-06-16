import { DatabaseModule } from '@config/database.module';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { Module } from '@nestjs/common';
import { Post, PostSchema } from '@schemas/post.schema';
import { User, UserSchema } from '@schemas/user.schema';
import { StorageModule } from '@storages/storage.module';
import { IgApiClient } from 'instagram-private-api';
import { PublishedMissedPostsCron } from './publish-missed-posts.service';
import { TokenManagementCron } from './token-management.service';
import { RefreshTokensCron } from './refresh-tokens.service';
import { MetaModule } from '@modules/meta/meta.module';
import { PostModule } from '@modules/post/post.module';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
		StorageModule,
		MetaModule,
		PostModule,
	],
	providers: [
		TokenManagementCron,
		PublishedMissedPostsCron,
		RefreshTokensCron,
		InstagramAuthService,
		IgApiClient,
	],
})
export class CronModule {}
