import { ImageGenerationService } from '@modules/image-generation/service/image-generation.service';
import { TextGenerationService } from '@modules/text-generation/service/text-generation.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Chat } from '@schemas/chat.schema';
import { Interaction } from '@schemas/interaction.schema';
import { Uploader } from '@type/storage';
import FileUtils from '@utils/file';
import { Model } from 'mongoose';
import { ChatsService } from './chats.service';

describe('ChatsService', () => {
  let service: ChatsService;
  let chatModel: Model<any>;
  let imageGenerationService: ImageGenerationService;
  let textGenerationService: TextGenerationService;
  let storageService: any;

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

  const mockTextGenerationService = {
    generateText: jest.fn(),
  };

  const mockStorageService = {
    getSignedImageUrl: jest.fn().mockImplementation((url) => Promise.resolve(`signed-${url}`)),
  };

  beforeEach(async () => {
    jest.spyOn(FileUtils, 'getUnsignedUrl').mockImplementation((url) => `unsigned-${url}`);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Chat.name),
          useValue: mockChatModel,
        },
        {
          provide: ImageGenerationService,
          useValue: mockImageGenerationService,
        },
        {
          provide: TextGenerationService,
          useValue: mockTextGenerationService,
        },
        {
          provide: Uploader,
          useValue: mockStorageService,
        },
        {
          provide: ChatsService,
          useFactory: (
            chatModel: Model<any>,
            imageGenerationService: ImageGenerationService,
            textGenerationService: TextGenerationService,
            storageService: any
          ) => {
            return new ChatsService(
              chatModel,
              imageGenerationService,
              textGenerationService,
              storageService
            );
          },
          inject: [
            getModelToken(Chat.name),
            ImageGenerationService,
            TextGenerationService,
            Uploader,
          ],
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
    chatModel = module.get<Model<any>>(getModelToken(Chat.name));
    imageGenerationService = module.get<ImageGenerationService>(ImageGenerationService);
    textGenerationService = module.get<TextGenerationService>(TextGenerationService);
    storageService = module.get(Uploader);

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
      const mockChatWithInteractions = {
        ...mockChat,
        interactions: [],
        save: jest.fn().mockResolvedValue(true),
      };
      
      mockChatModel.findOne.mockResolvedValue(mockChatWithInteractions);
      mockImageGenerationService.generateImage.mockResolvedValue({ url: 'generated-image-url' });
      
      const result = await service.sendMessage({
        data: { chatId: 'chat-id-1', message: 'Gere uma imagem de um gato' },
        meta: { userId: 'user-id-1', email: 'user-email-1' },
      });
      
      expect(mockImageGenerationService.generateImage).toHaveBeenCalledWith({
        prompt: expect.stringContaining('Gere uma imagem de um gato'),
      });
      expect(FileUtils.getUnsignedUrl).toHaveBeenCalledWith('generated-image-url');
      expect(mockChatWithInteractions.save).toHaveBeenCalled();
      expect(mockChatWithInteractions.interactions.length).toBe(1);
      expect(mockChatWithInteractions.interactions[0]).toEqual(expect.objectContaining({
        user_id: 'user-id-1',
        request: 'Gere uma imagem de um gato',
        response: 'unsigned-generated-image-url',
        is_regenerated: false,
      }));
      expect(result).toEqual({
        chat: expect.objectContaining({
          userId: 'user-id-1',
          id: 'chat-id-1',
        }),
        interaction: expect.objectContaining({
          request: 'Gere uma imagem de um gato',
          response: 'signed-generated-image-url',
          isRegenerated: false,
        }),
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
      
      expect(mockImageGenerationService.generateImage).toHaveBeenCalled();
      expect(mockChat.save).not.toHaveBeenCalled();
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
      expect(FileUtils.getUnsignedUrl).toHaveBeenCalledWith('new-image-url');
      expect(mockChatModel.updateOne).toHaveBeenCalledWith(
        {
          _id: 'chat-id-1',
          'interactions._id': 'interaction-id-1',
        },
        {
          $set: expect.objectContaining({
            'interactions.$.user_id': 'user-id-1',
            'interactions.$.request': 'Gere uma imagem de um gato',
            'interactions.$.response': 'unsigned-new-image-url',
            'interactions.$.is_regenerated': true,
          }),
        }
      );
      expect(result).toEqual({
        chat: expect.objectContaining({
          userId: 'user-id-1',
          id: 'chat-id-1',
        }),
        interaction: expect.objectContaining({
          request: 'Gere uma imagem de um gato',
          response: 'unsigned-new-image-url',
          isRegenerated: true,
        }),
      });
    });

    it('should throw BadRequestException if image regeneration fails', async () => {
      mockChatModel.findOne.mockResolvedValue(mockChat);
      mockImageGenerationService.generateImage.mockResolvedValue({ url: null });
      
      await expect(
        service.regenerateMessage({
          data: { 
            chatId: 'chat-id-1', 
            message: 'Gere uma imagem de um gato', 
            interactionId: 'interaction-id-1' 
          },
          meta: { userId: 'user-id-1', email: 'user-email-1' },
        })
      ).rejects.toThrow(BadRequestException);
      
      expect(mockImageGenerationService.generateImage).toHaveBeenCalled();
      expect(mockChatModel.updateOne).not.toHaveBeenCalled();
    });
  });

  describe('getChatContext', () => {
    it('should return formatted context from interactions', async () => {
      const mockInteractions: Interaction[] = [
        { 
          user_id: 'user-id-1', 
          request: 'Pergunta 1', 
          response: 'Resposta 1', 
          is_regenerated: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          user_id: 'user-id-1', 
          request: 'Pergunta 2', 
          response: 'Resposta 2', 
          is_regenerated: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      
      const result = await service.getChatContext(mockInteractions);
      
      expect(result).toBe('Request: Pergunta 1 | Response: Resposta 1\nRequest: Pergunta 2 | Response: Resposta 2');
    });

    it('should limit context to last 10 interactions', async () => {
      const mockInteractions: Interaction[] = Array.from({ length: 15 }, (_, i) => ({
        user_id: 'user-id-1',
        request: `Pergunta ${i + 1}`,
        response: `Resposta ${i + 1}`,
        is_regenerated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      const result = await service.getChatContext(mockInteractions);
      const lines = result.split('\n');
      
      expect(lines.length).toBe(10);
      expect(lines[0]).toBe('Request: Pergunta 6 | Response: Resposta 6');
      expect(lines[9]).toBe('Request: Pergunta 15 | Response: Resposta 15');
    });
  });

  describe('listChatInteractions', () => {
    it('should list chat interactions sorted by creation time', async () => {
      const mockInteractions = [
        { 
          _id: 'interaction-2', 
          user_id: 'user-id-1',
          request: 'request-2',
          response: 'image-url-2', 
          is_regenerated: false,
          createdAt: new Date('2023-01-02'), 
          updatedAt: new Date()
        },
        { 
          _id: 'interaction-1', 
          user_id: 'user-id-1',
          request: 'request-1',
          response: 'image-url-1', 
          is_regenerated: false,
          createdAt: new Date('2023-01-01'), 
          updatedAt: new Date()
        },
      ];
      
      const mockChatWithInteractions = {
        ...mockChat,
        interactions: mockInteractions,
      };
      
      mockChatModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockChatWithInteractions),
      });
      
      const result = await service.listChatInteractions({
        params: { chatId: 'chat-id-1' },
        meta: { userId: 'user-id-1', email: 'user-email-1' },
      });
      
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('_id', 'interaction-1');
      expect(result[1]).toHaveProperty('_id', 'interaction-2');
      expect(result[0].response).toBe('signed-image-url-1');
      expect(result[1].response).toBe('signed-image-url-2');
    });

    it('should throw NotFoundException if chat not found', async () => {
      mockChatModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      
      await expect(
        service.listChatInteractions({
          params: { chatId: 'non-existent-chat' },
          meta: { userId: 'user-id-1', email: 'user-email-1' },
        })
      ).rejects.toThrow(NotFoundException);
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
        {
          _id: 'chat-id-2',
          user_id: 'user-id-1',
          interactions: [],
          first_message: 'Como vai?',
          createdAt: new Date(),
        },
      ];
      
      mockChatModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockChats),
      });
      
      mockChatModel.countDocuments.mockResolvedValue(2);
      
      const result = await service.listUserChats({
        userId: 'user-id-1',
        pagination: { page: 1, perPage: 10, offset: 0 },
      });
      
      expect(result.results.length).toBe(2);
      expect(result.results[0].id).toBe('chat-id-1');
      expect(result.results[1].id).toBe('chat-id-2');
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('generateCaption', () => {
    it('should generate a caption based on chat context', async () => {
      mockChatModel.findOne.mockResolvedValue(mockChat);
      mockTextGenerationService.generateText.mockResolvedValue({ text: 'Uma legenda gerada' });
      
      const result = await service.generateCaption({
        filter: { chatId: 'chat-id-1' },
        meta: { userId: 'user-id-1', email: 'user-email-1' },
      });
      
      expect(mockTextGenerationService.generateText).toHaveBeenCalledWith({
        prompt: expect.any(String),
      });
      expect(result).toEqual({
        caption: 'Uma legenda gerada',
      });
    });

    it('should throw NotFoundException if chat not found', async () => {
      mockChatModel.findOne.mockResolvedValue(null);
      
      await expect(
        service.generateCaption({
          filter: { chatId: 'non-existent-chat' },
          meta: { userId: 'user-id-1', email: 'user-email-1' },
        })
      ).rejects.toThrow(NotFoundException);
      
      expect(mockTextGenerationService.generateText).not.toHaveBeenCalled();
    });
  });
});
