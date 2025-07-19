import { AuthToken } from '@models/auth-token.model';
import { UserPlatform } from '@models/user-platform.model';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlatformContext } from './contexts/platform.context';
import { PlatformController } from './controllers/platform.controller';
import { PlatformService } from './services/platform.service';
import { MetaStrategy } from './strategies/meta.strategy';
import { TiktokStrategy } from './strategies/tiktok.strategy';

@Module({
	imports: [ConfigModule, SequelizeModule.forFeature([UserPlatform, AuthToken])],
	controllers: [PlatformController],
	providers: [PlatformService, PlatformContext, MetaStrategy, TiktokStrategy],
	exports: [PlatformService, PlatformContext, MetaStrategy, TiktokStrategy],
})
export class PlatformModule {}
