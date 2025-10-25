import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@models/user.model';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { StripeModule } from '../stripe/stripe.module';

@Module({
	imports: [SequelizeModule.forFeature([User]), StripeModule],
	controllers: [AuthController],
	providers: [AuthService, JwtService],
})
export class AuthModule {}
