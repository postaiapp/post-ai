import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StripeService } from './services/stripe.service';
import { StripeWebhookService } from './services/stripe-webhook.service';
import { StripeController } from './controllers/stripe.controller';
import { User } from '@models/user.model';
import { Subscription } from '@models/subscription.model';
import { Plan } from '@models/plan.model';
import { PlanPrice } from '@models/plan-price.model';

@Module({
	imports: [SequelizeModule.forFeature([User, Subscription, Plan, PlanPrice])],
	controllers: [StripeController],
	providers: [StripeService, StripeWebhookService],
	exports: [StripeService, StripeWebhookService],
})
export class StripeModule {}
