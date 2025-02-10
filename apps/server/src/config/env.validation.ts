import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
	Provision = 'provision',
}

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsString()
	@IsNotEmpty()
	MONGODB_URI: string;

	@IsNumber()
	@Min(0)
	@Max(65535)
	@IsOptional()
	PORT: number = 3333;

	@IsString()
	@IsNotEmpty()
	JWT_SECRET: string;

	@IsString()
	@IsNotEmpty()
	OPENAI_API_KEY: string;

	@IsString()
	@IsNotEmpty()
	CLOUDFLARE_ACCOUNT_ID: string;

	@IsString()
	@IsNotEmpty()
	AWS_BUCKET_NAME: string;

	@IsString()
	@IsNotEmpty()
	AWS_ACCESS_KEY_ID: string;

	@IsString()
	@IsNotEmpty()
	AWS_SECRET_ACCESS_KEY: string;
}

export function validate(config: Record<string, unknown>) {
	if (process.env.NODE_ENV === Environment.Test) {
		return config;
	}

	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	return validatedConfig;
}
