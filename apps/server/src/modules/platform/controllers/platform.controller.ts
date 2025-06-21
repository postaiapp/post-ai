import { Controller, Post, Body, UseGuards, Response } from '@nestjs/common';
import { AuthGuard } from '@guards/auth.guard';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';
import { PlatformService } from '../services/platform.service';
import { Meta } from '@decorators/meta.decorator';
import { Meta as MetaType } from '@type/meta';
import { CreatePlatformDto } from '../dto/platform.dto';

@Controller('platforms')
@UseGuards(AuthGuard)
export class PlatformController extends BaseController {
	constructor(private readonly platformService: PlatformService) {
		super();
	}

	@Post('connect')
	async connect(
		@Body() data: CreatePlatformDto,
		@Meta() meta: MetaType,
		@Response() res: ExpressResponse,
	) {
		try {
			const response = await this.platformService.connect(data, meta.userId);

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			console.log('error', error);
			return this.sendError({ error, res });
		}
	}
}
