import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './env.validation';

const currentEnvFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            envFilePath: [currentEnvFile],
            isGlobal: true,
            validate,
        }),
    ],
})
export class ConfigModule {}
