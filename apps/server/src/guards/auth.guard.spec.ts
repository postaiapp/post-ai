import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let jwtService: JwtService;
	let configService: ConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
				{
					provide: JwtService,
					useValue: {
						verifyAsync: jest.fn(),
					},
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn().mockImplementation(key => {
							if (key === 'JWT_SECRET') return 'test-secret';
							return null;
						}),
					},
				},
			],
		}).compile();

		guard = module.get<AuthGuard>(AuthGuard);
		jwtService = module.get<JwtService>(JwtService);
		configService = module.get<ConfigService>(ConfigService);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	describe('canActivate', () => {
		let context: ExecutionContext;
		let request: Partial<Request>;

		beforeEach(() => {
			request = {
				headers: {
					authorization: 'Bearer valid-token',
				},
			};
			context = {
				switchToHttp: () => ({
					getRequest: () => request,
				}),
			} as unknown as ExecutionContext;
		});

		it('should return true if token is valid', async () => {
			const payload = { user: { userId: 1, email: 'testUser@email.com' } };
			jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

			const result = await guard.canActivate(context);
			expect(result).toBe(true);
			expect((request as Request & { user: any }).user).toEqual(payload.user);
		});

		it('should return true if token is valid', async () => {
			const payload = { id: 1, name: 'Test User' };
			jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

			const result = await guard.canActivate(context);
			expect(result).toBe(true);
			expect((request as Request & { user: any }).user).toEqual(payload);
		});

		it('should throw UnauthorizedException if token is invalid', async () => {
			jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());

			await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
		});

		it('should throw UnauthorizedException if no token is provided', async () => {
			request.headers.authorization = '';

			await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
		});

		it('should throw UnauthorizedException if authorization header is malformed', async () => {
			request.headers.authorization = 'InvalidHeader';

			await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
		});
	});

	describe('extractTokenFromHeader', () => {
		it('should extract token from Bearer authorization header', () => {
			const request = {
				headers: {
					authorization: 'Bearer valid-token',
				},
			} as Request;

			const token = guard['extractJwt'](request);
			expect(token).toBe('valid-token');
		});

		it('should return undefined if authorization header is not Bearer', () => {
			const request = {
				headers: {
					authorization: 'Basic some-token',
				},
			} as Request;

			const token = guard['extractJwt'](request);
			expect(token).toBeUndefined();
		});

		it('should return undefined if authorization header is missing', () => {
			const request = {
				headers: {},
			} as Request;

			const token = guard['extractJwt'](request);
			expect(token).toBeUndefined();
		});
	});
});
