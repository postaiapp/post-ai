import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceBaseParamsWithFilterType } from '@type/service-base';
import { UpdateUserDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User, File } from '@models';
import { R2Storage } from '@storages/r2-storage';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
		private storageService: R2Storage,
	) {}

	async findOne(userId: number) {
		const user: User & { company_file?: File } = await this.userModel
			.scope(['withFile'])
			.findOne({ where: { id: userId }, raw: true, nest: true });

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		if (user.company_file?.url) {
			user.company_file.url = await this.storageService.getSignedImageUrl(
				user.company_file.url,
			);
		}

		return user;
	}

	async update({ filter, data }: ServiceBaseParamsWithFilterType<UpdateUserDto>) {
		await this.userModel.update(data, {
			where: {
				id: filter.id,
			},
		});

		return true;
	}

	async remove({ filter }: ServiceBaseParamsWithFilterType) {
		const user = await this.userModel.destroy({
			where: {
				id: filter.id,
			},
		});

		return user;
	}
}
