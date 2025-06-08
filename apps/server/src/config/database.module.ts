import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import { validate } from './env.validation';
import { User } from '@models/user.model';
import { UserPlatform } from '@models/user-platform.model';
import { AuthToken } from '@models/auth-token.model';
import { Platform } from '@models/platform.model';

const currentEnvFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [currentEnvFile],
			validate,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get('MONGODB_URI'),
			}),
			inject: [ConfigService],
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				dialect: 'postgres',
				host: configService.get('POSTGRES_HOST'),
				port: configService.get('POSTGRES_PORT'),
				username: configService.get('POSTGRES_USER'),
				password: configService.get('POSTGRES_PASSWORD'),
				database: configService.get('POSTGRES_DB'),
				autoLoadModels: false,
				synchronize: false,
				logging: false,
				dialectOptions: {
					ssl: {
						require: true,
						rejectUnauthorized: false,
					},
				},
				models: [User, UserPlatform, AuthToken, Platform],
			}),
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {
	static forFeature(models: ModelDefinition[]) {
		return MongooseModule.forFeature(models);
	}
}
