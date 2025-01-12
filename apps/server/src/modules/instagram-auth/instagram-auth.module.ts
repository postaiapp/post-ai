import { Module } from '@nestjs/common';
import { InstagramAuthController } from './controller/instagram-auth.controller';
import { InstagramAuthService } from './services/instagram-auth.service';

@Module({
    controllers: [InstagramAuthController],
    providers: [InstagramAuthService],
})
export class InstagramAuthModule {}
