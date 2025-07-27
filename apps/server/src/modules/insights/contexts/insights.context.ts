import { Platform } from '@models/platform.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InsightsStrategy } from '../interfaces/insights-strategy.interface';
import { MetaInsightsStrategy } from '../strategies/meta-insights.strategy';
import { TikTokInsightsStrategy } from '../strategies/tiktok-insights.strategy';

@Injectable()
export class InsightsContext {
	constructor(
		private readonly MetaInsightsStrategy: MetaInsightsStrategy,
		private readonly TikTokInsightsStrategy: TikTokInsightsStrategy,
	) {}

	private mappedStrategiesByPlatform: Record<string, InsightsStrategy> = {
		INSTAGRAM: this.MetaInsightsStrategy,
		TIKTOK: this.TikTokInsightsStrategy,
	};

	getStrategy(platform: Platform): InsightsStrategy {
		const strategy = this.mappedStrategiesByPlatform[platform.name];

		if (!strategy) {
			throw new NotFoundException(`Strategy not found for platform: ${platform.name}`);
		}

		return strategy;
	}

	/**
	 * Registra uma nova estratégia para uma plataforma
	 * @param platformName - Nome da plataforma
	 * @param strategy - Estratégia a ser registrada
	 */
	registerStrategy(platformName: string, strategy: InsightsStrategy): void {
		this.mappedStrategiesByPlatform[platformName] = strategy;
	}

	/**
	 * Obtém todas as plataformas suportadas
	 * @returns Array com nomes das plataformas suportadas
	 */
	getSupportedPlatforms(): string[] {
		return Object.keys(this.mappedStrategiesByPlatform);
	}
}
