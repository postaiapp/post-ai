import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';
import { InstagramAuthService } from './instagram-auth.service';

describe('InstagramAuthService', () => {
  let service: InstagramAuthService;
  let userModel: Model<User>;
  let igApiClient: IgApiClient;

  const mockUserModel = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    lean: jest.fn(),
  };

  const mockIgApiClient = {
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

  const mockMeta = {
    userId: 'user-id-1',
    email: 'user@example.com',
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
          useValue: mockIgApiClient,
        },
      ],
    }).compile();

    service = module.get<InstagramAuthService>(InstagramAuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    igApiClient = module.get<IgApiClient>(IgApiClient);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hasInstagramAccount', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);

      await expect(service.hasInstagramAccount(mockMeta, 'testuser')).rejects.toThrow(NotFoundException);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: mockMeta.userId });
    });

    it.skip('should return null if account not found', async () => {
      mockUserModel.findOne.mockResolvedValueOnce({ _id: 'user-id-1' });
      mockUserModel.findOne.mockResolvedValueOnce(null);

      const result = await service.hasInstagramAccount(mockMeta, 'testuser');
      expect(result).toBeNull();
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(2);
    });

    it.skip('should return account details if account exists', async () => {
      const mockAccount = {
        InstagramAccounts: [
          {
            accountId: 'insta-123',
            session: { state: 'serialized-state', lastChecked: new Date(), isValid: true, lastRefreshed: new Date() },
          },
        ],
      };

      mockUserModel.findOne.mockResolvedValueOnce({ _id: 'user-id-1' });
      mockUserModel.findOne.mockResolvedValueOnce(mockAccount);

      const result = await service.hasInstagramAccount(mockMeta, 'testuser');
      
      expect(result).toEqual({
        accountId: 'insta-123',
        session: mockAccount.InstagramAccounts[0].session,
      });
    });
  });

  describe('createAccount', () => {
    it('should throw BadRequestException if account already exists', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      
      jest.spyOn(service, 'hasInstagramAccount').mockResolvedValueOnce({
        accountId: 'insta-123',
        session: { state: 'serialized-state', lastChecked: new Date(), isValid: true, lastRefreshed: new Date() },
      });

      await expect(service.createAccount(dto, mockMeta)).rejects.toThrow(BadRequestException);
      expect(service.hasInstagramAccount).toHaveBeenCalledWith(mockMeta, dto.username);
    });

    it('should call addAccount if account does not exist', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      const mockResult = {
        newUser: {
          email: 'user@example.com',
          name: 'Test User',
          password: 'hashedPassword',
          InstagramAccounts: [{
            accountId: '12345',
            username: 'testuser',
            fullName: 'Test User',
            biography: 'Bio',
            followerCount: 100,
            followingCount: 200,
            session: {
              state: 'serialized-state',
              lastChecked: new Date(),
              isValid: true,
              lastRefreshed: new Date()
            }
          }]
        }
      };
      
      jest.spyOn(service, 'hasInstagramAccount').mockResolvedValueOnce(null);
      jest.spyOn(service, 'addAccount').mockResolvedValueOnce(mockResult as any);

      const result = await service.createAccount(dto, mockMeta);
      
      expect(result).toEqual(mockResult);
      expect(service.hasInstagramAccount).toHaveBeenCalledWith(mockMeta, dto.username);
      expect(service.addAccount).toHaveBeenCalledWith(dto, mockMeta);
    });
  });

  describe('getToken', () => {
    it('should return serialized session token', async () => {
      const mockSerializedState = { cookies: 'some-cookies', device: 'some-device' };
      mockIgApiClient.state.serialize.mockResolvedValueOnce(mockSerializedState);

      const result = await service.getToken();
      
      expect(result).toHaveProperty('state');
      expect(result).toHaveProperty('lastChecked');
      expect(result).toHaveProperty('isValid', true);
      expect(result).toHaveProperty('lastRefreshed');
      expect(mockIgApiClient.state.serialize).toHaveBeenCalled();
    });
  });

  describe('restoreSession', () => {
    it('should restore session successfully', async () => {
      const username = 'testuser';
      const session = {
        state: Buffer.from(JSON.stringify({ cookies: 'some-cookies' })).toString('base64'),
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };

      const result = await service.restoreSession(username, session);
      
      expect(result).toBe(true);
      expect(mockIgApiClient.state.generateDevice).toHaveBeenCalledWith(username);
      expect(mockIgApiClient.state.deserialize).toHaveBeenCalled();
    });

    it('should return false if session restoration fails', async () => {
      const username = 'testuser';
      const session = {
        state: 'invalid-state',
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };

      mockIgApiClient.state.deserialize.mockRejectedValueOnce(new Error('Failed to deserialize'));

      const result = await service.restoreSession(username, session);
      
      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    it('should login and return account data', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      
      const mockUser = { pk: '12345', username: 'testuser' };
      const mockAccount = {
        username: 'testuser',
        full_name: 'Test User',
        biography: 'Bio',
        follower_count: 100,
        following_count: 200,
        media_count: 50,
        profile_pic_url: 'http://example.com/pic.jpg',
        is_private: false,
        is_verified: true,
      };
      const mockSession = {
        state: 'serialized-state',
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };

      mockIgApiClient.account.login.mockResolvedValueOnce(mockUser);
      mockIgApiClient.user.info.mockResolvedValueOnce(mockAccount);
      jest.spyOn(service, 'getToken').mockResolvedValueOnce(mockSession);
      mockUserModel.findOneAndUpdate.mockReturnThis();
      mockUserModel.lean.mockResolvedValueOnce({});

      const result = await service.login(dto, mockMeta);
      
      expect(result).toEqual({
        username: mockAccount.username,
        fullName: mockAccount.full_name,
        biography: mockAccount.biography,
        followerCount: mockAccount.follower_count,
        followingCount: mockAccount.following_count,
        postCount: mockAccount.media_count,
        profilePicUrl: mockAccount.profile_pic_url,
        lastLogin: expect.any(Date),
        accountId: mockUser.pk.toString(),
        isPrivate: mockAccount.is_private,
        isVerified: mockAccount.is_verified,
      });
      expect(mockIgApiClient.state.generateDevice).toHaveBeenCalledWith(dto.username);
      expect(mockIgApiClient.account.login).toHaveBeenCalledWith(dto.username, dto.password);
    });
  });

  describe('addAccount', () => {
    it('should add account and return user data', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      
      const mockUser = { pk: '12345', username: 'testuser' };
      const mockUserInfo = {
        full_name: 'Test User',
        biography: 'Bio',
        follower_count: 100,
        following_count: 200,
        media_count: 50,
        profile_pic_url: 'http://example.com/pic.jpg',
        is_private: false,
        is_verified: true,
      };
      const mockSession = {
        state: 'serialized-state',
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };
      const mockNewUser = {
        email: 'user@example.com',
        InstagramAccounts: [{ username: 'testuser', accountId: '12345' }],
      };

      mockIgApiClient.account.login.mockResolvedValueOnce(mockUser);
      mockIgApiClient.user.info.mockResolvedValueOnce(mockUserInfo);
      jest.spyOn(service, 'getToken').mockResolvedValueOnce(mockSession);
      mockUserModel.findOneAndUpdate.mockReturnThis();
      mockUserModel.lean.mockResolvedValueOnce(mockNewUser);

      const result = await service.addAccount(dto, mockMeta);
      
      expect(result).toEqual({ newUser: mockNewUser });
      expect(mockIgApiClient.state.generateDevice).toHaveBeenCalledWith(dto.username);
      expect(mockIgApiClient.account.login).toHaveBeenCalledWith(dto.username, dto.password);
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw BadRequestException if adding account fails', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      
      const mockUser = { pk: '12345', username: 'testuser' };
      const mockUserInfo = {
        full_name: 'Test User',
        biography: 'Bio',
        follower_count: 100,
        following_count: 200,
        media_count: 50,
        profile_pic_url: 'http://example.com/pic.jpg',
        is_private: false,
        is_verified: true,
      };
      const mockSession = {
        state: 'serialized-state',
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };

      mockIgApiClient.account.login.mockResolvedValueOnce(mockUser);
      mockIgApiClient.user.info.mockResolvedValueOnce(mockUserInfo);
      jest.spyOn(service, 'getToken').mockResolvedValueOnce(mockSession);
      mockUserModel.findOneAndUpdate.mockReturnThis();
      mockUserModel.lean.mockResolvedValueOnce(null);

      await expect(service.addAccount(dto, mockMeta)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAccounts', () => {
    it('should return user accounts', async () => {
      const mockAccounts = {
        InstagramAccounts: [
          {
            _id: 'account-id-1',
            username: 'testuser1',
            accountId: 'insta-123',
          },
          {
            _id: 'account-id-2',
            username: 'testuser2',
            accountId: 'insta-456',
          },
        ],
      };

      mockUserModel.findOne.mockReturnThis();
      mockUserModel.lean.mockResolvedValueOnce(mockAccounts);

      const result = await service.getAccounts(mockMeta);
      
      expect(result).toEqual({
        accounts: [
          {
            ...mockAccounts.InstagramAccounts[0],
            id: 'account-id-1',
            _id: undefined,
          },
          {
            ...mockAccounts.InstagramAccounts[1],
            id: 'account-id-2',
            _id: undefined,
          },
        ],
      });
      expect(mockUserModel.findOne).toHaveBeenCalledWith(
        { _id: mockMeta.userId },
        { InstagramAccounts: 1, _id: 0 }
      );
    });

    it('should return empty accounts array if user has no accounts', async () => {
      mockUserModel.findOne.mockReturnThis();
      mockUserModel.lean.mockResolvedValueOnce({});

      const result = await service.getAccounts(mockMeta);
      
      expect(result).toEqual({ accounts: [] });
    });
  });

  describe('delete', () => {
    it('should delete account and return updated accounts list', async () => {
      const dto: DeleteInstagramAuthDto = { username: 'testuser' };
      const mockUpdatedUser = {
        InstagramAccounts: [
          { username: 'otheruser', accountId: 'insta-456' },
        ],
      };

      mockUserModel.findOneAndUpdate.mockReturnThis();
      mockUserModel.lean.mockResolvedValueOnce(mockUpdatedUser);

      const result = await service.delete(dto, mockMeta);
      
      expect(result).toEqual({ instagramAccounts: mockUpdatedUser.InstagramAccounts });
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockMeta.userId },
        {
          $pull: {
            InstagramAccounts: { username: dto.username },
          },
        },
        { new: true }
      );
    });

    it('should throw BadRequestException if user not found', async () => {
      const dto: DeleteInstagramAuthDto = { username: 'testuser' };

      mockUserModel.findOneAndUpdate.mockReturnThis();
      mockUserModel.lean.mockResolvedValueOnce(null);

      await expect(service.delete(dto, mockMeta)).rejects.toThrow(BadRequestException);
    });
  });
});
