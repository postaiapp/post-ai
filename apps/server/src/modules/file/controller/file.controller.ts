import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../service/file.service';
import { AuthGuard } from '@guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Meta } from '@decorators/meta.decorator';
import { Meta as MetaType } from '@type/meta';

@Controller('files')
@UseGuards(AuthGuard)
export class FileController {
	constructor(private fileService: FileService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Meta() meta: MetaType) {
		const userId = meta.userId;

		const uploadedFile = await this.fileService.uploadFile(file, userId);

		return {
			success: true,
			data: {
				id: uploadedFile.id,
				name: uploadedFile.name,
				url: uploadedFile.url,
				type: uploadedFile.type,
				size: uploadedFile.size,
			},
		};
	}
}
