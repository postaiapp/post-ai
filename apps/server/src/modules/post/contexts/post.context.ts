import { Platform } from '@models/platform.model';
import { UserPlatform } from '@models/user-platform.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { MetaPostStrategy } from '../strategies/meta-post.strategy';
import { TiktokPostStrategy } from '../strategies/tiktok-post.strategy';

@Injectable()
export class PostContext {
	constructor(
		private readonly MetaPostStrategy: MetaPostStrategy,
		private readonly tiktokPostStrategy: TiktokPostStrategy,
	) {}

	mappedStrategiesByPlatform = {
		INSTAGRAM: this.MetaPostStrategy,
		TIKTOK: this.tiktokPostStrategy,
	};

	getStrategy(platform: Platform) {
		const strategy = this.mappedStrategiesByPlatform[platform.name];

		if (!strategy) {
			throw new NotFoundException('Strategy not found');
		}

		return strategy;
	}

	async create(data: CreatePostDto, userPlatform: UserPlatform) {
		const strategy = this.getStrategy(userPlatform.platform);

		return strategy.create(data, userPlatform);
	}
}
