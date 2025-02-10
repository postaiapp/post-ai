import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { MongoClient } from 'mongodb';
import { AppModule } from '../src/app.module';

let app: INestApplication;
let mongoContainer: StartedMongoDBContainer;
let mongoClient: MongoClient;

global.beforeAll(async () => {
	try {
		mongoContainer = await new MongoDBContainer().start();

		const mongoUri = mongoContainer.getConnectionString();

		mongoClient = new MongoClient(mongoUri);
		await mongoClient.connect();

		process.env.MONGO_URI = mongoUri;

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
	const db = mongoClient.db();
	const collections = await db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

global.afterAll(async () => {
	await app?.close();
	await mongoClient?.close();
	await mongoContainer?.stop();
});

global.getApp = () => app;
