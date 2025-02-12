import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { InstagramAuthService } from './instagram-auth.service';

describe('InstagramAuthService', () => {
	let service: InstagramAuthService;
	let userModel: Model<User>;
	let igClient: IgApiClient;

	const mockUserModel = {
		findOne: jest.fn(),
		findOneAndUpdate: jest.fn(),
	};

	const mockIgClient = {
		state: {
			generateDevice: jest.fn(),
			serialize: jest.fn(),
			deserialize: jest.fn(),
		},
		account: {
			login: jest.fn(),
		},
		user: {
			info: jest.fn(),
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				InstagramAuthService,
				{
					provide: getModelToken(User.name),
					useValue: mockUserModel,
				},
				{
					provide: IgApiClient,
					useValue: mockIgClient,
				},
			],
		}).compile();

		service = module.get<InstagramAuthService>(InstagramAuthService);
		userModel = module.get<Model<User>>(getModelToken(User.name));
		igClient = module.get<IgApiClient>(IgApiClient);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('hasInstagramAccount', () => {
		it('should throw NotFoundException when user is not found', async () => {
			mockUserModel.findOne.mockResolvedValueOnce(null);

			await expect(
				service.hasInstagramAccount({ userId: 1, email: 'test@example.com' }, 'username')
			).rejects.toThrow(NotFoundException);
		});

		it('should return null when instagram account is not found', async () => {
			mockUserModel.findOne.mockResolvedValueOnce({ _id: 'user-id-1', InstagramAccounts: [] });

			const result = await service.hasInstagramAccount({ userId: 1, email: 'test@example.com' }, 'username');
			expect(result).toBeNull();
		});

		it('should return account details when found', async () => {
			const mockAccount = {
				InstagramAccounts: [{ accountId: 'account-id', session: { state: 'state' } }],
			};

			mockUserModel.findOne.mockResolvedValueOnce(mockAccount);

			const result = await service.hasInstagramAccount({ userId: 1, email: 'test@example.com' }, 'username');
			expect(result).toEqual({ accountId: 'account-id', session: { state: 'state' } });
		});
	});

	describe('login', () => {
		const loginData = { username: 'test_user', password: 'test_pass' };
		const mockLoginResponse = { pk: '123456', username: 'test_user' };
		const mockUserInfo = {
			username: 'test_user',
			full_name: 'Test User',
		};

		it('should successfully login and return user data', async () => {
			mockIgClient.account.login.mockResolvedValueOnce(mockLoginResponse);
			mockIgClient.user.info.mockResolvedValueOnce(mockUserInfo);
			mockIgClient.state.serialize.mockResolvedValueOnce({ serialized: 'state' });

			const result = await service.login(loginData, { userId: 1, email: 'test@example.com' });

			expect(result).toMatchObject({
				username: mockUserInfo.username,
				fullName: mockUserInfo.full_name,
				accountId: mockLoginResponse.pk.toString(),
			});
			expect(mockIgClient.state.generateDevice).toHaveBeenCalledWith(loginData.username);
		});
	});

	describe('createAccount', () => {
		const createData = { username: 'new_user', password: 'password' };

		it('should throw BadRequestException if account already exists', async () => {
			jest.spyOn(service, 'hasInstagramAccount').mockResolvedValueOnce({
				accountId: '123',
				session: {
					state: 'state',
					isValid: true,
					lastChecked: new Date(),
					lastRefreshed: new Date(),
				},
			});

			await expect(service.createAccount(createData, { userId: 1, email: 'test@example.com' })).rejects.toThrow(
				BadRequestException
			);
		});

		it('should create new account if it does not exist', async () => {
			jest.spyOn(service, 'hasInstagramAccount').mockResolvedValueOnce(null);
			jest.spyOn(service, 'addAccount').mockResolvedValueOnce({
				newUser: {
					name: 'Test User',
					email: 'test@example.com',
					password: 'password',
					InstagramAccounts: [
						{
							accountId: '123',
							session: {
								state: 'state',
								isValid: true,
								lastChecked: new Date(),
								lastRefreshed: new Date(),
							},
							username: '',
							fullName: '',
							biography: '',
							followerCount: 0,
							followingCount: 0,
							postCount: 0,
							profilePicUrl: '',
							lastLogin: undefined,
						},
					],
				},
			});

			const result = await service.createAccount(createData, { userId: 1, email: 'test@example.com' });
			expect(result).toEqual({ newUser: { email: 'test@example.com' } });
		});
	});

	describe('delete', () => {
		it('should successfully delete an Instagram account', async () => {
			const mockUpdatedUser = { InstagramAccounts: [] };
			mockUserModel.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedUser);

			const result = await service.delete({ username: 'test_user' }, { userId: 1, email: 'test@example.com' });

			expect(result).toEqual({ instagramAccounts: [] });
			expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: undefined },
				{ $pull: { InstagramAccounts: { username: 'test_user' } } },
				{ new: true }
			);
		});

		it('should throw BadRequestException when user not found', async () => {
			mockUserModel.findOneAndUpdate.mockResolvedValueOnce(null);

			await expect(
				service.delete({ username: 'test_user' }, { userId: 1, email: 'test@example.com' })
			).rejects.toThrow(BadRequestException);
		});
	});
});
