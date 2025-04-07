import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@schemas/user.schema';
import { Meta } from '@type/meta';
import { Uploader } from '@type/storage';
import { IgApiClient } from 'instagram-private-api';
import { Model, Types } from 'mongoose';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';
import { InstagramAuthService } from './instagram-auth.service';

describe('InstagramAuthService', () => {
  let service: InstagramAuthService;
  let userModel: Model<User>;
  let igApiClient: IgApiClient;
  let storageService: any;

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

  const mockStorageService = {
    getSignedImageUrl: jest.fn().mockImplementation((url) => Promise.resolve(`signed-${url}`)),
    downloadAndUploadImage: jest.fn().mockImplementation((url) => Promise.resolve({ url: 'uploaded-url' }))
  };

  const mockMeta: Meta = {
    userId: 'user-id-1',
    email: 'user@example.com',
  };

  const mockInstagramAuthDto: InstagramAuthDto = {
    username: 'testuser',
    password: 'testpassword',
  };

  const mockDeleteInstagramAuthDto: DeleteInstagramAuthDto = {
    username: 'testuser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: IgApiClient,
          useValue: mockIgApiClient,
        },
        {
          provide: Uploader,
          useValue: mockStorageService,
        },
        InstagramAuthService,
      ],
    }).compile();

    service = module.get<InstagramAuthService>(InstagramAuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    igApiClient = module.get<IgApiClient>(IgApiClient);
    storageService = module.get(Uploader);

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

    it('should return null if account not found', async () => {
      mockUserModel.findOne.mockResolvedValueOnce({ _id: 'user-id-1' });
      
      mockUserModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null)
      });

      const result = await service.hasInstagramAccount(mockMeta, 'testuser');
      
      expect(result).toBeNull();
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(2);
    });

    it('should return account details if account exists', async () => {
      const mockAccount = {
        InstagramAccounts: [
          {
            accountId: 'insta-123',
            session: { 
              state: 'serialized-state', 
              lastChecked: new Date(), 
              isValid: true, 
              lastRefreshed: new Date() 
            },
          },
        ],
      };

      mockUserModel.findOne.mockResolvedValueOnce({ _id: 'user-id-1' });
      mockUserModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockAccount)
      });

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
        session: { state: 'serialized-state', isValid: true, lastChecked: new Date(), lastRefreshed: new Date() },
      });

      await expect(service.createAccount(dto, mockMeta)).rejects.toThrow(BadRequestException);
    });

    it('should create a new account successfully', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      const mockNewUser = { 
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test User', 
        email: 'test@example.com', 
        password: 'hashedpassword', 
        InstagramAccounts: [],
        __v: 0
      };
      
      jest.spyOn(service, 'hasInstagramAccount').mockResolvedValueOnce(null);
      jest.spyOn(service, 'addAccount').mockResolvedValueOnce({ 
        newUser: mockNewUser
      });

      const result = await service.createAccount(dto, mockMeta);
      
      expect(result).toEqual({ newUser: mockNewUser });
      expect(service.hasInstagramAccount).toHaveBeenCalledWith(mockMeta, dto.username);
      expect(service.addAccount).toHaveBeenCalledWith(dto, mockMeta);
    });
  });

  describe('login', () => {
    it('should throw an error if login fails', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      
      const loginError = new Error('Login failed');
      mockIgApiClient.account.login.mockRejectedValueOnce(loginError);

      await expect(service.login(dto, mockMeta)).rejects.toThrow();
    });

    it('should login successfully', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      
      const mockUser = { pk: '12345', username: 'testuser' };
      const mockUserInfo = {
        username: 'testuser',
        full_name: 'Test User',
        profile_pic_url: 'http://example.com/pic.jpg',
        pk: '12345',
      };

      const mockSerializedState = { deviceString: 'test-device' };
      mockIgApiClient.state.serialize.mockResolvedValueOnce(mockSerializedState);
      mockIgApiClient.account.login.mockResolvedValueOnce(mockUser);
      mockIgApiClient.user.info.mockResolvedValueOnce(mockUserInfo);

      mockUserModel.findOneAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce({
          _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
          InstagramAccounts: [{ username: 'testuser', accountId: '12345' }]
        })
      });

      const result = await service.login(dto, mockMeta);
      expect(result).toBeDefined();
    });
  });

  describe('addAccount', () => {
    it('should add an Instagram account successfully', async () => {
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
      
      const mockNewUser = {
        email: 'user@example.com',
        InstagramAccounts: [{ username: 'testuser', accountId: '12345' }],
      };

      mockIgApiClient.account.login.mockResolvedValueOnce(mockUser);
      mockIgApiClient.user.info.mockResolvedValueOnce(mockUserInfo);
      mockIgApiClient.state.serialize.mockResolvedValueOnce('serialized-state');
      
      mockUserModel.findOneAndUpdate.mockReturnThis();
      mockUserModel.lean.mockResolvedValueOnce(mockNewUser);

      const result = await service.addAccount(dto, mockMeta);
      
      expect(result).toEqual({ newUser: mockNewUser });
      expect(mockIgApiClient.state.generateDevice).toHaveBeenCalledWith(dto.username);
      expect(mockIgApiClient.account.login).toHaveBeenCalledWith(dto.username, dto.password);
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw an error if adding account fails', async () => {
      const dto: InstagramAuthDto = { username: 'testuser', password: 'password123' };
      
      const loginError = new Error('Login failed');
      mockIgApiClient.account.login.mockRejectedValueOnce(loginError);
      
      await expect(service.addAccount(dto, mockMeta)).rejects.toThrow();
    });
  });

  describe('getAccounts', () => {
    it('should return user accounts', async () => {
      const mockAccounts = {
        InstagramAccounts: [
          {
            _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
            username: 'testuser1',
            accountId: 'insta-123',
            profilePicUrl: 'http://example.com/pic1.jpg',
          },
        ],
      };

      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockAccounts)
      });
      
      mockStorageService.getSignedImageUrl = jest.fn().mockImplementation((url) => Promise.resolve(`signed-${url}`));
      
      const result = await service.getAccounts(mockMeta);
      
      expect(result.accounts).toBeDefined();
      expect(Array.isArray(result.accounts)).toBeTruthy();
    });

    it('should return empty accounts array if user has no accounts', async () => {
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce({ InstagramAccounts: [] })
      });

      const result = await service.getAccounts(mockMeta);
      expect(result).toEqual({ accounts: [] });
    });
  });

  describe('delete', () => {
    it('should delete account and return updated accounts list', async () => {
      const dto: DeleteInstagramAuthDto = { username: 'testuser' };
      const mockUpdatedUser = {
        InstagramAccounts: [
          {
            _id: new Types.ObjectId('67f31c2af5b6a2cee7981f4b'),
            username: 'testuser1',
            accountId: 'insta-123',
            profilePicUrl: 'http://example.com/pic1.jpg',
          },
          {
            _id: new Types.ObjectId('67f31c2af5b6a2cee7981f4c'),
            username: 'testuser2',
            accountId: 'insta-456',
            profilePicUrl: 'http://example.com/pic2.jpg',
          },
        ],
      };

      mockUserModel.findOneAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockUpdatedUser)
      });

      const result = await service.delete(dto, mockMeta);
      
      expect(result).toEqual({ newUser: mockUpdatedUser });
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

      mockUserModel.findOneAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(null)
      });

      await expect(service.delete(dto, mockMeta)).rejects.toThrow(
        new BadRequestException('USER_NOT_FOUND')
      );

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
  });

  describe('getToken', () => {
    it('should return a valid session token', async () => {
      const mockSerializedState = {
        deviceString: 'test-device',
        deviceId: 'test-device-id',
        uuid: 'test-uuid',
        phoneId: 'test-phone-id',
        adid: 'test-adid',
        build: 'test-build'
      };

      mockIgApiClient.state.serialize.mockResolvedValueOnce(mockSerializedState);

      const result = await service.getToken();
      
      const expectedState = Buffer.from(JSON.stringify(mockSerializedState)).toString('base64');
      
      expect(result).toEqual({
        state: expectedState,
        lastChecked: expect.any(Date),
        isValid: true,
        lastRefreshed: expect.any(Date),
      });
      
      expect(mockIgApiClient.state.serialize).toHaveBeenCalled();
    });
  });
});
