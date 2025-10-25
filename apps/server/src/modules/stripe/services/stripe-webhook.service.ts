import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import Stripe from 'stripe';
import { User } from '@models/user.model';
import { Subscription } from '@models/subscription.model';
import { Plan } from '@models/plan.model';
import { PlanPrice } from '@models/plan-price.model';
import * as dayjs from 'dayjs';

@Injectable()
export class StripeWebhookService {
	private stripe: Stripe;

	constructor(
		private configService: ConfigService,
		@InjectModel(User) private userModel: typeof User,
		@InjectModel(Subscription) private subscriptionModel: typeof Subscription,
		@InjectModel(PlanPrice) private planPriceModel: typeof PlanPrice,
	) {
		this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
			apiVersion: '2025-09-30.clover',
		});
	}

	async constructWebhookEvent(rawBody: Buffer, signature: string): Promise<Stripe.Event> {
		const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

		return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
	}

	async handleWebhookEvent(event: Stripe.Event): Promise<void> {
		if (event.type === 'checkout.session.completed') {
			await this.handleCheckoutSessionCompleted(event);
		}

		if (event.type === 'customer.subscription.updated') {
			await this.handleSubscriptionUpdated(event);
		}

		if (event.type === 'customer.subscription.deleted') {
			await this.handleSubscriptionDeleted(event);
		}

		if (event.type === 'invoice.payment_failed') {
			await this.handlePaymentFailed(event);
		}

		if (event.type === 'invoice.payment_succeeded') {
			await this.handlePaymentSucceeded(event);
		}
	}

	private async handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void> {
		const session = event.data.object as Stripe.Checkout.Session;

		const subscriptionId = session.subscription as string;
		const customerId = session.customer as string;
		const email = session.customer_details?.email || session.customer_email;

		if (!subscriptionId || !customerId || !email) {
			console.error('Missing required data in checkout session:', {
				subscriptionId,
				customerId,
				email,
			});

			return;
		}

		const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

		const item = subscription.items.data[0];

		const priceId = item.price.id;

		const user = await this.userModel.findOne({ where: { email } });

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		const planPrice = await this.planPriceModel.findOne({
			where: { stripe_price_id: priceId },
			include: [{ model: Plan, as: 'plan' }],
			raw: true,
			nest: true,
		});

		if (!planPrice) {
			throw new NotFoundException('PLAN_PRICE_NOT_FOUND');
		}

		const subData = subscription as any;

		await this.subscriptionModel.upsert({
			user_id: user.id,
			stripe_customer_id: customerId,
			stripe_subscription_id: subscriptionId,
			stripe_price_id: priceId,
			plan_id: planPrice.plan_id,
			status: subData.status,
			current_period_start: dayjs.unix(item.current_period_start).toDate(),
			current_period_end: dayjs.unix(item.current_period_end).toDate(),
			cancel_at_period_end: subData.cancel_at_period_end,
			trial_end: subData.trial_end ? dayjs.unix(subData.trial_end).toDate() : null,
		});
	}

	private async handleSubscriptionUpdated(event: Stripe.Event): Promise<void> {
		const subscription = event.data.object as Stripe.Subscription;

		const existingSubscription = await this.subscriptionModel.findOne({
			where: { stripe_subscription_id: subscription.id },
		});

		if (!existingSubscription) {
			return;
		}

		const subData = subscription as any;

		await existingSubscription.update({
			status: subData.status,
			current_period_start: dayjs.unix(subData.current_period_start).toDate(),
			current_period_end: dayjs.unix(subData.current_period_end).toDate(),
			cancel_at_period_end: subData.cancel_at_period_end,
			trial_end: subData.trial_end ? dayjs.unix(subData.trial_end).toDate() : null,
		});

		console.log(`Subscription updated for subscription ${subscription.id}`);
	}

	private async handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
		const subscription = event.data.object as Stripe.Subscription;

		const existingSubscription = await this.subscriptionModel.findOne({
			where: { stripe_subscription_id: subscription.id },
		});

		if (!existingSubscription) {
			console.error('Subscription not found for deletion:', subscription.id);
			return;
		}

		await existingSubscription.update({
			status: 'canceled',
			cancel_at_period_end: true,
		});

		console.log(`Subscription canceled for subscription ${subscription.id}`);
	}

	private async handlePaymentFailed(event: Stripe.Event): Promise<void> {
		const invoice = event.data.object as any;

		const subscription = await this.subscriptionModel.findOne({
			where: { stripe_subscription_id: invoice.subscription as string },
		});

		if (!subscription) {
			console.error('Subscription not found for failed payment:', invoice.subscription);
			return;
		}

		await subscription.update({
			status: 'past_due',
		});

		console.log(`Payment failed for subscription ${invoice.subscription}`);
	}

	private async handlePaymentSucceeded(event: Stripe.Event): Promise<void> {
		const invoice = event.data.object as any;
		const subscriptionId = invoice.subscription;

		if (!subscriptionId) {
			return;
		}

		const subscription = await this.subscriptionModel.findOne({
			where: { stripe_subscription_id: subscriptionId },
		});

		if (!subscription) {
			console.error('Subscription not found for paid invoice:', subscriptionId);
			return;
		}

		await subscription.update({
			status: 'active',
			current_period_start: dayjs.unix(invoice.period_start).toDate(),
			current_period_end: dayjs.unix(invoice.period_end).toDate(),
		});

		console.log(`✅ Payment succeeded for subscription ${subscriptionId}`);
	}
}
