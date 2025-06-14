import { DatabaseConfig } from '@database/database.config';
import * as postAiModels from '@models';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import config from './configuration';
import { validate } from './env.validation';

const currentEnvFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';

const modelsArray = Object.values(postAiModels);

@Global()
@Module({
	imports: [
		SequelizeModule.forFeature(modelsArray),
		ConfigModule.forRoot({
			envFilePath: [currentEnvFile],
			load: [config],
			isGlobal: true,
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
			useClass: DatabaseConfig,
		}),
	],
})
export class DatabaseModule {
	static forFeature(models: ModelDefinition[]) {
		return MongooseModule.forFeature(models);
	}
}
