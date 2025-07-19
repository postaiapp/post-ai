import { Controller, Get, Post, Query, Body, Response } from '@nestjs/common';
import { WebhooksService } from '../services/webhooks.service';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';

@Controller('webhooks')
export class WebhooksController extends BaseController {
	constructor(private readonly webhooksService: WebhooksService) {
		super();
	}

	@Get()
	async verifyWebhook(
		@Response() res: ExpressResponse,
		@Query('hub.mode') mode: string,
		@Query('hub.verify_token') token: string,
		@Query('hub.challenge') challenge: string,
	) {
		try {
			const response = this.webhooksService.verifyWebhook(mode, token, challenge);

			return res.send(response);
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Post()
	async handleWebhook(@Response() res: ExpressResponse, @Body() body: any) {
		try {
			this.webhooksService.handleWebhook(body);
			return this.sendSuccess({ data: { status: 'ok' }, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}
}
