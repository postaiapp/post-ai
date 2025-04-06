import { ImageGenerationService } from '@modules/image-generation/service/image-generation.service';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Chat } from '@schemas/chat.schema';
import { Model } from 'mongoose';
import { ChatsService } from './chats.service';

describe('ChatsService', () => {
  let service: ChatsService;
  let chatModel: Model<any>;
  let imageGenerationService: ImageGenerationService;

  const mockChat = {
    _id: 'chat-id-1',
    user_id: 'user-id-1',
    first_message: 'Olá',
    interactions: [],
    finished_at: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(true),
  };

  const mockChatModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  const mockImageGenerationService = {
    generateImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: getModelToken(Chat.name),
          useValue: mockChatModel,
        },
        {
          provide: ImageGenerationService,
          useValue: mockImageGenerationService,
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
    chatModel = module.get<Model<any>>(getModelToken(Chat.name));
    imageGenerationService = module.get<ImageGenerationService>(ImageGenerationService);

    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findChat', () => {
    it('should find a chat by id and user id', async () => {
      mockChatModel.findOne.mockResolvedValue(mockChat);
      
      const result = await service.findChat('chat-id-1', 'user-id-1');
      
      expect(mockChatModel.findOne).toHaveBeenCalledWith({
        _id: 'chat-id-1',
        user_id: 'user-id-1',
        finished_at: null,
      });
      expect(result).toEqual(mockChat);
    });
  });

  describe('findOrCreateChat', () => {
    it('should return existing chat if found', async () => {
      mockChatModel.findOne.mockResolvedValue(mockChat);
      
      const result = await service.findOrCreateChat({
        chatId: 'chat-id-1',
        userId: 'user-id-1',
        message: 'Olá',
      });
      
      expect(mockChatModel.findOne).toHaveBeenCalled();
      expect(mockChatModel.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockChat);
    });

    it('should create a new chat if not found', async () => {
      mockChatModel.findOne.mockResolvedValue(null);
      mockChatModel.create.mockResolvedValue(mockChat);
      
      const result = await service.findOrCreateChat({
        chatId: 'chat-id-1',
        userId: 'user-id-1',
        message: 'Olá',
      });
      
      expect(mockChatModel.findOne).toHaveBeenCalled();
      expect(mockChatModel.create).toHaveBeenCalledWith({
        user_id: 'user-id-1',
        finished_at: null,
        first_message: 'Olá',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result).toEqual(mockChat);
    });
  });

  describe('sendMessage', () => {
    it('should send a message and generate an image', async () => {
      const mockChat = {
        _id: 'chat-id-1',
        user_id: 'user-id-1',
        first_message: 'Olá',
        interactions: [],
        finished_at: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };
      
      mockChatModel.findOne.mockResolvedValue(mockChat);
      mockImageGenerationService.generateImage.mockResolvedValue({ url: 'image-url' });
      
      const result = await service.sendMessage({
        data: { chatId: 'chat-id-1', message: 'Gere uma imagem de um gato' },
        meta: { userId: 'user-id-1', email: 'user-email-1' },
      });
      
      expect(mockImageGenerationService.generateImage).toHaveBeenCalled();
      expect(mockChat.save).toHaveBeenCalled();
      expect(mockChat.interactions.length).toBe(1);
      expect(result).toEqual({
        chat: {
          userId: 'user-id-1',
          interactions: mockChat.interactions,
          firstMessage: 'Olá',
          id: 'chat-id-1',
          createdAt: expect.any(Date),
        },
        interaction: {
          request: 'Gere uma imagem de um gato',
          response: 'image-url',
          isRegenerated: false,
        },
      });
    });

    it('should throw BadRequestException if image generation fails', async () => {
      mockChatModel.findOne.mockResolvedValue(mockChat);
      mockImageGenerationService.generateImage.mockResolvedValue({ url: null });
      
      await expect(
        service.sendMessage({
          data: { chatId: 'chat-id-1', message: 'Gere uma imagem de um gato' },
          meta: { userId: 'user-id-1', email: 'user-email-1' },
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('regenerateMessage', () => {
    it('should regenerate a message and update the interaction', async () => {
      mockChatModel.findOne.mockResolvedValue(mockChat);
      mockImageGenerationService.generateImage.mockResolvedValue({ url: 'new-image-url' });
      mockChatModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
      
      const result = await service.regenerateMessage({
        data: { 
          chatId: 'chat-id-1', 
          message: 'Gere uma imagem de um gato', 
          interactionId: 'interaction-id-1' 
        },
        meta: { userId: 'user-id-1', email: 'user-email-1' },
      });
      
      expect(mockImageGenerationService.generateImage).toHaveBeenCalled();
      expect(mockChatModel.updateOne).toHaveBeenCalledWith(
        {
          _id: 'chat-id-1',
          'interactions._id': 'interaction-id-1',
        },
        {
          $set: expect.objectContaining({
            'interactions.$.user_id': 'user-id-1',
            'interactions.$.request': 'Gere uma imagem de um gato',
            'interactions.$.response': 'new-image-url',
            'interactions.$.is_regenerated': true,
          }),
        }
      );
    });
  });

  describe('listChatInteractions', () => {
    it('should list chat interactions sorted by creation time', async () => {
      const mockInteractions = [
        { createdAt: new Date('2023-01-02') },
        { createdAt: new Date('2023-01-01') },
      ];
      
      const mockChatWithInteractions = {
        ...mockChat,
        interactions: mockInteractions,
      };
      
      mockChatModel.findOne.mockResolvedValue(mockChatWithInteractions);
      
      const result = await service.listChatInteractions({
        params: { chatId: 'chat-id-1' },
        meta: { userId: 'user-id-1', email: 'user-email-1' },
      });
      
      expect(result[0].createdAt).toEqual(new Date('2023-01-01'));
      expect(result[1].createdAt).toEqual(new Date('2023-01-02'));
    });
  });

  describe('listUserChats', () => {
    it('should list user chats with pagination', async () => {
      const mockChats = [
        {
          _id: 'chat-id-1',
          user_id: 'user-id-1',
          interactions: [],
          first_message: 'Olá',
          createdAt: new Date(),
        },
      ];
      
      mockChatModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockChats),
      });
      
      mockChatModel.countDocuments.mockReturnValue({
        lean: jest.fn().mockResolvedValue(1),
      });
      
      const result = await service.listUserChats({
        userId: 'user-id-1',
        pagination: { page: 1, perPage: 10, offset: 0 },
      });
      
      expect(result.results.length).toBe(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });
});
