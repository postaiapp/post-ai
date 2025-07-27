const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({ path: path.resolve(__dirname, '../../.env.development') });

const config = () => ({
	port: parseInt(process.env.PORT, 10) || 3087,
	environment: process.env.NODE_ENV || 'development',
	database: {
		pool: {
			min: process.env.DB_POOL_MIN ? ~~process.env.DB_POOL_MIN : 0,
			max: process.env.DB_POOL_MAX ? ~~process.env.DB_POOL_MAX : 5,
			idle: process.env.DB_POOL_IDLE_TIMEOUT ? ~~process.env.DB_POOL_IDLE_TIMEOUT : 10000,
			acquire: process.env.DB_POOL_ACQUIRE_TIMEOUT
				? ~~process.env.DB_POOL_ACQUIRE_TIMEOUT
				: 30000,
		},
		statement_timeout: process.env.DB_STATEMENT_TIMEOUT
			? ~~process.env.DB_STATEMENT_TIMEOUT
			: 600000,
		database: process.env.POSTGRES_DB || 'post_ai_dev',
		port: process.env.POSTGRES_PORT ? ~~process.env.POSTGRES_PORT : 5432,
		host: process.env.POSTGRES_HOST || 'localhost',
		username: process.env.POSTGRES_USER || 'postgres',
		password: process.env.POSTGRES_PASSWORD || 'postgres',
		ssl: {
			require: true,
			rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true,
		},
	},
});

const dbConfig = config().database;

module.exports = {
	development: {
		username: dbConfig.username,
		password: dbConfig.password,
		database: dbConfig.database,
		host: dbConfig.host,
		port: dbConfig.port,
		dialect: 'postgres',
		logging: false,
		pool: dbConfig.pool,
		dialectOptions: {
			application_name: 'post-ai-api',
			statement_timeout: dbConfig.statement_timeout,
		},
	},
	test: {
		username: dbConfig.username,
		password: dbConfig.password,
		database: dbConfig.database,
		host: dbConfig.host,
		port: dbConfig.port,
		dialect: 'postgres',
		logging: false,
		pool: {
			max: 5,
			min: 0,
			idle: 10000,
			acquire: 30000,
		},
		dialectOptions: {
			application_name: 'post-ai-api-test',
			statement_timeout: 600000,
		},
	},
	production: {
		username: dbConfig.username,
		password: dbConfig.password,
		database: dbConfig.database,
		host: dbConfig.host,
		port: dbConfig.port,
		dialect: 'postgres',
		logging: false,
		pool: dbConfig.pool,
		dialectOptions: {
			application_name: 'post-ai-api-prod',
			statement_timeout: dbConfig.statement_timeout,
			ssl: dbConfig.ssl,
		},
	},
};
