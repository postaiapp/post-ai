import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
