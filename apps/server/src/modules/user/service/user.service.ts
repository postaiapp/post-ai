import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceBaseParamsWithFilterType } from '@type/service-base';
import { UpdateUserDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
	) {}

	async findOne({ filter }: ServiceBaseParamsWithFilterType) {
		const user = await this.userModel.findOne({ where: { id: filter.id } });

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		return user;
	}

	async update({ filter, data }: ServiceBaseParamsWithFilterType<UpdateUserDto>) {
		await this.userModel.update(data, {
			where: {
				id: filter.id,
			},
		});

		// Retornar o usuário atualizado
		const updatedUser = await this.userModel.findOne({ 
			where: { id: filter.id } 
		});

		if (!updatedUser) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		return updatedUser;
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
