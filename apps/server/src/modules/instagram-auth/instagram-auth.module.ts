import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { InstagramAuthController } from './controller/instagram-auth.controller';
import { InstagramAuthService } from './services/instagram-auth.service';
import { TokenManagement } from './services/token-management.service';

@Module({
	imports: [DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }])],
	controllers: [InstagramAuthController],
	providers: [InstagramAuthService, IgApiClient, TokenManagement],
})
export class InstagramAuthModule {}
