import { Platform } from '@models/platform.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MetaInsightsStrategy } from '../strategies/meta-insights.strategy';

@Injectable()
export class InsightsContext {
	constructor(private readonly MetaInsightsStrategy: MetaInsightsStrategy) {}

	mappedStrategiesByPlatform = {
		INSTAGRAM: this.MetaInsightsStrategy,
	};

	getStrategy(platform: Platform) {
		const strategy = this.mappedStrategiesByPlatform[platform.name];

		if (!strategy) {
			throw new NotFoundException('Strategy not found');
		}

		return strategy;
	}
}
