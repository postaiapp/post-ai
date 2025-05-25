// import { ConfigModule } from '@config/config.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import { validate } from './env.validation';

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
				models: [],
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
