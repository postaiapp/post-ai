import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthToken } from '@models/auth-token.model';
import { UserPlatform } from '@models/user-platform.model';
import * as dayjs from 'dayjs';
import { CreatePlatformDto } from '../dto/platform.dto';
import { Platform } from '@models/platform.model';
import { PlatformContext } from '../contexts/platform.context';
import PlatformUtils from '@utils/platform';
import { PLATFORM_STATUS } from '@constants/platforms';

@Injectable()
export class PlatformService {
	constructor(
		@InjectModel(AuthToken)
		private authTokenModel: typeof AuthToken,
		@InjectModel(UserPlatform)
		private userPlatformModel: typeof UserPlatform,
		private context: PlatformContext,
	) {}

	async connect(data: CreatePlatformDto, userId: number): Promise<UserPlatform> {
		const validatedPlatform = await Platform.findOne({
			where: {
				id: data.platform_id,
				status: PLATFORM_STATUS.ACTIVE,
			},
		});

		console.log(validatedPlatform, 'validatedPlatform');

		if (!validatedPlatform) {
			throw new NotFoundException('PLATFORM_NOT_FOUND');
		}

		const { accessToken, platform } = await this.context.connect(
			data,
			userId,
			validatedPlatform,
		);

		const userPlatform = await this.userPlatformModel.create(platform);

		await this.authTokenModel.create({
			name: PlatformUtils.getTokenName(validatedPlatform),
			user_platform_id: userPlatform.id,
			access_token: accessToken,
			expires_at: dayjs().add(60, 'days').format(),
		});

		return userPlatform;
	}
}
