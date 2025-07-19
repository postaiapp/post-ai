import { AuthToken } from '@models/auth-token.model';
import { UserPlatform } from '@models/user-platform.model';
import { MetaProvider } from '@modules/post/providers/meta.provider';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { InsightsContext } from './contexts/insights.context';
import { InsightsController } from './insights.controller';
import { InsightsService } from './services/insights.service';
import { MetaInsightsStrategy } from './strategies/meta-insights.strategy';

@Module({
	imports: [ConfigModule, SequelizeModule.forFeature([UserPlatform, AuthToken])],
	controllers: [InsightsController],
	providers: [InsightsService, InsightsContext, MetaProvider, MetaInsightsStrategy],
})
export class InsightsModule {}
