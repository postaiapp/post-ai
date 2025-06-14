import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

@Injectable()
export class DatabaseConfig implements SequelizeOptionsFactory {
	constructor(private configService: ConfigService) {}

	createSequelizeOptions(): SequelizeModuleOptions {
		const dbConfig = this.configService.get('database');

		return {
			dialect: 'postgres',
			logging: false,
			synchronize: false,
			autoLoadModels: true,
			host: dbConfig.host,
			port: dbConfig.port,
			username: dbConfig.username,
			password: dbConfig.password,
			database: dbConfig.database,
			dialectOptions: {
				application_name: 'post-ai-api',
				statement_timeout: dbConfig.statement_timeout,
				ssl: dbConfig.ssl,
			},
			pool: {
				max: dbConfig.pool.max,
				min: dbConfig.pool.min,
				idle: dbConfig.pool.idle,
				acquire: dbConfig.pool.acquire,
			},
			minifyAliases: true,
			query: {
				raw: true,
			},
		};
	}
}
