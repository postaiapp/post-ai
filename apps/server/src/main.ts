import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalGuards();

	app.use(cookieParser());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);
	app.enableVersioning();

	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: 'cross-origin' },
			crossOriginEmbedderPolicy: false,
			contentSecurityPolicy: false,
		}),
	);

	const allowedOrigin = 'https://post-ai.netlify.app';

	const corsOptions: CorsOptions = {
		origin: (origin, callback) => {
			if (process.env.NODE_ENV === 'development') {
				return callback(null, true);
			}

			if (origin === allowedOrigin) {
				callback(null, true);
			} else {
				callback(new Error('Origin not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
		credentials: true,
	};

	app.enableCors(corsOptions);

	const config = new DocumentBuilder()
		.setTitle('Post AI API')
		.setDescription(
			'A API that generates posts for your Instagram account using AI, with a chat interface to help you generate the best posts and schedule them.',
		)
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('docs', app, document);

	await app.listen(process.env.PORT);
}

bootstrap();
