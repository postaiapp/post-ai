import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { UserPlatform } from '@models/user-platform.model';
import { CreatePostDto } from '../dto/post.dto';
import { PostContext } from '../contexts/post.context';
import { Uploader } from '@type/storage';
import { EmailService } from '@common/providers/email.service';
import { getHtmlPath } from '@utils/email';
import * as dayjs from 'dayjs';

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

	async create(data: CreatePostDto, userId: number) {
		const userPlatform = await this.userPlatformModel
			.scope(['withPlatform', 'withAuthToken'])
			.findOne({
				where: {
					id: data.user_platform_id,
					user_id: userId,
				},
				raw: true,
				nest: true,
			});

		if (!userPlatform) {
			throw new NotFoundException('USER_PLATFORM_NOT_FOUND');
		}

		const post = await this.context.create(data, userPlatform);

		const createdPost = await this.postModel.create({
			creatorId: userId,
			accountId: userPlatform.id,
			caption: data.caption,
			imageUrl: data.media_url,
			scheduledAt: data.scheduled_at,
			externalId: post.id,
			code: post.container_id,
			publishedAt: dayjs().format(),
		});

		return createdPost;
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
