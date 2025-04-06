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
    it('deve autenticar um usuário e retornar resposta', async () => {
      const loginDto: LoginDto = { email: 'teste@email.com', password: 'senha123' };
      const res = mockResponse();
      const expectedResult = { 
        user: { id: '1', email: 'teste@email.com' },
        token: 'mock-token'
      };
      
      jest.spyOn(authService, 'authenticate').mockResolvedValue(expectedResult);
      
      await controller.create(loginDto, res);
      
      expect(authService.authenticate).toHaveBeenCalledWith({ ...loginDto, res });
      expect(res.send).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('register', () => {
    it('deve registrar um novo usuário', () => {
      const registerDto: RegisterDto = { 
        email: 'teste@email.com', 
        password: 'senha123',
        name: 'Usuário Teste'
      };
      const expectedResult = { id: '1', email: 'teste@email.com' };
      
      jest.spyOn(authService, 'register').mockReturnValue(expectedResult as any);
      
      const result = controller.register(registerDto);
      
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshToken', () => {
    it('deve atualizar o token de acesso', async () => {
      const req = mockRequest();
      
      jest.spyOn(authService, 'refreshToken').mockResolvedValue({ token: 'novo-token' });
      
      const result = await controller.refreshToken(req);
      
      expect(authService.refreshToken).toHaveBeenCalledWith(req);
      expect(result).toEqual({ token: 'novo-token' });
    });

    it.skip('deve lançar UnauthorizedException quando o token é inválido', async () => {
      const req = mockRequest();
      
      jest.spyOn(authService, 'refreshToken').mockRejectedValue(new Error());
      
      await expect(controller.refreshToken(req)).rejects.toThrow('INVALID_REFRESH_TOKEN');
    });
  });

  describe('logout', () => {
    it.skip('deve fazer logout do usuário', async () => {
      const res = mockResponse();
      
      jest.spyOn(authService, 'logout').mockResolvedValue();
      
      await controller.logout(res);
      
      expect(authService.logout).toHaveBeenCalledWith(res);
      expect(res.send).toHaveBeenCalledWith();
    });
  });
});
