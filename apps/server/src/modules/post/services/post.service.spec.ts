import { IMAGE_TEST_URL } from '@constants/post';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { Post } from '@schemas/post.schema';
import { User } from '@schemas/user.schema';
import { Uploader } from '@type/storage';
import { CronJob } from 'cron';
import * as dayjs from 'dayjs';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { get } from 'request-promise';
import { PostService } from './post.service';
jest.mock('request-promise');

describe('PostService', () => {
  let service: PostService;
  let userModel: Model<User>;
  let postModel: Model<Post>;
  let instagramAuthService: InstagramAuthService;
  let schedulerRegistry: SchedulerRegistry;
  let igApiClient: IgApiClient;
  let uploader: Uploader;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockPostModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockInstagramAuthService = {
    hasInstagramAccount: jest.fn(),
    restoreSession: jest.fn(),
  };

  const mockSchedulerRegistry = {
    addCronJob: jest.fn(),
    deleteCronJob: jest.fn(),
  };

  const mockIgApiClient = {
    publish: {
      photo: jest.fn(),
    },
    media: {
      info: jest.fn(),
    },
    insights: {
      post: jest.fn(),
    },
    feed: {
      mediaComments: jest.fn(),
    },
  };

  const mockMeta = {
    userId: 'user-id-1',
    email: 'test@example.com',
  };

  const mockUploader = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
        {
          provide: InstagramAuthService,
          useValue: mockInstagramAuthService,
        },
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
        {
          provide: IgApiClient,
          useValue: mockIgApiClient,
        },
        {
          provide: Uploader,
          useValue: mockUploader,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    postModel = module.get<Model<Post>>(getModelToken(Post.name));
    instagramAuthService = module.get<InstagramAuthService>(InstagramAuthService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
    igApiClient = module.get<IgApiClient>(IgApiClient);
    uploader = module.get<Uploader>(Uploader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call schedulePost when post_date is provided', async () => {
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: 'https://example.com/image.jpg',
        post_date: dayjs().add(1, 'day').toDate(),
      };

      const expectedResult = {
        scheduled_date: expect.any(Date),
        post_id: 'post-id-1',
      };

      jest.spyOn(service, 'schedulePost').mockResolvedValueOnce(expectedResult);

      const result = await service.create({ data, meta: mockMeta });

      expect(service.schedulePost).toHaveBeenCalledWith({ data, meta: mockMeta });
      expect(result).toEqual(expectedResult);
    });

    it('should call publishNow when post_date is not provided', async () => {
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: 'https://example.com/image.jpg',
        post_date: null,
      };

      const expectedResult = {
        post: {
          caption: 'Test caption',
          imageUrl: 'https://example.com/image.jpg',
          publishedAt: expect.any(Date),
          id: 'post-id-1',
        },
      };

      jest.spyOn(service, 'publishNow').mockResolvedValueOnce(expectedResult);

      const result = await service.create({ data, meta: mockMeta });

      expect(service.publishNow).toHaveBeenCalledWith({ data, meta: mockMeta });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('publishNow', () => {
    it('should publish a post immediately', async () => {
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: 'https://example.com/image.jpg',
        post_date: null,
      };

      const mockAccount = {
        InstagramAccounts: [
          {
            accountId: 'insta-123',
            session: { state: 'serialized-state', lastChecked: new Date(), isValid: true, lastRefreshed: new Date() },
            username: 'testuser',
          },
        ],
      };

      mockUserModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockAccount),
      });

      jest.spyOn(service, 'publishPhotoOnInstagram').mockResolvedValueOnce({
        id: 'media-id-1',
        code: 'media-code-1',
      });

      mockPostModel.create.mockResolvedValueOnce({
        _id: 'post-id-1',
        caption: 'Test caption',
        imageUrl: 'https://example.com/image.jpg',
        publishedAt: new Date(),
      });

      const result = await service.publishNow({ data, meta: mockMeta });

      expect(mockUserModel.findOne).toHaveBeenCalledWith(
        {
          _id: mockMeta.userId,
          'InstagramAccounts.username': 'testuser',
        },
        {
          _id: 0,
          InstagramAccounts: 1,
        }
      );

      expect(service.publishPhotoOnInstagram).toHaveBeenCalledWith(
        'Test caption',
        'testuser',
        mockAccount.InstagramAccounts[0].session,
        'https://example.com/image.jpg'
      );

      expect(mockPostModel.create).toHaveBeenCalledWith({
        code: 'media-code-1',
        postId: 'media-id-1',
        caption: 'Test caption',
        imageUrl: 'https://example.com/image.jpg',
        userId: mockMeta.userId,
        accountId: 'insta-123',
        canceledAt: null,
        publishedAt: expect.any(Date),
        scheduledAt: null,
      });

      expect(result).toEqual({
        post: {
          caption: 'Test caption',
          imageUrl: 'https://example.com/image.jpg',
          publishedAt: expect.any(Date),
          id: 'post-id-1',
        },
      });
    });

    it('should throw NotFoundException when user is not associated with the account', async () => {
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: 'https://example.com/image.jpg',
		post_date: null
      };

      mockUserModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.publishNow({ data, meta: mockMeta })).rejects.toThrow(
        new NotFoundException('USER_NOT_ASSOCIATED_WITH_THIS_ACCOUNT')
      );
    });

    it('should throw BadRequestException when publishing fails', async () => {
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: 'https://example.com/image.jpg',
        post_date: null,
      };

      const mockAccount = {
        InstagramAccounts: [
          {
            accountId: 'insta-123',
            session: { state: 'serialized-state', lastChecked: new Date(), isValid: true, lastRefreshed: new Date() },
            username: 'testuser',
          },
        ],
      };

      mockUserModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockAccount),
      });

      jest.spyOn(service, 'publishPhotoOnInstagram').mockResolvedValueOnce(false);

      await expect(service.publishNow({ data, meta: mockMeta })).rejects.toThrow(
        new BadRequestException('FAILED_PUBLISH_PHOTO')
      );
    });
  });

  describe('schedulePost', () => {
    it('should schedule a post for future publication', async () => {
      const futureDate = dayjs().add(1, 'day').toDate();
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: IMAGE_TEST_URL,
        post_date: futureDate,
      };

      const mockSession = {
        state: 'serialized-state',
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };

      mockInstagramAuthService.hasInstagramAccount.mockResolvedValueOnce({
        accountId: 'insta-123',
        session: mockSession,
      });

      mockInstagramAuthService.restoreSession.mockResolvedValueOnce(true);

      mockPostModel.create.mockResolvedValueOnce({
        _id: 'post-id-1',
        jobId: `post_testuser_${futureDate.getTime()}`,
      });

      jest.spyOn(service, 'scheduleCronJob').mockResolvedValueOnce(undefined);

      const result = await service.schedulePost({ data, meta: mockMeta });

      expect(mockInstagramAuthService.hasInstagramAccount).toHaveBeenCalledWith(mockMeta, 'testuser');
      expect(mockInstagramAuthService.restoreSession).toHaveBeenCalledWith('testuser', mockSession);

      expect(mockPostModel.create).toHaveBeenCalledWith(expect.objectContaining({
        caption: 'Test caption',
        imageUrl: IMAGE_TEST_URL,
        accountId: 'insta-123',
        userId: mockMeta.userId,
        canceledAt: null,
        publishedAt: null,
        jobId: `post_testuser_${futureDate.getTime()}`,
      }));

      expect(service.scheduleCronJob).toHaveBeenCalledWith(
        `post_testuser_${futureDate.getTime()}`,
        futureDate,
        {
          data,
          meta: mockMeta,
          id: 'post-id-1',
          session: mockSession,
        }
      );

      expect(result).toEqual({
        scheduled_date: futureDate,
        post_id: 'post-id-1',
      });
    });

    it('should throw BadRequestException when post_date is in the past', async () => {
      const pastDate = dayjs().subtract(1, 'day').toDate();
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: 'https://example.com/image.jpg',
        post_date: pastDate,
      };

      await expect(service.schedulePost({ data, meta: mockMeta })).rejects.toThrow(
        new BadRequestException('INVALID_POST_DATE')
      );
    });

    it('should throw NotFoundException when user is not associated with the account', async () => {
      const futureDate = dayjs().add(1, 'day').toDate();
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: 'https://example.com/image.jpg',
        post_date: futureDate,
      };

      mockInstagramAuthService.hasInstagramAccount.mockResolvedValueOnce(null);

      await expect(service.schedulePost({ data, meta: mockMeta })).rejects.toThrow(
        new NotFoundException('USER_NOT_ASSOCIATED_WITH_THIS_ACCOUNT')
      );
    });

    it('should throw TokenExpiredError when session restoration fails', async () => {
      const futureDate = dayjs().add(1, 'day').toDate();
      const data = {
        username: 'testuser',
        caption: 'Test caption',
        img: 'https://example.com/image.jpg',
        post_date: futureDate
      };

      const mockSession = {
        state: 'serialized-state',
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };

      mockInstagramAuthService.hasInstagramAccount.mockResolvedValueOnce({
        accountId: 'insta-123',
        session: mockSession,
      });

      mockInstagramAuthService.restoreSession.mockResolvedValueOnce(false);

      await expect(service.schedulePost({ data, meta: mockMeta })).rejects.toThrow('SESSION_REQUIRED');
    });
  });

  describe('publishPhotoOnInstagram', () => {
    it('should return false when session restoration fails', async () => {
      const caption = 'Test caption';
      const username = 'testuser';
      const img = 'https://example.com/image.jpg';
      const session = {
        state: 'serialized-state',
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };

      mockInstagramAuthService.restoreSession.mockResolvedValueOnce(false);

      const result = await service.publishPhotoOnInstagram(caption, username, session, img);

      expect(result).toBe(false);
    });

    it('should return false when an error occurs during publishing', async () => {
      const caption = 'Test caption';
      const username = 'testuser';
      const img = 'https://example.com/image.jpg';
      const session = {
        state: 'serialized-state',
        lastChecked: new Date(),
        isValid: true,
        lastRefreshed: new Date(),
      };

      mockInstagramAuthService.restoreSession.mockResolvedValueOnce(true);

      (get as jest.Mock).mockResolvedValueOnce(Buffer.from('image-data'));

      mockIgApiClient.publish.photo.mockRejectedValueOnce(new Error('Publishing failed'));

      const result = await service.publishPhotoOnInstagram(caption, username, session, img);

      expect(result).toBe(false);
    });
  });

  describe('cancelScheduledPost', () => {
    it('should cancel a scheduled post', async () => {
      const postId = 'post-id-1';
      const userId = 'user-id-1';
      const jobId = 'job-id-1';

      mockPostModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({
          _id: postId,
          jobId,
        }),
      });

      // Mock the Map.get method
      const mockMap = new Map();
      mockMap.set(jobId, new CronJob('* * * * *', () => {}));
      service['scheduledPosts'] = mockMap;

      const result = await service.cancelScheduledPost({ postId, userId });

      expect(mockPostModel.findOne).toHaveBeenCalledWith(
        {
          _id: postId,
          userId,
          scheduledAt: { $ne: null },
        },
        { jobId: 1 }
      );

      expect(mockPostModel.updateOne).toHaveBeenCalledWith(
        { _id: postId },
        {
          canceledAt: expect.any(Date),
          scheduledAt: null,
        }
      );

      expect(mockSchedulerRegistry.deleteCronJob).toHaveBeenCalledWith(jobId);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException when scheduled post is not found', async () => {
      const postId = 'post-id-1';
      const userId = 'user-id-1';

      mockPostModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.cancelScheduledPost({ postId, userId })).rejects.toThrow(
        new NotFoundException('SCHEDULED_POST_NOT_FOUND')
      );
    });

    it('should throw NotFoundException when scheduled job is not found', async () => {
      const postId = 'post-id-1';
      const userId = 'user-id-1';
      const jobId = 'job-id-1';

      mockPostModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({
          _id: postId,
          jobId,
        }),
      });

      // Mock empty Map
      service['scheduledPosts'] = new Map();

      await expect(service.cancelScheduledPost({ postId, userId })).rejects.toThrow(
        new NotFoundException('SCHEDULED_JOB_NOT_FOUND')
      );
    });
  });
});