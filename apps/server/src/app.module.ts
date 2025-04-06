import { ConfigModule as AppConfigModule } from '@config/config.module';
import { CronModule } from '@crons/cron.module';
import { DatabaseModule } from '@database/database.module';
import { AuthGuard } from '@guards/auth.guard';
import { AuthModule } from '@modules/auth/auth.module';
import { PostModule } from '@modules/post/post.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { StorageModule } from '@storages/storage.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './modules/chats/chats.module';
import { InstagramAuthModule } from './modules/instagram-auth/instagram-auth.module';
import { OpenaiModule } from './modules/openai/openai.module';
import { UserModule } from './modules/user/user.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		DatabaseModule,
		StorageModule,
		AppConfigModule,
		AuthModule,
		CronModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '1d' },
			}),
			inject: [ConfigService],
			global: true,
		}),
		PostModule,
		InstagramAuthModule,
		OpenaiModule,
		ChatsModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService, AuthGuard],
})
export class AppModule {}
