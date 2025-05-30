import { Pagination } from '@common/dto/pagination.dto';
import { EmailService } from '@common/providers/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { PostController } from './post.controller';

describe('PostController', () => {
	let controller: PostController;
	let service: PostService;

	const mockPostService = {
		create: jest.fn(),
		cancelScheduledPost: jest.fn(),
		getUserPostsWithDetails: jest.fn(),
	};

	const mockEmailService = {
		send: jest.fn().mockResolvedValue(true),
		sendEmail: jest.fn(),
		sendPostPublishedEmail: jest.fn(),
	};

	const mockMeta = {
		userId: '507f1f77bcf86cd799439011',
		email: 'test@example.com',
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PostController],
			providers: [
				{
					provide: PostService,
					useValue: mockPostService,
				},
				{
					provide: EmailService,
					useValue: mockEmailService,
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

		controller = module.get<PostController>(PostController);
		service = module.get<PostService>(PostService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('create', () => {
		it('should call the service to create a post', async () => {
			const createPostDto: CreatePostDto = {
				username: 'instagramuser',
				caption: 'My awesome post! 🌟',
				img: 'https://example.com/image.jpg',
				post_date: new Date('2024-03-20T10:00:00Z'),
			};

			const expectedResult = { id: '123', ...createPostDto };
			mockPostService.create.mockResolvedValue(expectedResult);

			const result = await controller.create(createPostDto, mockMeta);

			expect(service.create).toHaveBeenCalledWith({
				data: createPostDto,
				meta: mockMeta,
			});
			expect(result).toEqual(expectedResult);
		});
	});

	describe('cancel', () => {
		it('should call the service to cancel a scheduled post', async () => {
			const postId = '507f1f77bcf86cd799439011';
			const expectedResult = { success: true, message: 'Post canceled successfully' };

			mockPostService.cancelScheduledPost.mockResolvedValue(expectedResult);

			const result = await controller.cancel(postId, mockMeta);

			expect(service.cancelScheduledPost).toHaveBeenCalledWith({
				postId,
				userId: mockMeta.userId.toString(),
			});
			expect(result).toEqual(expectedResult);
		});
	});

	describe('getUserPosts', () => {
		it('should call the service to get user posts', async () => {
			const pagination: Pagination = { page: 1, perPage: 10, offset: 0 };
			const expectedResult = {
				data: [
					{
						id: '123',
						username: 'instagramuser',
						email: 'test@example.com',
						caption: 'My awesome post! 🌟',
						img: 'https://example.com/image.jpg',
						post_date: new Date('2024-03-20T10:00:00Z'),
					},
				],
				meta: {
					total: 1,
					page: 1,
					perPage: 10,
				},
			};

			mockPostService.getUserPostsWithDetails.mockResolvedValue(expectedResult);

			const result = await controller.getUserPosts(pagination, mockMeta);

			expect(service.getUserPostsWithDetails).toHaveBeenCalledWith({
				pagination,
				meta: mockMeta,
			});
			expect(result).toEqual(expectedResult);
		});
	});
});
