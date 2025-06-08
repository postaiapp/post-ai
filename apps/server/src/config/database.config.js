const dotenv = require('dotenv');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const currentEnvFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';

const envPath = path.resolve(currentEnvFile);

dotenv.config({ path: envPath });

module.exports = {
	development: {
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	},
	test: {
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		dialect: 'postgres',
	},
	production: {
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		dialect: 'postgres',
	},
};
