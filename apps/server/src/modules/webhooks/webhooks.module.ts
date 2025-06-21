import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhooksController } from './controllers/webhooks.controller';
import { WebhooksService } from './services/webhooks.service';

@Module({
	imports: [ConfigModule],
	controllers: [WebhooksController],
	providers: [WebhooksService],
	exports: [WebhooksService],
})
export class WebhooksModule {}
