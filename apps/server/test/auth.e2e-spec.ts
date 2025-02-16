import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
	let app: NestApplication;
	const prefix = 'auth';

	beforeEach(() => {
		app = global.getApp();
	});

	it('Auth flux - /auth (POST)', async () => {
		const userResponse = await request(app.getHttpServer()).post(`/${prefix}/register`).send({
			name: 'michelle',
			email: 'mi@email.com',
			password: '12345678',
		});

		expect(userResponse.status).toBe(HttpStatus.CREATED);

		const authResponse = await request(app.getHttpServer()).post(`/${prefix}`).send({
			email: 'mi@email.com',
			password: '12345678',
		});

		expect(authResponse.status).toBe(HttpStatus.OK);
		expect(authResponse.body.token).toBeTruthy();
	});

	it('Register flux - /register (POST)', async () => {
		const registerResponse = await request(app.getHttpServer()).post(`/${prefix}/register`).send({
			name: 'michelle',
			email: 'mi@email.com',
			password: '12345678',
		});

		expect(registerResponse.status).toBe(HttpStatus.CREATED);
		expect(registerResponse.body.user).toBeTruthy();
	});

	it('Refresh and logout flux - /refresh (PATCH) and /logout (POST)', async () => {
		await request(app.getHttpServer()).post(`/${prefix}/register`).send({
			name: 'michelle',
			email: 'mi@email.com',
			password: '12345678',
		});

		const authResponse = await request(app.getHttpServer()).post(`/${prefix}`).send({
			email: 'mi@email.com',
			password: '12345678',
		});

		const cookies = authResponse.headers['set-cookie'];
		expect(cookies).toBeDefined();
		expect(Array.isArray(cookies)).toBe(true);

		const refreshToken = Array.isArray(cookies)
			? cookies.find((cookie) => cookie.startsWith('refreshToken='))
			: null;

		expect(refreshToken).toBeDefined();

		const refreshResponse = await request(app.getHttpServer())
			.patch(`/${prefix}/refresh`)
			.set('Cookie', refreshToken);

		expect(refreshResponse.status).toBe(HttpStatus.OK);
		expect(refreshResponse.body.token).toBeTruthy();

		const logoutResponse = await request(app.getHttpServer()).post(`/${prefix}/logout`);

		const cookiesLogout = logoutResponse.headers['set-cookie'];

		expect(cookiesLogout).toBeFalsy();
	});
});
