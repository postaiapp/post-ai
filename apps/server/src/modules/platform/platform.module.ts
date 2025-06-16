import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlatformController } from './controllers/platform.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserPlatform } from '@models/user-platform.model';
import { AuthToken } from '@models/auth-token.model';
import { PlatformService } from './services/platform.service';
import { PlatformContext } from './contexts/platform.context';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { TiktokStrategy } from './strategies/tiktok.strategy';

@Module({
	imports: [ConfigModule, SequelizeModule.forFeature([UserPlatform, AuthToken])],
	controllers: [PlatformController],
	providers: [PlatformService, PlatformContext, InstagramStrategy, TiktokStrategy],
	exports: [PlatformService, PlatformContext, InstagramStrategy, TiktokStrategy],
})
export class PlatformModule {}
