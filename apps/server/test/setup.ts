import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { AppModule } from '../src/app.module';

config({ path: `.env.${process.env.NODE_ENV}` });

let app: INestApplication;

global.beforeAll(async () => {
	try {
		Logger.log('Environment:', process.env.NODE_ENV);
		Logger.log('MongoDB URI:', process.env.MONGODB_URI);

		if (!process.env.MONGODB_URI || process.env.NODE_ENV !== 'test') {
			throw new Error('Wrong environment for tests');
		}

		await mongoose.connect(process.env.MONGODB_URI);
		Logger.log('MongoDB connected successfully');

		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalGuards();

		app.use(cookieParser());
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
				transformOptions: { enableImplicitConversion: true },
			}),
		);

		await app.init();
		Logger.log('Application initialized successfully');
	} catch (error) {
		Logger.error('Setup failed:', error);
		throw error;
	}
});

global.beforeEach(async () => {
	if (mongoose.connection.readyState === 1) {
		await mongoose.connection.db.dropDatabase();
		Logger.log('Database cleared');
	} else {
		Logger.warn('MongoDB not connected. Current state:', mongoose.connection.readyState);
	}
});

global.afterAll(async () => {
	try {
		await app?.close();
		await mongoose.disconnect();
		Logger.log('Cleanup completed successfully');
	} catch (error) {
		Logger.error('Cleanup failed:', error);
	}
});

global.getApp = () => app;
