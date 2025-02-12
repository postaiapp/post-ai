import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import mongoose from 'mongoose';
import { AppModule } from '../src/app.module';

let app: INestApplication;
let mongoContainer: StartedMongoDBContainer;
let mongoConnection: mongoose.Connection;

global.beforeAll(async () => {
	try {
		mongoContainer = await new MongoDBContainer().start();

		mongoConnection = mongoose.createConnection(mongoContainer.getConnectionString(), {
			directConnection: true,
		});

		await mongoConnection.asPromise();
`
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
			})
		);

		await app.init();
	} catch (error) {
		console.error('Erro no setup:', error);
		throw error;
	}
}, 120_000);

global.beforeEach(async () => {
	const collections = await mongoConnection.db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

global.afterAll(async () => {
	await app?.close();
	await mongoConnection?.close();
	await mongoContainer?.stop();
});

global.getApp = () => app;
