// import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
// import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { TokenExpiredError } from '@nestjs/jwt';
// import { getModelToken } from '@nestjs/mongoose';
// import { SchedulerRegistry } from '@nestjs/schedule';
// import { Test, TestingModule } from '@nestjs/testing';
// import { Post } from '@schemas/post.schema';
// import { User } from '@schemas/user.schema';
// import { CronJob } from 'cron';
// import * as dayjs from 'dayjs';
// import { IgApiClient } from 'instagram-private-api';
// import { PostService } from './post.service';

// // Mock for request-promise
// jest.mock('request-promise', () => ({
//   get: jest.fn().mockResolvedValue(Buffer.from('test_image')),
// }));

// describe('PostService', () => {
//   let service: PostService;
//   let userModel: any;
//   let postModel: any;
//   let igClient: any;
//   let instagramAuthService: any;
//   let schedulerRegistry: any;

//   const mockUser = {
//     _id: 'user123',
//     InstagramAccounts: [
//       {
//         username: 'test_instagram',
//         accountId: 'account123',
//         session: { 
//           cookies: 'cookies', 
//           state: "state",
//           isValid: true,
//           lastChecked: new Date(),
//           lastRefreshed: new Date()
//         },
//         profilePicUrl: 'https://example.com/profile.jpg',
//         fullName: 'Test Instagram',
//         isPrivate: false,
//         isVerified: false
//       }
//     ]
//   };

//   const mockPost = {
//     _id: 'post123',
//     caption: 'Test post',
//     imageUrl: 'https://example.com/image.jpg',
//     userId: 'user123',
//     accountId: 'account123',
//     publishedAt: null,
//     scheduledAt: dayjs().add(1, 'day').toDate(),
//     canceledAt: null,
//     jobId: 'job123',
//     toObject: () => mockPost,
	
//   };

//   beforeEach(async () => {
//     userModel = {
//       findOne: jest.fn(),
//       lean: jest.fn().mockReturnThis(),
//       then: jest.fn(),
//     };

//     postModel = {
//       create: jest.fn(),
//       findOne: jest.fn(),
//       findOneAndUpdate: jest.fn(),
//       updateOne: jest.fn(),
//       countDocuments: jest.fn(),
//       aggregate: jest.fn(),
//       lean: jest.fn().mockReturnThis(),
//     };

//     igClient = {
//       publish: {
//         photo: jest.fn(),
//       },
//       media: {
//         info: jest.fn(),
//       },
//       insights: {
//         post: jest.fn(),
//       },
//       feed: {
//         mediaComments: jest.fn().mockReturnValue({
//           items: jest.fn(),
//         }),
//       },
//     };

//     instagramAuthService = {
//       hasInstagramAccount: jest.fn(),
//       restoreSession: jest.fn(),
//     };

//     schedulerRegistry = {
//       addCronJob: jest.fn(),
//       deleteCronJob: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         PostService,
//         {
//           provide: getModelToken(User.name),
//           useValue: userModel,
//         },
//         {
//           provide: getModelToken(Post.name),
//           useValue: postModel,
//         },
//         {
//           provide: IgApiClient,
//           useValue: igClient,
//         },
//         {
//           provide: InstagramAuthService,
//           useValue: instagramAuthService,
//         },
//         {
//           provide: SchedulerRegistry,
//           useValue: schedulerRegistry,
//         },
//       ],
//     }).compile();

//     service = module.get<PostService>(PostService);
//     // Spy on cleanupJob method to avoid errors
//     jest.spyOn(service as any, 'cleanupJob').mockImplementation(() => {});
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe.skip('create', () => {
//     it('should call schedulePost when post_date is provided', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Test',
//         post_date: dayjs().add(1, 'day').toDate(),
//         img: 'https://example.com/image.jpg',
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };
      
//       const scheduleSpy = jest.spyOn(service, 'schedulePost')
//         .mockImplementation(async () => ({
//           scheduled_date: data.post_date,
//           post_id: 'post123',
//         }));

//       await service.create({ data, meta });
      
//       expect(scheduleSpy).toHaveBeenCalledWith({ data, meta });
//     });

//     it('should call publishNow when post_date is not provided', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Test',
//         img: 'https://example.com/image.jpg',
//         post_date: null,
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };
      
//       const publishSpy = jest.spyOn(service, 'publishNow')
//         .mockImplementation(async () => ({
//           post: {
//             caption: 'Test',
//             imageUrl: 'https://example.com/image.jpg',
//             publishedAt: new Date(),
//             id: 'post123',
//           },
//         }));

//       await service.create({ data, meta });
      
//       expect(publishSpy).toHaveBeenCalledWith({ data, meta });
//     });
//   });

//   describe.skip('publishNow', () => {
//     it('should publish a post immediately', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Test',
//         img: 'https://example.com/image.jpg',
//         post_date: null,
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };

//       userModel.findOne.mockReturnValue({
//         lean: jest.fn().mockReturnValue({
//           then: jest.fn().mockResolvedValue({
//             InstagramAccounts: [mockUser.InstagramAccounts[0]],
//           }),
//         }),
//       });

//       jest.spyOn(service, 'publishPhotoOnInstagram').mockResolvedValue({
//         id: 'instagram123',
//         code: 'ABC123',
//       });

//       postModel.create.mockResolvedValue({
//         _id: { toString: () => 'post123' },
//         caption: 'Test',
//         imageUrl: 'https://example.com/image.jpg',
//         publishedAt: new Date(),
//       });

//       const result = await service.publishNow({ data, meta });

//       expect(service.publishPhotoOnInstagram).toHaveBeenCalled();
//       expect(postModel.create).toHaveBeenCalled();
//       expect(result).toHaveProperty('post');
//       expect(result.post).toHaveProperty('id', 'post123');
//     });

//     it('should throw error when user is not associated with the account', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Test',
//         img: 'https://example.com/image.jpg',
//         post_date: null,
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };

//       userModel.findOne.mockReturnValue({
//         lean: jest.fn().mockReturnValue({
//           then: jest.fn().mockResolvedValue(null),
//         }),
//       });

//       await expect(service.publishNow({ data, meta })).rejects.toThrow(NotFoundException);
//     });

//     it('should throw error when publication fails', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Test',
//         img: 'https://example.com/image.jpg',
//         post_date: null,
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };

//       userModel.findOne.mockReturnValue({
//         lean: jest.fn().mockReturnValue({
//           then: jest.fn().mockResolvedValue({
//             InstagramAccounts: [mockUser.InstagramAccounts[0]],
//           }),
//         }),
//       });

//       jest.spyOn(service, 'publishPhotoOnInstagram').mockResolvedValue(false);

//       await expect(service.publishNow({ data, meta })).rejects.toThrow(BadRequestException);
//     });
//   });

//   describe.skip('schedulePost', () => {
//     it('should schedule a post for future publication', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Scheduled test',
//         post_date: dayjs().add(1, 'day').toDate(),
//         img: 'https://example.com/image.jpg',
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };

//       instagramAuthService.hasInstagramAccount.mockResolvedValue(mockUser.InstagramAccounts[0]);
//       instagramAuthService.restoreSession.mockResolvedValue(true);
//       postModel.create.mockResolvedValue({
//         _id: { toString: () => 'post123' },
//       });

//       jest.spyOn(service, 'scheduleCronJob').mockResolvedValue(undefined);

//       const result = await service.schedulePost({ data, meta });

//       expect(instagramAuthService.hasInstagramAccount).toHaveBeenCalled();
//       expect(instagramAuthService.restoreSession).toHaveBeenCalled();
//       expect(postModel.create).toHaveBeenCalled();
//       expect(service.scheduleCronJob).toHaveBeenCalled();
//       expect(result).toHaveProperty('post_id', 'post123');
//     });

//     it('should throw error when publication date is invalid', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Scheduled test',
//         post_date: dayjs().subtract(1, 'day').toDate(),
//         img: 'https://example.com/image.jpg',
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };

//       await expect(service.schedulePost({ data, meta })).rejects.toThrow(BadRequestException);
//     });

//     it('should throw error when user is not associated with the account', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Scheduled test',
//         post_date: dayjs().add(1, 'day').toDate(),
//         img: 'https://example.com/image.jpg',
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };

//       instagramAuthService.hasInstagramAccount.mockResolvedValue(null);

//       await expect(service.schedulePost({ data, meta })).rejects.toThrow(NotFoundException);
//     });

//     it('should throw error when session cannot be restored', async () => {
//       const data = {
//         username: 'test_instagram',
//         caption: 'Scheduled test',
//         post_date: dayjs().add(1, 'day').toDate(),
//         img: 'https://example.com/image.jpg',
//       };
//       const meta = { userId: 'user123', email: 'test@test.com' };

//       instagramAuthService.hasInstagramAccount.mockResolvedValue(mockUser.InstagramAccounts[0]);
//       instagramAuthService.restoreSession.mockResolvedValue(false);

//       await expect(service.schedulePost({ data, meta })).rejects.toThrow(TokenExpiredError);
//     });
//   });

//   describe.skip('publishPhotoOnInstagram', () => {
//     it('should publish a photo on Instagram successfully', async () => {
//       const caption = 'Photo test';
//       const username = 'test_instagram';
//       const session = mockUser.InstagramAccounts[0].session;
//       const img = 'https://example.com/image.jpg';

//       instagramAuthService.restoreSession.mockResolvedValue(true);
//       igClient.publish.photo.mockResolvedValue({
//         media: {
//           id: 'instagram123',
//           code: 'ABC123',
//         },
//       });

//       const result = await service.publishPhotoOnInstagram(caption, username, session, img);

//       expect(instagramAuthService.restoreSession).toHaveBeenCalledWith(username, session);
//       expect(igClient.publish.photo).toHaveBeenCalled();
//       expect(result).toEqual({
//         id: 'instagram123',
//         code: 'ABC123',
//       });
//     });

//     it('should return false when publication fails', async () => {
//       const caption = 'Photo test';
//       const username = 'test_instagram';
//       const session = mockUser.InstagramAccounts[0].session;
//       const img = 'https://example.com/image.jpg';

//       instagramAuthService.restoreSession.mockResolvedValue(true);
//       igClient.publish.photo.mockRejectedValue(new Error('Publication failed'));

//       const result = await service.publishPhotoOnInstagram(caption, username, session, img);

//       expect(result).toBe(false);
//     });

//     it('should throw error when session cannot be restored', async () => {
//       const caption = 'Photo test';
//       const username = 'test_instagram';
//       const session = mockUser.InstagramAccounts[0].session;
//       const img = 'https://example.com/image.jpg';

//       instagramAuthService.restoreSession.mockResolvedValue(false);

//       await expect(service.publishPhotoOnInstagram(caption, username, session, img)).resolves.toBe(false);
//     });
//   });

//   describe.skip('cancelScheduledPost', () => {
//     it('should cancel a scheduled post', async () => {
//       const postId = 'post123';
//       const userId = 'user123';

//       postModel.findOne.mockReturnValue({
//         lean: jest.fn().mockReturnValue(mockPost),
//       });

//       // Configure Map to have the job
//       service['scheduledPosts'] = new Map();
//       service['scheduledPosts'].set(mockPost.jobId, new CronJob('* * * * *', () => {}));

//       const result = await service.cancelScheduledPost({ postId, userId });

//       expect(postModel.findOne).toHaveBeenCalled();
//       expect(postModel.updateOne).toHaveBeenCalled();
//       expect(result).toBe(true);
//     });

//     it('should throw error when scheduled post is not found', async () => {
//       const postId = 'post123';
//       const userId = 'user123';

//       postModel.findOne.mockReturnValue({
//         lean: jest.fn().mockReturnValue(null),
//       });

//       await expect(service.cancelScheduledPost({ postId, userId })).rejects.toThrow(NotFoundException);
//     });

//     it('should throw error when scheduled job is not found', async () => {
//       const postId = 'post123';
//       const userId = 'user123';

//       postModel.findOne.mockReturnValue({
//         lean: jest.fn().mockReturnValue(mockPost),
//       });

//       // Empty Map, without the job
//       service['scheduledPosts'] = new Map();

//       await expect(service.cancelScheduledPost({ postId, userId })).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe.skip('getInstagramPostInfo', () => {
//     it('should get information from an Instagram post', async () => {
//       const postId = 'instagram123';
//       const username = 'test_instagram';
//       const session = mockUser.InstagramAccounts[0].session;

//       instagramAuthService.restoreSession.mockResolvedValue(true);
      
//       igClient.media.info.mockResolvedValue({
//         items: [{
//           code: 'ABC123',
//           caption: { text: 'Test post' },
//           has_liked: true,
//           comment_count: 10
//         }]
//       });
      
//       igClient.insights.post.mockResolvedValue({
//         data: {
//           media: {
//             like_count: 50,
//             comment_count: 10
//           }
//         }
//       });
      
//       igClient.feed.mediaComments().items.mockResolvedValue([
//         {
//           text: 'Test comment',
//           user: {
//             username: 'commenter',
//             profile_pic_url: 'https://example.com/profile.jpg',
//             is_verified: true
//           },
//           created_at: Date.now() / 1000,
//           comment_like_count: 5,
//           child_comment_count: 2
//         }
//       ]);

//       const result = await service.getInstagramPostInfo(postId, username, session);

//       expect(instagramAuthService.restoreSession).toHaveBeenCalledWith(username, session);
//       expect(igClient.media.info).toHaveBeenCalledWith(postId);
//       expect(igClient.insights.post).toHaveBeenCalledWith(postId);
//       expect(igClient.feed.mediaComments).toHaveBeenCalledWith(postId);
//       expect(result).toHaveProperty('code', 'ABC123');
//       expect(result).toHaveProperty('engagement');
//       expect(result).toHaveProperty('comments');
//     });

//     it('should throw error when failing to get post information', async () => {
//       const postId = 'instagram123';
//       const username = 'test_instagram';
//       const session = mockUser.InstagramAccounts[0].session;

//       instagramAuthService.restoreSession.mockResolvedValue(true);
//       igClient.media.info.mockRejectedValue(new Error('Failed to get information'));

//       await expect(service.getInstagramPostInfo(postId, username, session)).rejects.toThrow(BadRequestException);
//     });
//   });

//   describe.skip('getUserPostsWithDetails', () => {
//     it('should get user posts with details', async () => {
//       const query = { page: 1, limit: 10 };
//       const meta = { userId: 'user123', email: 'test@test.com' };

//       userModel.findOne.mockResolvedValue({
//         InstagramAccounts: [{ accountId: 'account123' }]
//       });

//       postModel.aggregate.mockResolvedValue([
//         {
//           _id: 'post123',
//           caption: 'Test post',
//           imageUrl: 'https://example.com/image.jpg',
//           postId: 'instagram123',
//           account: {
//             username: 'test_instagram',
//             session: mockUser.InstagramAccounts[0].session
//           }
//         }
//       ]);

//       postModel.countDocuments.mockResolvedValue(1);

//       jest.spyOn(service, 'getInstagramPostInfo').mockResolvedValue({
//         code: 'ABC123',
//         caption: 'Test post',
//         engagement: {
//           hasLiked: true,
//           likes: 50,
//           comments: 10
//         },
//         comments: {
//           recent: [],
//           has_more: false
//         }
//       });

//       const result = await service.getUserPostsWithDetails({ query, meta });

//       expect(userModel.findOne).toHaveBeenCalled();
//       expect(postModel.aggregate).toHaveBeenCalled();
//       expect(postModel.countDocuments).toHaveBeenCalled();
//       expect(service.getInstagramPostInfo).toHaveBeenCalled();
//       expect(result).toHaveProperty('success', true);
//       expect(result).toHaveProperty('data');
//       expect(result).toHaveProperty('meta');
//     });
//   });
// });