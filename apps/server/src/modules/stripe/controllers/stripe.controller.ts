import {
	Controller,
	Post,
	Req,
	Headers,
	HttpCode,
	HttpStatus,
	RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StripeWebhookService } from '../services/stripe-webhook.service';

@ApiTags('Stripe')
@Controller('stripe/webhook')
export class StripeController {
	constructor(private readonly stripeWebhookService: StripeWebhookService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Handle Stripe webhook events' })
	async handleWebhook(
		@Req() req: RawBodyRequest<Request>,
		@Headers('stripe-signature') signature: string,
	) {
		try {
			const event = await this.stripeWebhookService.constructWebhookEvent(
				req.rawBody,
				signature,
			);

			await this.stripeWebhookService.handleWebhookEvent(event);

			return { received: true };
		} catch (error) {
			console.error('Webhook error:', error);
			throw error;
		}
	}
}
