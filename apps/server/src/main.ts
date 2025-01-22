import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalGuards();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        })
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.enableVersioning();

    app.use(helmet());

    // const allowedOrigins = [
    //   /^https:\/\/(?:.+\.)?amigoapp\.com\.br$/,
    //   /^https:\/\/(?:.+\.)?amigo\.dev\.br$/,
    // ];

    // const corsOptions: CorsOptions = {
    //   origin: (origin, callback) => {
    //     if (process.env.NODE_ENV === 'development') {
    //       callback(null, true);
    //       return;
    //     }

    //     if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
    //       callback(null, true);
    //     } else {
    //       callback(new Error('Origin not allowed by CORS'));
    //     }
    //   },
    //   credentials: true,
    // };

    // app.enableCors(corsOptions);

    await app.listen(process.env.PORT);
}

bootstrap();
