import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
	private stripe: Stripe;

	constructor(private configService: ConfigService) {
		this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
			apiVersion: '2025-09-30.clover',
		});
	}

	async createCheckoutSession({
		userEmail,
		userId,
		planKey,
		priceId,
	}: {
		userEmail: string;
		userId: number;
		planKey: string;
		priceId: string;
	}) {
		console.log({
			userEmail,
			userId,
			planKey,
			priceId,
		}, 'createCheckoutSession');
		const APP_URL = this.configService.get('APP_URL');

		console.log(APP_URL, 'APP_URL');

		const session = await this.stripe.checkout.sessions.create({
			mode: 'subscription',
			customer_email: userEmail,
			payment_method_types: ['card'],
			line_items: [{ price: priceId, quantity: 1 }],
			subscription_data: { trial_period_days: 7 },
			success_url: `${APP_URL}/auth`,
			cancel_url: `${APP_URL}/auth`,
			locale: 'pt-BR',
			metadata: { userId, planKey },
		});

		console.log(session, 'session');

		return session;
	}

	async getPriceId(planKey: string): Promise<string> {
		const priceMap = {
			starter: this.configService.get('STRIPE_STARTER_PRICE_ID'),
			pro: this.configService.get('STRIPE_PRO_PRICE_ID'),
			premium: this.configService.get('STRIPE_PREMIUM_PRICE_ID'),
		};
		
		console.log(priceMap, 'priceMap');

		const priceId = priceMap[planKey];

		return priceId;
	}
}
