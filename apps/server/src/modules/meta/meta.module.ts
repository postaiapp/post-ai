import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetaAuthService } from './services/meta-auth.service';
import { MetaFeedService } from './services/meta-feed.service';
import { MetaStoriesService } from './services/meta-stories.service';
import { MetaMetricsService } from './services/meta-metrics.service';
import { MetaAccountService } from './services/meta-account.service';
import { MetaController } from './controllers/meta.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserPlatform } from '@models/user-platform.model';
import { AuthToken } from '@models/auth-token.model';

@Module({
	imports: [ConfigModule, SequelizeModule.forFeature([UserPlatform, AuthToken])],
	controllers: [MetaController],
	providers: [
		MetaAuthService,
		MetaFeedService,
		MetaStoriesService,
		MetaMetricsService,
		MetaAccountService,
	],
	exports: [
		MetaAuthService,
		MetaFeedService,
		MetaStoriesService,
		MetaMetricsService,
		MetaAccountService,
	],
})
export class MetaModule {}
