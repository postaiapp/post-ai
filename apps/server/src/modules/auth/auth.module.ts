import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@models/user.model';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	controllers: [AuthController],
	providers: [AuthService, JwtService],
})
export class AuthModule {}
