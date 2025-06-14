const config = () => {
	return {
		port: parseInt(process.env.PORT, 10) || 3087,
		environment: process.env.NODE_ENV || 'development',
		database: {
			pool: {
				min: process.env.DB_POOL_MIN ? ~~process.env.DB_POOL_MIN : undefined,
				max: process.env.DB_POOL_MAX ? ~~process.env.DB_POOL_MAX : undefined,
				idle: process.env.DB_POOL_IDLE_TIMEOUT
					? ~~process.env.DB_POOL_IDLE_TIMEOUT
					: undefined,
				acquire: process.env.DB_POOL_ACQUIRE_TIMEOUT
					? ~~process.env.DB_POOL_ACQUIRE_TIMEOUT
					: undefined,
			},
			statement_timeout: process.env.DB_STATEMENT_TIMEOUT
				? ~~process.env.DB_STATEMENT_TIMEOUT
				: 600000,
			database: process.env.POSTGRES_DB,
			port: process.env.POSTGRES_PORT ? ~~process.env.POSTGRES_PORT : 5432,
			host: process.env.POSTGRES_HOST,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			ssl: {
				require: true,
				rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true, // This is for development purposes only, do not use in production
			},
		},
	};
};

export default config;
