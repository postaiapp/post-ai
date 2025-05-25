import { Pagination } from '@common/dto/pagination.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import {
	CreateChatDto,
	GenerateCaptionParamsDto,
	ListChatInteractionsParamsDto,
	RegenerateMessageDto,
} from '../dto/chats.dto';
import { ChatsService } from '../services/chats.service';
import { ChatsController } from './chats.controller';

describe('ChatsController', () => {
	let controller: ChatsController;
	let service: ChatsService;

	const mockResponse = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis(),
	};

	const mockChatsService = {
		sendMessage: jest.fn(),
		regenerateMessage: jest.fn(),
		listChatInteractions: jest.fn(),
		listUserChats: jest.fn(),
		generateCaption: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ChatsController],
			providers: [
				{
					provide: ChatsService,
					useValue: mockChatsService,
				},
			],
		})
			.overrideGuard(AuthGuard)
			.useValue({ canActivate: jest.fn().mockReturnValue(true) })
			.compile();

		controller = module.get<ChatsController>(ChatsController);
		service = module.get<ChatsService>(ChatsService);

		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('sendMessage', () => {
		it('should send a message successfully', async () => {
			const createChatDto: CreateChatDto = {
				chatId: 'chat-id-1',
				message: 'Olá, como vai?',
			};

			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const serviceResponse = { chat: {}, interaction: {} };

			mockChatsService.sendMessage.mockResolvedValue(serviceResponse);

			await controller.sendMessage(createChatDto, mockResponse as any, meta);

			expect(service.sendMessage).toHaveBeenCalledWith({
				data: createChatDto,
				meta,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				data: serviceResponse,
				status: 'success',
			});
		});

		it('should handle errors when sending a message', async () => {
			const createChatDto: CreateChatDto = {
				chatId: 'chat-id-1',
				message: 'Olá, como vai?',
			};

			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const error = new Error('Falha ao enviar mensagem');

			mockChatsService.sendMessage.mockRejectedValue(error);

			await controller.sendMessage(createChatDto, mockResponse as any, meta);

			expect(service.sendMessage).toHaveBeenCalledWith({
				data: createChatDto,
				meta,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				code: '500',
				message: 'Falha ao enviar mensagem',
				status: 'error',
			});
		});
	});

	describe('regenerateMessage', () => {
		it('should regenerate a message successfully', async () => {
			const regenerateDto: RegenerateMessageDto = {
				chatId: 'chat-id-1',
				interactionId: 'interaction-id-1',
				message: 'Regenerar esta mensagem',
			};

			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const serviceResponse = { chat: {}, interaction: {} };

			mockChatsService.regenerateMessage.mockResolvedValue(serviceResponse);

			await controller.regenerateMessage(regenerateDto, meta, mockResponse as any);

			expect(service.regenerateMessage).toHaveBeenCalledWith({
				data: regenerateDto,
				meta,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				data: serviceResponse,
				status: 'success',
			});
		});

		it('should handle errors when regenerating a message', async () => {
			const regenerateDto: RegenerateMessageDto = {
				chatId: 'chat-id-1',
				interactionId: 'interaction-id-1',
				message: 'Regenerar esta mensagem',
			};

			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const error = new Error('Falha ao regenerar mensagem');

			mockChatsService.regenerateMessage.mockRejectedValue(error);

			await controller.regenerateMessage(regenerateDto, meta, mockResponse as any);

			expect(service.regenerateMessage).toHaveBeenCalledWith({
				data: regenerateDto,
				meta,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				code: '500',
				message: 'Falha ao regenerar mensagem',
				status: 'error',
			});
		});
	});

	describe('listChatInteractions', () => {
		it('should list chat interactions successfully', async () => {
			const params: ListChatInteractionsParamsDto = {
				chatId: 'chat-id-1',
			};

			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const serviceResponse = [{ request: 'Olá', response: 'Como vai?' }];

			mockChatsService.listChatInteractions.mockResolvedValue(serviceResponse);

			await controller.listChatInteractions(params, meta, mockResponse as any);

			expect(service.listChatInteractions).toHaveBeenCalledWith({
				params,
				meta,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				data: serviceResponse,
				status: 'success',
			});
		});

		it('should handle errors when listing chat interactions', async () => {
			const params: ListChatInteractionsParamsDto = {
				chatId: 'chat-id-1',
			};

			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const error = new Error('Falha ao listar interações');

			mockChatsService.listChatInteractions.mockRejectedValue(error);

			await controller.listChatInteractions(params, meta, mockResponse as any);

			expect(service.listChatInteractions).toHaveBeenCalledWith({
				params,
				meta,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				code: '500',
				message: 'Falha ao listar interações',
				status: 'error',
			});
		});
	});

	describe('listUserChats', () => {
		it('should list user chats successfully', async () => {
			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const pagination: Pagination = { page: 1, perPage: 10, offset: 0 };
			const serviceResponse = {
				results: [{ id: 'chat-id-1', firstMessage: 'Olá' }],
				meta: { total: 1, page: 1, limit: 10 },
			};

			mockChatsService.listUserChats.mockResolvedValue(serviceResponse);

			await controller.listUserChats(meta, pagination, mockResponse as any);

			expect(service.listUserChats).toHaveBeenCalledWith({
				userId: meta.userId.toString(),
				pagination,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				data: serviceResponse,
				status: 'success',
			});
		});

		it('should handle errors when listing user chats', async () => {
			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const pagination: Pagination = { page: 1, perPage: 10, offset: 0 };
			const error = new Error('Falha ao listar chats');

			mockChatsService.listUserChats.mockRejectedValue(error);

			await controller.listUserChats(meta, pagination, mockResponse as any);

			expect(service.listUserChats).toHaveBeenCalledWith({
				userId: meta.userId.toString(),
				pagination,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				code: '500',
				message: 'Falha ao listar chats',
				status: 'error',
			});
		});
	});

	describe('generateCaption', () => {
		it('should generate a caption successfully', async () => {
			const params: GenerateCaptionParamsDto = {
				chatId: 'chat-id-1',
			};

			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const serviceResponse = { caption: 'Uma legenda gerada para sua imagem' };

			mockChatsService.generateCaption.mockResolvedValue(serviceResponse);

			await controller.generateCaption(params, meta, mockResponse as any);

			expect(service.generateCaption).toHaveBeenCalledWith({
				filter: params,
				meta,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				data: serviceResponse,
				status: 'success',
			});
		});

		it('should handle errors when generating a caption', async () => {
			const params: GenerateCaptionParamsDto = {
				chatId: 'chat-id-1',
			};

			const meta = { userId: 'user-id-1', email: 'user@example.com' };
			const error = new Error('Falha ao gerar legenda');

			mockChatsService.generateCaption.mockRejectedValue(error);

			await controller.generateCaption(params, meta, mockResponse as any);

			expect(service.generateCaption).toHaveBeenCalledWith({
				filter: params,
				meta,
			});
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				code: '500',
				message: 'Falha ao gerar legenda',
				status: 'error',
			});
		});
	});
});
