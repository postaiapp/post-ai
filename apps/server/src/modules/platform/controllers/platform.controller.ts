import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';
import { CreatePlatformDto, DisconnectPlatformDto } from '../dto/platform.dto';
import { PlatformService } from '../services/platform.service';

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
			return this.sendError({ error, res });
		}
	}

	@Post('disconnect')
	async disconnect(@Body() data: DisconnectPlatformDto, @Response() res: ExpressResponse) {
		try {
			const response = await this.platformService.disconnect(data);

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}
}
