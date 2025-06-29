import { Platform } from '@models/platform.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlatformDto } from '../dto/platform.dto';
import { MetaStrategy } from '../strategies/meta.strategy';
import { TiktokStrategy } from '../strategies/tiktok.strategy';

@Injectable()
export class PlatformContext {
	constructor(
		private readonly MetaStrategy: MetaStrategy,
		private readonly tiktokStrategy: TiktokStrategy,
	) {}

	mappedStrategiesByPlatform = {
		INSTAGRAM: this.MetaStrategy,
		TIKTOK: this.tiktokStrategy,
	};

	getStrategy(platform: Platform) {
		const strategy = this.mappedStrategiesByPlatform[platform.name];

		if (!strategy) {
			throw new NotFoundException('Strategy not found');
		}

		return strategy;
	}

	async connect(data: CreatePlatformDto, userId: number, platform: Platform) {
		const strategy = this.getStrategy(platform);

		return strategy.connect(data, userId);
	}
}
