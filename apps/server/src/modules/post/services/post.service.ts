import { IMAGE_TEST_URL, TIME_ZONE } from '@constants/post';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Post } from '@schemas/post.schema';
import { User } from '@schemas/user.schema';
import { PostBodyCreate, PostCreate } from 'src/types/post';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { get } from 'request-promise';

@Injectable()
export class PostService {
    private scheduledPosts: Map<string, CronJob> = new Map();
    private readonly logger = new Logger(PostService.name);

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Post.name) private readonly postModel: Model<Post>,
        private readonly ig: IgApiClient,
        private readonly instagramAuthService: InstagramAuthService,
        private schedulerRegistry: SchedulerRegistry
    ) {}

    async create({ body, meta }: PostCreate) {
        const { post_date } = body;

        if (post_date) {
            return this.schedulePost({ body, meta });
        }

        return this.publishPost({ body, meta });
    }

    async schedulePost({ body, meta }: PostCreate) {
        const { username, post_date } = body;
        const date = new Date(post_date);

        if (date < new Date()) {
            throw new BadRequestException('Invalid post date');
        }

        const jobId = `post_${username}_${date.getTime()}`;
        const cronExpression = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

        await this.instagramAuthService.verifyAccount(body, meta);

        const job = new CronJob(
            cronExpression,
            async () => {
                this.logger.debug(`Executing scheduled post for ${username}`);

                try {
                    await this.publishPost({ body, meta });
                } catch (err) {
                    this.logger.error(`Error publishing scheduled post for ${username}`, err);
                }

                this.scheduledPosts.delete(jobId);
            },
            null, // onComplete
            true, // start
            TIME_ZONE // timezone
        );

        this.schedulerRegistry.addCronJob(jobId, job);
        this.scheduledPosts.set(jobId, job);

        this.logger.debug(`Post scheduled for ${username} at ${date}`);

        return {
            message: 'Post scheduled successfully',
            scheduled_date: date,
        };
    }

    async publishPost({ body, meta }: PostCreate) {
        const { username, caption, password, post_date } = body;

        const user = await this.userModel.findOne({ _id: meta.userId });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        this.ig.state.generateDevice(username);

        try {
            await this.ig.account.login(username, password);
        } catch (error) {
            this.logger.error('Erro ao realizar login no Instagram', { username, error });
            throw new BadRequestException('Invalid Instagram credentials');
        }

        await this.publishPhotoOnInstagram(caption, username);

        const newPost = await this.createPostRecord({
            caption,
            imageUrl: IMAGE_TEST_URL,
            userId: meta.userId.toString(),
            publishedAt: post_date || new Date(),
        });

        this.logger.debug(`Post criado com sucesso para o usuário: ${username}`);

        return {
            message: 'Post created successfully',
            post: {
                caption: newPost.caption,
                imageUrl: newPost.imageUrl,
                publishedAt: newPost.publishedAt,
                id: newPost._id.toHexString(),
            },
        };
    }

    async publishPhotoOnInstagram(caption: string, username: string): Promise<boolean> {
        this.ig.state.generateDevice(username);

        try {
            const imageBuffer = await get({
                url: IMAGE_TEST_URL,
                encoding: null,
            });

            await this.ig.publish.photo({
                file: imageBuffer,
                caption,
            });

            return true;
        } catch (error) {
            this.logger.error('Erro ao publicar a foto no Instagram', { caption, error });
            throw new BadRequestException('Error publishing post');
        }
    }

    async createPostRecord(postBody: PostBodyCreate) {
        try {
            const newPost = await this.postModel.create(postBody);

            if (!newPost) {
                throw new Error('Error saving post to the database');
            }

            return newPost;
        } catch (error) {
            this.logger.error('Erro ao salvar o post no banco de dados', { postBody, error });
            throw new BadRequestException('Error creating post');
        }
    }

    async cancelScheduledPost(jobId: string) {
        const job = this.scheduledPosts.get(jobId);

        if (job) {
            job.stop();
            this.schedulerRegistry.deleteCronJob(jobId);
            this.scheduledPosts.delete(jobId);

            this.logger.debug(`Cancelled scheduled post ${jobId}`);
            return { message: 'Scheduled post cancelled successfully' };
        }
        throw new BadRequestException('Scheduled post not found');
    }
}
