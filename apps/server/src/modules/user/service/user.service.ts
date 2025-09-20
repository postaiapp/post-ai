import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceBaseParamsWithFilterType } from '@type/service-base';
import { UpdateUserDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models';
import { FileService } from '@modules/file/service/file.service';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
		private fileService: FileService,
	) {}

	async findOne({ filter }: ServiceBaseParamsWithFilterType) {
		const user = await this.userModel.findOne({ where: { id: filter.id } });

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		// Se o usuário tem um company_file_id, buscar a URL da imagem
		if (user.company_file_id) {
			try {
				const file = await this.fileService.findById(user.company_file_id);
				if (file) {
					// Adicionar a URL da imagem ao objeto do usuário
					(user as any).company_logo_url = file.url;
				}
			} catch (error) {
				// Se não conseguir buscar o arquivo, continua sem a URL
				console.warn('Erro ao buscar arquivo do usuário:', error);
			}
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
