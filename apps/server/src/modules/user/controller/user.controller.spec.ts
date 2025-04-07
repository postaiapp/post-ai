import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Meta } from '@type/meta';
import { Response } from 'express';
import { UpdateUserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return res as Response;
  };

  const mockMeta: Meta = {
    userId: 'user123',
    email: 'test@example.com'
  };

  const mockUpdateUserDto: UpdateUserDto = {
    name: 'New Name',
    email: 'new@example.com'
  };

  const mockUser = {
    _id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    InstagramAccounts: [],
    __v: 0
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
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

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user successfully', async () => {
      const response = mockResponse();
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(controller, 'sendSuccess');

      await controller.findOne(response, mockMeta);

      expect(userService.findOne).toHaveBeenCalledWith({
        filter: { id: mockMeta.userId }
      });
      expect(controller.sendSuccess).toHaveBeenCalledWith({
        res: response,
        data: mockUser,
        status: HttpStatus.OK
      });
    });

    it('should handle errors when fetching a user', async () => {
      const response = mockResponse();
      const error = new Error('Error fetching user');
      jest.spyOn(userService, 'findOne').mockRejectedValue(error);
      jest.spyOn(controller, 'sendError');

      await controller.findOne(response, mockMeta);

      expect(userService.findOne).toHaveBeenCalledWith({
        filter: { id: mockMeta.userId }
      });
      expect(controller.sendError).toHaveBeenCalledWith({
        res: response,
        error
      });
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const response = mockResponse();
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser as any);
      jest.spyOn(controller, 'sendSuccess');

      await controller.update(mockMeta, mockUpdateUserDto, response);

      expect(userService.update).toHaveBeenCalledWith({
        filter: { id: mockMeta.userId },
        data: mockUpdateUserDto
      });
      expect(controller.sendSuccess).toHaveBeenCalledWith({
        res: response,
        data: updatedUser,
        status: HttpStatus.OK
      });
    });

    it('should handle errors when updating a user', async () => {
      const response = mockResponse();
      const error = new Error('Error updating user');
      jest.spyOn(userService, 'update').mockRejectedValue(error);
      jest.spyOn(controller, 'sendError');

      await controller.update(mockMeta, mockUpdateUserDto, response);

      expect(userService.update).toHaveBeenCalledWith({
        filter: { id: mockMeta.userId },
        data: mockUpdateUserDto
      });
      expect(controller.sendError).toHaveBeenCalledWith({
        res: response,
        error
      });
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const response = mockResponse();
      jest.spyOn(userService, 'remove').mockResolvedValue(mockUser as any);
      jest.spyOn(controller, 'sendSuccess');

      await controller.remove(response, mockMeta);

      expect(userService.remove).toHaveBeenCalledWith({
        filter: { id: mockMeta.userId }
      });
      expect(controller.sendSuccess).toHaveBeenCalledWith({
        res: response,
        data: mockUser,
        status: HttpStatus.OK
      });
    });

    it('should handle errors when removing a user', async () => {
      const response = mockResponse();
      const error = new Error('Error removing user');
      jest.spyOn(userService, 'remove').mockRejectedValue(error);
      jest.spyOn(controller, 'sendError');

      await controller.remove(response, mockMeta);

      expect(userService.remove).toHaveBeenCalledWith({
        filter: { id: mockMeta.userId }
      });
      expect(controller.sendError).toHaveBeenCalledWith({
        res: response,
        error
      });
    });
  });
});
