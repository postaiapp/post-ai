import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from '@nestjs/schedule/node_modules/cron/dist';
import { User } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { get } from 'request-promise';
import { CreatePost } from '../dto/post.dto';

const TIME_ZONE = 'America/Sao_Paulo';
const IMAGE_URL = 'https://i.imgur.com/BZBHsauh.jpg';

@Injectable()
export class PostService {
    private scheduledPosts: Map<string, CronJob> = new Map();
    private readonly logger = new Logger(PostService.name);

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly ig: IgApiClient,
        private schedulerRegistry: SchedulerRegistry
    ) {}

    async create(createPostData: CreatePost) {
        const { post_date } = createPostData;

        if (post_date) {
            console.log('Scheduling post');
            return this.schedulePost(createPostData);
        }

        return this.publishPost(createPostData);
    }

    private async schedulePost(postData: CreatePost) {
        const { username, post_date } = postData;
        const date = new Date(post_date);
        console.log('DATE', date);

        if (date < new Date()) {
            return new BadRequestException('Invalid post date');
        }

        const jobId = `post_${username}_${date.getTime()}`;
        const cronExpression = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

        const job = new CronJob(
            cronExpression,
            async () => {
                this.logger.debug(`Executing scheduled post for ${username}`);

                try {
                    await this.publishPost(postData);
                } catch (err) {
                    this.logger.error(`Error publishing scheduled post for ${username}`, err);
                }

                this.scheduledPosts.delete(jobId);
            },
            null,
            true,
            TIME_ZONE
        );

        this.schedulerRegistry.addCronJob(jobId, job);
        this.scheduledPosts.set(jobId, job);

        this.logger.debug(`Post scheduled for ${username} at ${date}`);

        return {
            message: 'Post scheduled successfully',
            scheduled_date: date,
        };
    }

    async publishPost({ username, caption, password }: CreatePost) {
        this.ig.state.generateDevice(username);

        try {
            await this.ig.account.login(username, password);

            const imageBuffer = await get({
                url: IMAGE_URL,
                encoding: null,
            });

            this.ig.publish.photo({
                file: imageBuffer,
                caption,
            });

            return { message: 'Post created successfully' };
        } catch {
            throw new BadRequestException('Invalid Credentials');
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
