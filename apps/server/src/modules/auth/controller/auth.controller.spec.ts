import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockResponse = () => {
    const res = {} as Response;
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest = () => {
    return {} as Request;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticate: jest.fn(),
            register: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should authenticate a user and return response', async () => {
      const loginDto: LoginDto = { email: 'test@email.com', password: 'password123' };
      const res = mockResponse();
      const expectedResult = { 
        user: { id: '1', email: 'test@email.com' },
        token: 'mock-token'
      };
      
      jest.spyOn(authService, 'authenticate').mockResolvedValue(expectedResult);
      
      await controller.create(loginDto, res);
      
      expect(authService.authenticate).toHaveBeenCalledWith({ ...loginDto, res });
      expect(res.send).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('register', () => {
    it('should register a new user', () => {
      const registerDto: RegisterDto = { 
        email: 'test@email.com', 
        password: 'password123',
        name: 'Test User'
      };
      const expectedResult = { id: '1', email: 'test@email.com' };
      
      jest.spyOn(authService, 'register').mockReturnValue(expectedResult as any);
      
      const result = controller.register(registerDto);
      
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshToken', () => {
    it('should update the access token', async () => {
      const req = mockRequest();
      
      jest.spyOn(authService, 'refreshToken').mockResolvedValue({ token: 'new-token' });
      
      const result = await controller.refreshToken(req);
      
      expect(authService.refreshToken).toHaveBeenCalledWith(req);
      expect(result).toEqual({ token: 'new-token' });
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const req = mockRequest();
      
      jest.spyOn(authService, 'refreshToken').mockRejectedValue(new Error('INVALID_REFRESH_TOKEN'));

      await expect(controller.refreshToken(req)).rejects.toThrow('INVALID_REFRESH_TOKEN');
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const res = mockResponse();
      
      jest.spyOn(authService, 'logout').mockResolvedValue();
      
      await controller.logout(res);
      
      expect(authService.logout).toHaveBeenCalledWith(res);
    });
  });
});
