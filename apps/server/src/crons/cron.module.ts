import { Module } from '@nestjs/common';
import { TokenManagement } from './token-management.service';
import { DatabaseModule } from '@database/database.module';
import { User, UserSchema } from '@schemas/user.schema';
import { Post, PostSchema } from '@schemas/post.schema';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { IgApiClient } from 'instagram-private-api';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
	],
	providers: [TokenManagement, InstagramAuthService, IgApiClient],
})
export class CronModule {}
