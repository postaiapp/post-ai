import { MetaProvider } from '@common/providers/meta.provider';
import { AuthToken } from '@models/auth-token.model';
import { Post } from '@models/post.model';
import { UserPlatform } from '@models/user-platform.model';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { InsightsContext } from './contexts/insights.context';
import { InsightsController } from './insights.controller';
import { InsightsService } from './services/insights.service';
import { MetaInsightsStrategy } from './strategies/meta-insights.strategy';
import { TikTokInsightsStrategy } from './strategies/tiktok-insights.strategy';

@Module({
	imports: [ConfigModule, SequelizeModule.forFeature([UserPlatform, AuthToken, Post])],
	controllers: [InsightsController],
	providers: [
		InsightsService,
		InsightsContext,
		MetaProvider,
		MetaInsightsStrategy,
		TikTokInsightsStrategy,
	],
})
export class InsightsModule {}
