import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserPlatform } from '@models/user-platform.model';

@Injectable()
export class TiktokStrategy {
	constructor() {}

	async connect(): Promise<UserPlatform> {
		throw new NotImplementedException('TIKTOK_NOT_IMPLEMENTED');
	}
}
