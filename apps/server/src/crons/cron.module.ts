import { DatabaseModule } from '@database/database.module';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { Module } from '@nestjs/common';
import { Post, PostSchema } from '@schemas/post.schema';
import { User, UserSchema } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { TokenManagement } from './token-management.service';
import { StorageModule } from '@storages/storage.module';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
		StorageModule,
	],
	providers: [TokenManagement, InstagramAuthService, IgApiClient],
})
export class CronModule {}
