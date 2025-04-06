import { AuthGuard } from '@guards/auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { Meta } from '@type/meta';
import { CreatePostDto, GetAllPostsQueryDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { PostController } from './post.controller';

jest.mock('@guards/auth.guard', () => {
  return {
    AuthGuard: jest.fn().mockImplementation(() => ({
      canActivate: jest.fn().mockReturnValue(true),
    })),
  };
});

describe('PostController', () => {
    let controller: PostController;
    let postService: PostService;

    const mockPostService = {
        create: jest.fn(),
        cancelScheduledPost: jest.fn(),
        getUserPostsWithDetails: jest.fn(),
    };

    const mockMeta: Meta = {
        userId: 'user123',
        email: 'teste@teste.com',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostController],
            providers: [
                {
                    provide: PostService,
                    useValue: mockPostService,
                },
            ],
        })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: jest.fn().mockReturnValue(true) })
        .compile();

        controller = module.get<PostController>(PostController);
        postService = module.get<PostService>(PostService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call PostService create method with correct parameters', async () => {
            const createPostDto: CreatePostDto = {
                username: 'teste_instagram',
                caption: 'Teste de post',
                img: 'https://example.com/image.jpg',
                post_date: new Date(),
            };
            
            const expectedResult = {
                post_id: 'post123',
                scheduled_date: createPostDto.post_date,
            };
            
            mockPostService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createPostDto, mockMeta);

            expect(postService.create).toHaveBeenCalledWith({
                data: createPostDto,
                meta: mockMeta,
            });
            expect(result).toEqual(expectedResult);
        });

        it('should call PostService create method for immediate publishing', async () => {
            // Arrange
            const createPostDto: CreatePostDto = {
                username: 'teste_instagram',
                caption: 'Teste de post',
                img: 'https://example.com/image.jpg',
                post_date: null,
            };
            
            const expectedResult = {
                post: {
                    id: 'post123',
                    caption: 'Teste de post',
                    imageUrl: 'https://example.com/image.jpg',
                    publishedAt: new Date(),
                },
            };
            
            mockPostService.create.mockResolvedValue(expectedResult);

            // Act
            const result = await controller.create(createPostDto, mockMeta);

            // Assert
            expect(postService.create).toHaveBeenCalledWith({
                data: createPostDto,
                meta: mockMeta,
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('cancel', () => {
        it('should call PostService cancelScheduledPost method with correct parameters', async () => {
            // Arrange
            const postId = 'post123';
            mockPostService.cancelScheduledPost.mockResolvedValue(true);

            // Act
            const result = await controller.cancel(postId, mockMeta);

            // Assert
            expect(postService.cancelScheduledPost).toHaveBeenCalledWith({
                postId,
                userId: mockMeta.userId.toString(),
            });
            expect(result).toBe(true);
        });
    });

    describe('getUserPosts', () => {
        it('should call PostService getUserPostsWithDetails method with correct parameters', async () => {
            const query: GetAllPostsQueryDto = {
                page: 1,
                limit: 10,
            };
            
            const expectedResult = {
                success: true,
                data: [
                    {
                        _id: 'post123',
                        caption: 'Teste de post',
                        imageUrl: 'https://example.com/image.jpg',
                        publishedAt: new Date(),
                    },
                ],
                meta: {
                    total: 1,
                    page: 1,
                    limit: 10,
                },
            };
            
            mockPostService.getUserPostsWithDetails.mockResolvedValue(expectedResult);

            const result = await controller.getUserPosts(query, mockMeta);

            expect(postService.getUserPostsWithDetails).toHaveBeenCalledWith({
                query,
                meta: mockMeta,
            });
            expect(result).toEqual(expectedResult);
        });

        it('should call PostService getUserPostsWithDetails without pagination parameters', async () => {
            const query: GetAllPostsQueryDto = {
                page: 1,
                limit: 10,
            };
            
            const expectedResult = {
                success: true,
                data: [
                    {
                        _id: 'post123',
                        caption: 'Teste de post',
                        imageUrl: 'https://example.com/image.jpg',
                        publishedAt: new Date(),
                    },
                ],
                meta: {
                    total: 1,
                },
            };
            
            mockPostService.getUserPostsWithDetails.mockResolvedValue(expectedResult);

            const result = await controller.getUserPosts(query, mockMeta);

            expect(postService.getUserPostsWithDetails).toHaveBeenCalledWith({
                query,
                meta: mockMeta,
            });
            expect(result).toEqual(expectedResult);
        });
    });
});