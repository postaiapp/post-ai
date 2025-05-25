import { EmailService } from '@common/providers/email.service';
import { DatabaseModule } from '@config/database.module';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { PostService } from '@modules/post/services/post.service';
import { Module } from '@nestjs/common';
import { Post, PostSchema } from '@schemas/post.schema';
import { User, UserSchema } from '@schemas/user.schema';
import { StorageModule } from '@storages/storage.module';
import { IgApiClient } from 'instagram-private-api';
import { PublishedMissedPostsCron } from './publish-missed-posts.service';
import { TokenManagementCron } from './token-management.service';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
		StorageModule,
	],
	providers: [
		TokenManagementCron,
		PublishedMissedPostsCron,
		InstagramAuthService,
		IgApiClient,
		PostService,
		EmailService
	],
})
export class CronModule {}
