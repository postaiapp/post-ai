import { mappingIntegrationsErrors } from '@constants/errors';
import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Meta as MetaType } from '@type/meta';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';
import { InstagramAuthService } from '../services/instagram-auth.service';
import { InstagramAuthController } from './instagram-auth.controller';

jest.mock('@constants/errors', () => ({
  mappingIntegrationsErrors: jest.fn(),
}));

jest.mock('@guards/auth.guard', () => {
  return {
    AuthGuard: jest.fn().mockImplementation(() => ({
      canActivate: jest.fn().mockReturnValue(true),
    })),
  };
});

describe('InstagramAuthController', () => {
  let controller: InstagramAuthController;
  let service: InstagramAuthService;

  const mockInstagramAuthService = {
    createAccount: jest.fn(),
    login: jest.fn(),
    delete: jest.fn(),
    getAccounts: jest.fn(),
  };

  const mockMeta: MetaType = {
    userId: 'user-id',
	email: 'user-email',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstagramAuthController],
      providers: [
        {
          provide: InstagramAuthService,
          useValue: mockInstagramAuthService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InstagramAuthController>(InstagramAuthController);
    service = module.get<InstagramAuthService>(InstagramAuthService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an Instagram account successfully', async () => {
      const dto: InstagramAuthDto = { username: 'test', password: 'password' };
      const expectedResult = { success: true };
      
      mockInstagramAuthService.createAccount.mockResolvedValue(expectedResult);
      
      const result = await controller.create(dto, mockMeta);
      
      expect(service.createAccount).toHaveBeenCalledWith(dto, mockMeta);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors when creating an account', async () => {
      const dto: InstagramAuthDto = { username: 'test', password: 'password' };
      const error = new Error('Test error');
      
      mockInstagramAuthService.createAccount.mockRejectedValue(error);
      
      (mappingIntegrationsErrors as jest.Mock).mockReturnValue({
        logger: 'Error message',
        Exception: HttpException,
        status: 400,
        exceptionMessage: 'Mapped error message',
      });
      
      await expect(controller.create(dto, mockMeta)).rejects.toThrow(HttpException);
      expect(mappingIntegrationsErrors).toHaveBeenCalledWith(error, dto.username);
    });
  });

  describe('login', () => {
    it('should login to Instagram account successfully', async () => {
      const dto: InstagramAuthDto = { username: 'test', password: 'password' };
      const expectedResult = { success: true };
      
      mockInstagramAuthService.login.mockResolvedValue(expectedResult);
      
      const result = await controller.login(dto, mockMeta);
      
      expect(service.login).toHaveBeenCalledWith(dto, mockMeta);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors when logging in', async () => {
      const dto: InstagramAuthDto = { username: 'test', password: 'password' };
      const error = new Error('Test error');
      
      mockInstagramAuthService.login.mockRejectedValue(error);
      
      (mappingIntegrationsErrors as jest.Mock).mockReturnValue({
        logger: 'Error message',
        Exception: HttpException,
        status: 400,
        exceptionMessage: 'Mapped error message',
      });
      
      await expect(controller.login(dto, mockMeta)).rejects.toThrow(HttpException);
      expect(mappingIntegrationsErrors).toHaveBeenCalledWith(error, dto.username);
    });
  });

  describe('delete', () => {
    it('should delete an Instagram account', () => {
      const query: DeleteInstagramAuthDto = { username: 'test' };
      const expectedResult = { success: true };
      
      mockInstagramAuthService.delete.mockReturnValue(expectedResult);
      
      const result = controller.delete(query, mockMeta);
      
      expect(service.delete).toHaveBeenCalledWith(query, mockMeta);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAccounts', () => {
    it('should get all Instagram accounts', () => {
      const expectedResult = [{ username: 'test1' }, { username: 'test2' }];
      
      mockInstagramAuthService.getAccounts.mockReturnValue(expectedResult);
      
      const result = controller.getAccounts(mockMeta);
      
      expect(service.getAccounts).toHaveBeenCalledWith(mockMeta);
      expect(result).toEqual(expectedResult);
    });
  });
});
