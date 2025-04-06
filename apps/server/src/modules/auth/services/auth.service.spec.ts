import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { RegisterDto } from '../dto/auth.dto';
import { AuthService } from './auth.service';
import { User } from '../../../schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    lean: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Limpar todos os mocks após cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticate', () => {
    it('should authenticate a user with valid credentials', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
      };
      
      const mockResponse = {
        cookie: jest.fn(),
      };

      mockUserModel.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUser),
      });
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(service, 'generateToken')
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      // Act
      const result = await service.authenticate({
        email: 'test@example.com',
        password: 'password123',
        res: mockResponse as any,
      });

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(service.generateToken).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
        })
      );
      expect(result).toEqual({
        user: {
          _id: userId,
          email: 'test@example.com',
          name: 'Test User',
          id: userId.toString(),
        },
        token: 'access-token',
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      mockUserModel.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      // Act & Assert
      await expect(
        service.authenticate({
          email: 'nonexistent@example.com',
          password: 'password123',
          res: {} as any,
        })
      ).rejects.toThrow(UnauthorizedException);
      
      expect(bcrypt.compare).toHaveBeenCalled(); // Verifica que o fake password foi comparado
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const mockUser = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      
      mockUserModel.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUser),
      });
      
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      // Act & Assert
      await expect(
        service.authenticate({
          email: 'test@example.com',
          password: 'wrongpassword',
          res: {} as any,
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
      };
      
      const mockRequest = {
        cookies: {
          refreshToken: 'valid-refresh-token',
        },
      };

      mockJwtService.verifyAsync.mockResolvedValue({ userId, email: 'test@example.com' });
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUser),
      });
      jest.spyOn(service, 'generateToken').mockResolvedValue('new-access-token');
      mockConfigService.get.mockReturnValue('jwt-secret');

      // Act
      const result = await service.refreshToken(mockRequest as any);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-refresh-token', {
        secret: 'jwt-secret',
      });
      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(service.generateToken).toHaveBeenCalledWith({
        user: mockUser,
        expiresIn: '15m',
      });
      expect(result).toEqual({
        token: 'new-access-token',
      });
    });

    it('should throw UnauthorizedException when refresh token is missing', async () => {
      // Arrange
      const mockRequest = {
        cookies: {},
      };

      // Act & Assert
      await expect(service.refreshToken(mockRequest as any)).rejects.toThrow(
        new UnauthorizedException('INVALID_REFRESH_TOKEN')
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const mockRequest = {
        cookies: {
          refreshToken: 'valid-refresh-token',
        },
      };

      mockJwtService.verifyAsync.mockResolvedValue({ userId: 'user-id', email: 'test@example.com' });
      mockUserModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      mockConfigService.get.mockReturnValue('jwt-secret');

      // Act & Assert
      await expect(service.refreshToken(mockRequest as any)).rejects.toThrow(
        new UnauthorizedException('INVALID_REFRESH_TOKEN')
      );
    });
  });

  describe('logout', () => {
    it('should clear refresh token cookie', async () => {
      // Arrange
      const mockResponse = {
        clearCookie: jest.fn(),
      };

      // Act
      await service.logout(mockResponse as any);

      // Assert
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const registerDto: RegisterDto = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const mockNewUser = {
        _id: userId,
        name: 'New User',
        email: 'new@example.com',
        password: 'hashedPassword',
      };

      mockUserModel.countDocuments.mockResolvedValue(0);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockUserModel.create.mockResolvedValue(mockNewUser);

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockUserModel.countDocuments).toHaveBeenCalledWith({ email: 'new@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'hashedPassword',
      });
      expect(result).toEqual({
        user: {
          name: 'New User',
          email: 'new@example.com',
          id: userId.toString(),
        },
      });
    });

    it('should throw UnauthorizedException when email already exists', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockUserModel.countDocuments.mockResolvedValue(1);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        new UnauthorizedException('REGISTRATION_FAILED')
      );
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const user = {
        _id: userId,
        email: 'test@example.com',
      };
      
      mockJwtService.signAsync.mockResolvedValue('generated-token');
      mockConfigService.get.mockReturnValue('jwt-secret');

      // Act
      const token = await service.generateToken({ user, expiresIn: '1d' });

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { userId: userId, email: 'test@example.com' },
        {
          secret: 'jwt-secret',
          expiresIn: '1d',
        }
      );
      expect(token).toBe('generated-token');
    });
  });
});
