import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class TiktokPostStrategy {
	async create() {
		throw new NotImplementedException('TIKTOK_NOT_IMPLEMENTED');
	}
}
