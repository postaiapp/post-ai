import { IMAGE_TEST_URL, TIME_ZONE } from '@constants/post';
import { TokenValidationService } from '@modules/instagram-auth/services/token-validation.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from '@nestjs/schedule/node_modules/cron/dist';
import { User } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { get } from 'request-promise';
import { PostCreate } from 'src/type/post';

@Injectable()
export class PostService {
    private scheduledPosts: Map<string, CronJob> = new Map();
    private readonly logger = new Logger(PostService.name);

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly ig: IgApiClient,
        private schedulerRegistry: SchedulerRegistry,
        private readonly tokenValidationService: TokenValidationService
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
        const { username, caption } = body;

        const user = await this.userModel.findOne({
            userId: meta.userId,
        });

        try {
            await this.tokenValidationService.checkTokenValidity(user.id);

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

    // async publishCarousel(userId: string, options: PostOptions) {
    //     try {
    //         const user = await this.userModel.findOne({ userId });

    //         if (!user) {
    //             throw new BadRequestException('User not found');
    //         }

    //         // Restore session
    //         await this.ig.state.deserialize(JSON.parse(user.token));

    //         // Prepare media items
    //         const mediaItems = await Promise.all(
    //             options.images.map(async (image) => {
    //                 return {
    //                     file: Readable.from(image),
    //                     width: 1080,
    //                     height: 1080,
    //                 };
    //             })
    //         );

    //         // Prepare caption with hashtags
    //         const caption = options.hashtags?.length
    //             ? `${options.caption}\n\n${options.hashtags.map((tag) => `#${tag}`).join(' ')}`
    //             : options.caption;

    //         // Upload carousel
    //         const published = await this.ig.publish.album({
    //             items: mediaItems,
    //             caption,
    //             location: options.location
    //                 ? {
    //                       name: options.location.name,
    //                       lat: options.location.lat,
    //                       lng: options.location.lng,
    //                   }
    //                 : undefined,
    //         });

    //         return {
    //             status: 'success',
    //             postId: published.media.id,
    //             caption: caption,
    //             imageCount: mediaItems.length,
    //         };
    //     } catch (error) {
    //         this.logger.error(`Failed to publish carousel for user ${userId}:`, error);
    //         throw new BadRequestException('Failed to publish carousel');
    //     }
    // }
}
