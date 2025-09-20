import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models';
import { FileModule } from '@modules/file/file.module';

@Module({
	imports: [SequelizeModule.forFeature([User]), FileModule],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
