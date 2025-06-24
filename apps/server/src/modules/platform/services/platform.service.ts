import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthToken } from '@models/auth-token.model';
import { UserPlatform } from '@models/user-platform.model';
import * as dayjs from 'dayjs';
import { CreatePlatformDto, DisconnectPlatformDto } from '../dto/platform.dto';
import { Platform } from '@models/platform.model';
import { PlatformContext } from '../contexts/platform.context';
import PlatformUtils from '@utils/platform';
import { PLATFORM_STATUS } from '@constants/platforms';
import { Uploader } from '@type/storage';

@Injectable()
export class PlatformService {
	constructor(
		@InjectModel(AuthToken)
		private authTokenModel: typeof AuthToken,
		@InjectModel(UserPlatform)
		private userPlatformModel: typeof UserPlatform,
		private context: PlatformContext,
		@Inject(Uploader) private readonly storageService: Uploader,
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

		const alreadyConnected = await this.userPlatformModel.count({
			where: {
				user_id: userId,
				platform_id: validatedPlatform.id,
			},
		});

		if (alreadyConnected) {
			throw new ConflictException('PLATFORM_ALREADY_CONNECTED');
		}

		const { accessToken, platform } = await this.context.connect(
			data,
			userId,
			validatedPlatform,
		);

		const userPlatform = await this.userPlatformModel.create(platform);

		if (userPlatform.avatar_url) {
			userPlatform.avatar_url = await this.storageService.getSignedImageUrl(
				userPlatform.avatar_url,
			);
		}

		await this.authTokenModel.create({
			name: PlatformUtils.getTokenName(validatedPlatform),
			user_platform_id: userPlatform.id,
			access_token: accessToken,
			expires_at: dayjs().add(60, 'days').format(),
		});

		return userPlatform;
	}

	async disconnect(data: DisconnectPlatformDto): Promise<boolean> {
		const validatedUserPlatform = await this.userPlatformModel.findOne({
			where: {
				id: data.user_platform_id,
				deleted_at: null,
			},
		});

		if (!validatedUserPlatform) {
			throw new NotFoundException('USER_PLATFORM_NOT_FOUND');
		}

		await this.userPlatformModel.update(
			{
				deleted_at: dayjs().format(),
			},
			{
				where: { id: validatedUserPlatform.id, deleted_at: null },
			},
		);

		return true;
	}
}
