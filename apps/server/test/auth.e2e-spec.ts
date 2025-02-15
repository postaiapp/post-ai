import { NestApplication } from '@nestjs/core';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
	let app: NestApplication;

	beforeEach(() => {
		app = global.getApp();
	});

	it('/auth (POST)', async () => {
		const userResponse = await request(app.getHttpServer()).post('/auth/register').send({
			name: 'michelle',
			email: 'mi@email.com',
			password: '12345678',
		});

		expect(userResponse.status).toBe(201);

		const authResponse = await request(app.getHttpServer()).post('/auth').send({
			email: 'mi@email.com',
			password: '12345678',
		});

		expect(authResponse.status).toBe(200);
		expect(authResponse.body.token).toBeTruthy();
	});
});
