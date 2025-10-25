import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models';
import { FileModule } from '@modules/file/file.module';
import { R2Storage } from '@storages/r2-storage';

@Module({
	imports: [SequelizeModule.forFeature([User]), FileModule],
	controllers: [UserController],
	providers: [UserService, R2Storage],
	exports: [UserService],
})
export class UserModule {}
