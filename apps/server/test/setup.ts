import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { AppModule } from '../src/app.module';

config({ path: `.env.${process.env.NODE_ENV}` });

let app: INestApplication;

global.beforeAll(async () => {
	try {
		console.log('Environment:', process.env.NODE_ENV);
		console.log('MongoDB URI:', process.env.MONGODB_URI);

		if (!process.env.MONGODB_URI) {
			throw new Error('MONGODB_URI is not defined');
		}

		await mongoose.connect(process.env.MONGODB_URI);
		console.log('MongoDB connected successfully');

		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
				transformOptions: { enableImplicitConversion: true },
			})
		);

		await app.init();
		console.log('Application initialized successfully');
	} catch (error) {
		console.error('Setup failed:', error);
		throw error;
	}
});

global.beforeEach(async () => {
	if (mongoose.connection.readyState === 1) {
		await mongoose.connection.db.dropDatabase();
		console.log('Database cleared');
	} else {
		console.warn('MongoDB not connected. Current state:', mongoose.connection.readyState);
	}
});

global.afterAll(async () => {
	try {
		await app?.close();
		await mongoose.disconnect();
		console.log('Cleanup completed successfully');
	} catch (error) {
		console.error('Cleanup failed:', error);
	}
});

global.getApp = () => app;
