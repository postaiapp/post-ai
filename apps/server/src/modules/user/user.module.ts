import { DatabaseModule } from '@config/database.module';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '@schemas/user.schema';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
	imports: [DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
