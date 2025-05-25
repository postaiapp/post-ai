import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class WebhooksService {
	private readonly logger = new Logger(WebhooksService.name);
	private readonly verifyToken: string;

	constructor(private configService: ConfigService) {
		this.verifyToken = this.configService.get<string>('META_WEBHOOK_VERIFY_TOKEN');
	}

	verifyWebhook(mode: string, token: string, challenge: string): string | null {
		if (mode === 'subscribe' && token === this.verifyToken) {
			this.logger.log('Webhook verified successfully');
			return challenge;
		}

		this.logger.error('Webhook verification failed');
		return null;
	}

	handleWebhook(body: any): void {
		try {
			// Verifica a assinatura do webhook
			const signature = body.signature;
			if (!this.verifySignature(signature, body)) {
				this.logger.error('Invalid webhook signature');
				return;
			}

			// Processa os eventos do webhook
			const events = body.entry;
			for (const entry of events) {
				for (const change of entry.changes) {
					this.processWebhookEvent(change);
				}
			}
		} catch (error) {
			this.logger.error('Error processing webhook:', error);
		}
	}

	private verifySignature(signature: string, body: any): boolean {
		try {
			const appSecret = this.configService.get<string>('META_APP_SECRET');
			const hmac = crypto.createHmac('sha256', appSecret);
			const calculatedSignature = hmac.update(JSON.stringify(body)).digest('hex');

			return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature));
		} catch (error) {
			this.logger.error('Error verifying webhook signature:', error);
			return false;
		}
	}

	private processWebhookEvent(change: any): void {
		try {
			switch (change.field) {
				case 'mentions':
					this.handleMentions(change);
					break;
				case 'comments':
					this.handleComments(change);
					break;
				case 'messages':
					this.handleMessages(change);
					break;
				default:
					this.logger.warn(`Unhandled webhook event type: ${change.field}`);
			}
		} catch (error) {
			this.logger.error('Error processing webhook event:', error);
		}
	}

	private handleMentions(change: any): void {
		this.logger.log('Processing mentions:', change);
		// Implementar lógica para processar menções
	}

	private handleComments(change: any): void {
		this.logger.log('Processing comments:', change);
		// Implementar lógica para processar comentários
	}

	private handleMessages(change: any): void {
		this.logger.log('Processing messages:', change);
		// Implementar lógica para processar mensagens
	}
}
