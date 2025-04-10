import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import * as request from 'supertest';

describe('Auth Controller (e2e)', () => {
	let app: NestApplication;
	const prefix = 'auth';

	beforeEach(() => {
		app = global.getApp();
	});

	it('should be able to register and log in - /register (POST) and /auth (POST)', async () => {
		const userResponse = await request(app.getHttpServer()).post(`/${prefix}/register`).send({
			name: 'michelle',
			email: 'mi@email.com',
			password: '12345678',
		});

		expect(userResponse.status).toBe(HttpStatus.CREATED);
		expect(userResponse.body.user).toBeDefined();

		const authResponse = await request(app.getHttpServer()).post(`/${prefix}`).send({
			email: 'mi@email.com',
			password: '12345678',
		});

		expect(authResponse.status).toBe(HttpStatus.OK);
		expect(authResponse.body.token).toBeTruthy();
	});
});
