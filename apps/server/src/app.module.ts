import { ConfigModule as AppConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { PostModule } from '@modules/post/post.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstagramAuthModule } from './modules/instagram-auth/instagram-auth.module';

@Module({
    imports: [
        DatabaseModule,
        AppConfigModule,
        AuthModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),
        PostModule,
        InstagramAuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
