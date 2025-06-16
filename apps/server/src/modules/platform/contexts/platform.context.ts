import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlatformDto } from '../dto/platform.dto';
import { Platform } from '@models/platform.model';
import { InstagramStrategy } from '../strategies/instagram.strategy';
import { TiktokStrategy } from '../strategies/tiktok.strategy';

@Injectable()
export class PlatformContext {
	private readonly logger = new Logger(PlatformContext.name);

	constructor(
		private readonly instagramStrategy: InstagramStrategy,
		private readonly tiktokStrategy: TiktokStrategy,
	) {}

	mappedStrategiesByPlatform = {
		INSTAGRAM: this.instagramStrategy,
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
