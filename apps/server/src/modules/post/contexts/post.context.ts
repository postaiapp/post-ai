import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { Platform } from '@models/platform.model';
import { InstagramPostStrategy } from '../strategies/instagram-post.strategy';
import { TiktokPostStrategy } from '../strategies/tiktok-post.strategy';
import { UserPlatform } from '@models/user-platform.model';

@Injectable()
export class PostContext {
	constructor(
		private readonly instagramPostStrategy: InstagramPostStrategy,
		private readonly tiktokPostStrategy: TiktokPostStrategy,
	) {}

	mappedStrategiesByPlatform = {
		INSTAGRAM: this.instagramPostStrategy,
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
