import { EmailService } from '@common/providers/email.service';
import { TIME_ZONE } from '@constants/post';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Post } from '@schemas/post.schema';
import { Session } from '@schemas/token';
import { User } from '@schemas/user.schema';
import { DefaultPostBodyCreate, GetUserPostsProps, PublishedPostProps, VerifyPostPublishProps } from '@type/post';
import { Uploader } from '@type/storage';
import { getHtmlPath } from '@utils/email';
import { CronJob } from 'cron';
import * as dayjs from 'dayjs';
import { IgApiClient } from 'instagram-private-api';
import { isEmpty, map, omit } from 'lodash';
import { Model } from 'mongoose';
import { get } from 'request-promise';

@Injectable()
export class PostService {
	private scheduledPosts: Map<string, CronJob> = new Map();
	private readonly logger = new Logger(PostService.name);

	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Post.name) private readonly postModel: Model<Post>,
		private readonly emailService: EmailService,
		private readonly ig: IgApiClient,
		private readonly instagramAuthService: InstagramAuthService,
		private schedulerRegistry: SchedulerRegistry,
		@Inject(Uploader) private readonly storageService: Uploader
	) {}

	async create({ data, meta }: DefaultPostBodyCreate) {
		const { post_date } = data;

		if (post_date) {
			return this.schedulePost({ data, meta });
		}

		return this.publishNow({ data, meta });
	}

	async verifyPostPublish({ postId, caption, username, session, img }: VerifyPostPublishProps) {
		const published = await this.publishPhotoOnInstagram(caption, username, session, img);

		if (!published) {
			await this.postModel.updateOne({ _id: postId }, { $set: { canceledAt: dayjs().toDate() } });
			throw new BadRequestException('FAILED_PUBLISH_PHOTO');
		}

		return published;
	}

	async publishNow({ data, meta }: PublishedPostProps) {
		const { username, caption } = data;

		const account = await this.userModel
			.findOne(
				{
					_id: meta.userId,
					'InstagramAccounts.username': username,
				},
				{
					_id: 0,
					InstagramAccounts: 1,
				}
			)
			.lean()
			.then((user) => user?.InstagramAccounts[0]);

		if (!account) {
			throw new NotFoundException('USER_NOT_ASSOCIATED_WITH_THIS_ACCOUNT');
		}

		const published = await this.publishPhotoOnInstagram(caption, username, account.session, data.img);

		if (!published) {
			throw new BadRequestException('FAILED_PUBLISH_PHOTO');
		}

		const postCreate = {
			code: published.code,
			postId: published.id,
			caption,
			imageUrl: data.img,
			userId: meta.userId,
			accountId: account.accountId,
			canceledAt: null,
			publishedAt: dayjs().toDate(),
			scheduledAt: null,
		};

		const post = await this.postModel.create(postCreate);

		return {
			post: {
				caption: post.caption,
				imageUrl: post.imageUrl,
				publishedAt: post.publishedAt,
				id: post._id.toString(),
			},
		};
	}

	async schedulePost({ data, meta }: DefaultPostBodyCreate) {
		const { username, post_date, caption } = data;
		const date = dayjs(post_date).toDate();

		if (date < dayjs().toDate()) {
			throw new BadRequestException('INVALID_POST_DATE');
		}

		const instagramAccount = await this.instagramAuthService.hasInstagramAccount(meta, username);

		if (!instagramAccount) {
			throw new NotFoundException('USER_NOT_ASSOCIATED_WITH_THIS_ACCOUNT');
		}

		const restored = await this.instagramAuthService.restoreSession(username, instagramAccount.session);

		if (!restored) {
			throw new TokenExpiredError('SESSION_REQUIRED', dayjs().toDate());
		}

		const jobId = `post_${username}_${date.getTime()}`;

		const postCreate = {
			caption,
			imageUrl: data.img,
			accountId: instagramAccount.accountId,
			userId: meta.userId,
			canceledAt: null,
			publishedAt: null,
			jobId,
			scheduledAt: post_date || null,
		};

		const post = await this.postModel.create(postCreate);

		await this.scheduleCronJob(jobId, date, {
			data,
			meta,
			id: post._id.toString(),
			session: instagramAccount.session,
		});

		await this.sendEmailToUser({
			to: meta.email,
			subject: 'Post agendado com sucesso 🗓️',
			templateFile: 'scheduled-post.html',
			data: {
				postDate: dayjs(date).subtract(3, 'hour').format('DD/MM/YYYY'),
				postHour: dayjs(date).subtract(3, 'hour').format('HH:mm'),
			}
		});

		return {
			scheduled_date: date,
			post_id: post._id.toString(),
		};
	}

	async sendEmailToUser({ to, subject, templateFile, data }: { to: string; subject: string; templateFile: string, data: Record<string, unknown> }) {
		const html = await getHtmlPath(templateFile, data);

		return await this.emailService.send({
			to,
			subject,
			html,
		});
	}

	async scheduleCronJob(jobId: string, date: Date, publishParams: PublishedPostProps) {
		const cronExpression = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

		console.log('cron expression', cronExpression);
		const job = new CronJob(
			cronExpression,
			async () => {
				this.logger.debug(`Executing scheduled post ${jobId}`);
				try {
					await this.publishPost(publishParams);
				} catch (err) {
					this.logger.error(`Failed to publish scheduled post ${jobId}`, err);
				}
			},
			this.createCleanupHandler(jobId),
			true, // start
			TIME_ZONE
		);

		this.schedulerRegistry.addCronJob(jobId, job);
		this.scheduledPosts.set(jobId, job);
		this.logger.debug(`Post scheduled with ID ${jobId} for ${date}`);
	}

	private createCleanupHandler(jobId: string) {
		return () => {
			this.logger.debug(`Cleaning up job ${jobId}`);
			this.cleanupJob(jobId);
		};
	}

	private cleanupJob(jobId: string) {
		this.scheduledPosts.delete(jobId);
		this.schedulerRegistry.deleteCronJob(jobId);
	}

	async publishPost({ data, meta, id, session }: PublishedPostProps) {
		const { username, caption } = data;

		const user = await this.userModel.findOne({ _id: meta.userId });

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		const { code, id: postId } = await this.verifyPostPublish({
			postId: id,
			caption,
			username,
			session,
			img: data.img,
		});

		const updatedPost = await this.postModel.findOneAndUpdate(
			{ _id: id },
			{ publishedAt: dayjs().toDate(), code, postId },
			{ new: true }
		);

		if (!updatedPost) {
			throw new NotFoundException('POST_NOT_FOUND');
		}

		this.logger.debug(`Post published successfully ${username}`);

		return {
			post: {
				code,
				postId,
				caption: updatedPost.caption,
				imageUrl: updatedPost.imageUrl,
				publishedAt: updatedPost.publishedAt,
				scheduledAt: updatedPost.scheduledAt,
				id: updatedPost._id.toString(),
			},
		};
	}

	async publishPhotoOnInstagram(
		caption: string,
		username: string,
		session: Session,
		img: string
	): Promise<{ id: string; code: string } | false> {
		try {
			this.logger.debug(`Publishing photo on Instagram from username: ${username}`, { caption });

			const restored = await this.instagramAuthService.restoreSession(username, session);

			if (!restored) {
				throw new TokenExpiredError('SESSION_REQUIRED', dayjs().toDate());
			}

			const signedUrl = await this.storageService.getSignedImageUrl(img);

			const imageBuffer = await get({ url: signedUrl, encoding: null });

			const post = await this.ig.publish.photo({ file: imageBuffer, caption });

			return { id: post.media.id, code: post.media.code };
		} catch (error) {
			this.logger.error(`Failed to publish photo on Instagram from username: ${username}`, { caption, error });
			return false;
		}
	}

	async getInstagramPostInfo(post: Post, username: string, session: Session) {
		try {
			const restored = await this.instagramAuthService.restoreSession(username, session);

			if (!restored) {
				throw new TokenExpiredError('SESSION_REQUIRED', new Date());
			}

			const mediaInfo = (await this.ig.media.info(post.postId)).items[0];
			const insights = (await this.ig.insights.post(post.postId)).data.media;
			const comments = (await this.ig.feed.mediaComments(post.postId).items()).slice(-5);

			const recentComments =
				comments?.map((comment) => ({
					text: comment.text,
					user: {
						username: comment.user.username,
						profile_pic_url: comment.user.profile_pic_url,
						verified: comment.user.is_verified,
					},
					created_at: new Date(comment.created_at * 1000),
					like_count: comment.comment_like_count,
					reply_count: comment.child_comment_count,
				})) ?? [];

			return {
				code: mediaInfo.code,
				caption: mediaInfo.caption.text,
				engagement: {
					hasLiked: mediaInfo.has_liked,
					likes: insights.like_count,
					comments: insights.comment_count,
				},
				comments: {
					recent: recentComments,
					has_more: mediaInfo.comment_count > 5,
				},
			};
		} catch (error) {
			this.logger.error('Failed to get Instagram post info', { postId: post.postId, error });
			return {
				code: post.code,
				caption: post.caption,
				engagement: {
					hasLiked: false,
					likes: 0,
					comments: 0,
				},
				comments: {
					recent: [],
					has_more: false,
				},
			}
		}
	}

	async cancelScheduledPost({ postId, userId }: { postId: string; userId: string }) {
		const post = await this.postModel
			.findOne(
				{
					_id: postId,
					userId: userId,
					scheduledAt: { $ne: null },
				},
				{ jobId: 1 }
			)
			.lean();

		if (!post) {
			throw new NotFoundException('SCHEDULED_POST_NOT_FOUND');
		}

		const job = this.scheduledPosts.get(post.jobId);

		if (!job) {
			throw new NotFoundException('SCHEDULED_JOB_NOT_FOUND');
		}

		await this.postModel.updateOne(
			{ _id: postId },
			{
				canceledAt: dayjs().toDate(),
				scheduledAt: null,
			}
		);

		this.cleanupJob(post.jobId);

		return true;
	}

	async getUserPostsWithDetails({ pagination, meta }: GetUserPostsProps) {
		const userId = meta.userId;

		const { page, offset, perPage } = pagination;

		const user = await this.userModel.findOne({ _id: userId }, { InstagramAccounts: 1 }).lean();

		const accountsIds = map(user.InstagramAccounts, 'accountId');

		if (isEmpty(accountsIds)) {
			return {
				success: true,
				data: [],
				meta: {
					total: 0,
					page,
					limit: perPage
				},
			};
		}

		const [posts, total] = await Promise.all([
			this.postModel.find({ accountId: { $in: accountsIds } })
				.populate({
					path: 'userId',
					select: '_id name email InstagramAccounts'
				})
				.sort({ publishedAt: -1, scheduledAt: -1 })
				.skip(offset)
				.limit(perPage)
				.lean(),

			this.postModel.countDocuments({ accountId: { $in: accountsIds } })
		]);

		const postsWithInstagramInfo = await Promise.all(map(posts, async (post) => {
			const account = user.InstagramAccounts.find(acc => acc.accountId === post.accountId);

			const { username, session } = account;

			const instagramInfo = post.postId ? await this.getInstagramPostInfo(post, username, session) : {};

			const userInfo = post.userId;

			return {
				...omit(post, ['userId.InstagramAccounts.session', 'userId']),
				...instagramInfo,
				imageUrl: await this.storageService.getSignedImageUrl(post.imageUrl),
				user: userInfo,
				account: {
					username: account.username,
					profilePicUrl: await this.storageService.getSignedImageUrl(account.profilePicUrl),
					fullName: account.fullName,
					isPrivate: account.isPrivate,
					isVerified: account.isVerified
				}
			};
		}));

		return {
			success: true,
			data: postsWithInstagramInfo,
			meta: {
				total,
				page,
				limit: perPage
			},
		};
	}
}
