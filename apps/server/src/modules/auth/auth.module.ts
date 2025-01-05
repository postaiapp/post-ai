import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from '@schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})
export class AuthModule {}
