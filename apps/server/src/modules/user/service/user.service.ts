import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { ServiceBaseParamsWithFilterType } from '@type/service-base';
import { Model } from 'mongoose';
import { UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async findOne({ filter }: ServiceBaseParamsWithFilterType) {
		const user = await this.userModel.findById(filter.id).lean();

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		return user;
	}

	async update({ filter, data }: ServiceBaseParamsWithFilterType<UpdateUserDto>) {
		const user = await this.userModel.findByIdAndUpdate(
			filter.id,
			{ $set: data },
			{ new: true, runValidators: true },
		);

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		return user;
	}

	async remove({ filter }: ServiceBaseParamsWithFilterType) {
		const user = await this.userModel.findByIdAndDelete(filter.id, {
			new: true,
		});

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		return user;
	}
}
