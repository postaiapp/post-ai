import { Controller, UseGuards } from '@nestjs/common';
import { MetaFeedService } from '../services/meta-feed.service';
import { MetaStoriesService } from '../services/meta-stories.service';
import { MetaMetricsService } from '../services/meta-metrics.service';
import { AuthGuard } from '@guards/auth.guard';
import BaseController from '@utils/base-controller';

@Controller('meta')
@UseGuards(AuthGuard)
export class MetaController extends BaseController {
	constructor(
		private readonly metaFeedService: MetaFeedService,
		private readonly metaStoriesService: MetaStoriesService,
		private readonly metaMetricsService: MetaMetricsService,
	) {
		super();
	}
}
