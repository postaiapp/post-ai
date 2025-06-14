const dotenv = require('dotenv');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const currentEnvFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
dotenv.config({ path: path.resolve(currentEnvFile) });

const base = {
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT) || 5432,
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: process.env.NODE_ENV === 'production',
		},
	},
	logging: false,
};

module.exports = {
	development: base,
	test: base,
	production: base,
};
