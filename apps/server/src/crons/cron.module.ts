import { Module } from '@nestjs/common';
import { StorageModule } from '@storages/storage.module';
import { PublishPostsCron } from './publish-posts.service';
import { RefreshTokensCron } from './refresh-tokens.service';
import { MetaModule } from '@modules/meta/meta.module';
import { PostModule } from '@modules/post/post.module';
import { UserPlatform } from '@models/user-platform.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '@models/post.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Post, UserPlatform]),
		StorageModule,
		MetaModule,
		PostModule,
	],
	providers: [PublishPostsCron, RefreshTokensCron],
})
export class CronModule {}
