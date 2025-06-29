import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Controller, Get, Query, Response, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';
import { GetDashboardDto } from './dtos/insights.dto';
import { InsightsService } from './services/insights.service';

@Controller('insights')
@UseGuards(AuthGuard)
export class InsightsController extends BaseController {
	constructor(private readonly insightsService: InsightsService) {
		super();
	}

	@Get('dashboard')
	async getDashboard(
		@Meta() meta: MetaType,
		@Response() res: ExpressResponse,
		@Query() filter: GetDashboardDto,
	) {
		try {
			const options = {
				meta,
				filter,
			};

			const response = await this.insightsService.getDashboard(options);

			return this.sendSuccess({ data: response, res: res });
		} catch (error) {
			return this.sendError({ error, res: res });
		}
	}
}
