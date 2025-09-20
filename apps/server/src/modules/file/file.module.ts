import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from '@models';
import { FileController } from './controller/file.controller';
import { FileService } from './service/file.service';
import { StorageModule } from '@storages/storage.module';

@Module({
	imports: [SequelizeModule.forFeature([File]), StorageModule],
	controllers: [FileController],
	providers: [FileService],
	exports: [FileService],
})
export class FileModule {}
