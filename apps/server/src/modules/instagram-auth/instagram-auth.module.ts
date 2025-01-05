import { Module } from '@nestjs/common';
import { InstagramAuthController } from './instagram-auth.controller';
import { InstagramAuthService } from './instagram-auth.service';

@Module({
  controllers: [InstagramAuthController],
  providers: [InstagramAuthService],
})
export class InstagramAuthModule {}
