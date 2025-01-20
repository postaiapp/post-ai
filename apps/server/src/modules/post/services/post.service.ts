import { IMAGE_TEST_URL, TIME_ZONE } from '@constants/post';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from '@nestjs/schedule/node_modules/cron/dist';
import { User } from '@schemas/user.schema';
import { Meta } from '@type/meta';
import { PostCreate } from '@type/post';
import { scrypt } from 'crypto';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { get } from 'request-promise';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class PostService {
    private scheduledPosts: Map<string, CronJob> = new Map();
    private readonly logger = new Logger(PostService.name);

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly ig: IgApiClient,
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
        const { username, post_date, password } = body;
        const date = new Date(post_date);

        if (date < new Date()) {
            throw new BadRequestException('Invalid post date');
        }

        const jobId = `post_${username}_${date.getTime()}`;
        const cronExpression = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

        await this.validatePassword(password, meta, username);

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

    async publishPost({ body, meta }: PostCreate) {
        const { username, caption, password } = body;

        const user = await this.userModel.findOne({
            userId: meta.userId,
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        this.ig.state.generateDevice(username);

        try {
            await this.ig.account.login(username, password);

            const imageBuffer = await get({
                url: IMAGE_TEST_URL,
                encoding: null,
            });

            this.ig.publish.photo({
                file: imageBuffer,
                caption,
            });

            this.logger.debug(`Post created successfully by user ${username}`);

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

    async validatePassword(password: string, meta: Meta, username: string) {
        const instagramAccount = await this.userModel
            .findById({
                _id: meta.userId,
                InstagramAccounts: {
                    $elemMatch: {
                        username: username,
                    },
                },
            })
            .lean();

        if (!instagramAccount) {
            throw new NotFoundException('Instagram account not found');
        }

        const [hashedPassword, salt] = instagramAccount.password.split('.');

        const hash = (await scryptAsync(password, salt, 32)) as Buffer;

        if (hashedPassword !== hash.toString('hex')) {
            throw new BadRequestException('Invalid credentials');
        }
    }
}
