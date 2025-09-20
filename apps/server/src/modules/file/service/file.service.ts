import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '@models';
import { Uploader } from '@type/storage';
import { ServiceBaseParamsType } from '@type/service-base';
import { FileUtils } from '@/utils';

@Injectable()
export class FileService {
	constructor(
		@InjectModel(File)
		private fileModel: typeof File,
		private storageService: Uploader,
	) {}

	async create({
		data,
	}: ServiceBaseParamsType<{
		name: string;
		url: string;
		type: string;
		size: number;
		user_id: number;
	}>) {
		const file = await this.fileModel.create(data);

		return file;
	}

	async uploadFile(file: Express.Multer.File, userId: number) {
		const { key } = await this.storageService.upload({
			fileName: file.originalname,
			fileType: file.mimetype,
			body: file.buffer,
		});

		const signedUrl = await this.storageService.getSignedImageUrlByPath(key);

		const fileRecord = await this.create({
			data: {
				name: file.originalname,
				url: FileUtils.getUnsignedUrl(signedUrl),
				type: file.mimetype,
				size: file.size,
				user_id: userId,
			},
		});

		return fileRecord;
	}

	async findById(id: number) {
		return this.fileModel.findByPk(id);
	}
}
