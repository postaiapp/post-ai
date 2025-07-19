import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { UserPlatform } from '@models/user-platform.model';
import { CreatePostDto, ListPostsDto } from '../dto/post.dto';
import { PostContext } from '../contexts/post.context';
import { Uploader } from '@type/storage';
import { EmailService } from '@common/providers/email.service';
import { getHtmlPath } from '@utils/email';
import * as dayjs from 'dayjs';
import FileUtils from '@utils/file';
import { Meta } from '@type/meta';
import { Op, WhereOptions } from 'sequelize';
import PaginationUtils from '@utils/pagination';

@Injectable()
export class PostService {
	constructor(
		@InjectModel(Post)
		private postModel: typeof Post,
		@InjectModel(UserPlatform)
		private userPlatformModel: typeof UserPlatform,
		private context: PostContext,
		@Inject(Uploader) private readonly storageService: Uploader,
		private readonly emailService: EmailService,
	) {}

	findUserPlatform(userPlatformId: number, userId: number, scope: string[] = []) {
		const userPlatform = this.userPlatformModel.scope(scope).findOne({
			where: {
				id: userPlatformId,
				user_id: userId,
			},
			raw: true,
			nest: true,
		});

		if (!userPlatform) {
			throw new NotFoundException('USER_PLATFORM_NOT_FOUND');
		}

		return userPlatform;
	}

	async create(data: CreatePostDto, meta: Meta) {
		const userPlatform = await this.findUserPlatform(data.user_platform_id, meta.userId, [
			'withPlatform',
			'withAuthToken',
		]);

		if (data.scheduled_at) {
			return this.schedulePost(data, meta, userPlatform);
		}

		return this.publishPost(data, meta, userPlatform);
	}

	async publishPost(data: CreatePostDto, meta: Meta, userPlatform: UserPlatform) {
		const post = await this.context.create(data, userPlatform);

		const createdPost = await this.postModel.create({
			creatorId: meta.userId,
			accountId: userPlatform.id,
			caption: data.caption,
			imageUrl: FileUtils.getUnsignedUrl(data.media_url),
			scheduledAt: data.scheduled_at,
			externalId: post.id,
			code: post.container_id,
			publishedAt: dayjs().format(),
		});

		if (createdPost.imageUrl) {
			createdPost.imageUrl = await this.storageService.getSignedImageUrl(
				createdPost.imageUrl,
			);
		}

		return createdPost;
	}

	async publishScheduledPost(post: Post, userPlatform: UserPlatform) {
		const postToPublish = {
			user_platform_id: userPlatform.id,
			caption: post.caption,
			media_url: await this.storageService.getSignedImageUrl(post.imageUrl),
		};

		const publishedPost = await this.context.create(postToPublish, userPlatform);

		const changes = {
			externalId: publishedPost.id,
			code: publishedPost.container_id,
			publishedAt: dayjs().format(),
		};

		await this.postModel.update(changes, {
			where: {
				id: post.id,
				deletedAt: null,
			},
		});

		return true;
	}

	async schedulePost(data: CreatePostDto, meta: Meta, userPlatform: UserPlatform) {
		if (dayjs(data.scheduled_at).isBefore(dayjs())) {
			throw new BadRequestException('INVALID_POST_DATE');
		}

		const createdPost = await this.postModel.create({
			creatorId: meta.userId,
			accountId: userPlatform.id,
			caption: data.caption,
			imageUrl: FileUtils.getUnsignedUrl(data.media_url),
			scheduledAt: data.scheduled_at,
			publishedAt: null,
		});

		await this.sendEmailToUser({
			to: meta.email,
			subject: 'Post agendado com sucesso 🗓️',
			templateFile: 'scheduled-post.html',
			data: {
				postDate: dayjs(data.scheduled_at).subtract(3, 'hour').format('DD/MM/YYYY'),
				postHour: dayjs(data.scheduled_at).subtract(3, 'hour').format('HH:mm'),
			},
		});

		if (createdPost.imageUrl) {
			createdPost.imageUrl = await this.storageService.getSignedImageUrl(
				createdPost.imageUrl,
			);
		}

		return createdPost;
	}

	async list(meta: Meta, filter: ListPostsDto) {
		if (filter.user_platform_id) {
			await this.findUserPlatform(filter.user_platform_id, meta.userId);
		}

		const Pagination = PaginationUtils.config({
			page: filter.page,
			items_per_page: filter.items_per_page,
		});

		const whereCondition: WhereOptions<Post> = {
			creatorId: meta.userId,
		};

		if (filter.searchText) {
			whereCondition.caption = {
				[Op.iLike]: `%${filter.searchText}%`,
			};
		}

		if (filter.user_platform_id) {
			whereCondition.accountId = filter.user_platform_id;
		}

		const promises: any = [
			this.postModel.findAll({
				where: whereCondition,
				...Pagination.getQueryParams(),
				order: [['createdAt', 'DESC']],
			}),
		];

		if (Pagination.getPage() === 1) {
			promises.push(
				this.postModel.count({
					where: whereCondition,
				}),
			);
		}

		const [posts, totalItems] = await Promise.all(promises);

		return {
			posts,
			...Pagination.mount(totalItems),
		};
	}

	async sendEmailToUser({
		to,
		subject,
		templateFile,
		data,
	}: {
		to: string;
		subject: string;
		templateFile: string;
		data: Record<string, unknown>;
	}) {
		const html = await getHtmlPath(templateFile, data);

		return await this.emailService.send({
			to,
			subject,
			html,
		});
	}
}
