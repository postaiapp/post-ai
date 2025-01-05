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
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    if (validatedConfig.NODE_ENV === Environment.Test) {
        throw new Error('You are trying to run tests on a non-test database');
    }

    return validatedConfig;
}
