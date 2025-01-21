import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { InstagramAccount } from '@type/instagram-account';
import { Meta } from '@type/meta';
import * as crypto from 'crypto';
import { scrypt } from 'crypto';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { promisify } from 'util';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';

const scryptAsync = promisify(scrypt);

@Injectable()
export class InstagramAuthService {
    private readonly logger = new Logger(InstagramAuthService.name);

    constructor(
        private readonly ig: IgApiClient,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async hasInstagramAccount(meta: Meta, username: string) {
        const existingAccount = await this.userModel.countDocuments({
            _id: meta.userId,
            'InstagramAccounts.username': username,
        });

        if (existingAccount > 0) {
            throw new BadRequestException('Instagram account already exists for this user');
        }
    }

    async login(body: InstagramAuthDto, meta: Meta) {
        const { username, password } = body;

        await this.hasInstagramAccount(meta, username);

        this.ig.state.generateDevice(username);

        try {
            const user = await this.ig.account.login(username, password);

            const userInfo = await this.ig.user.info(user.pk);

            const hashedPassword = await this.generatePasswordHash(password);

            const userData: InstagramAccount = {
                userId: user.pk.toString(),
                username: user.username,
                fullName: userInfo.full_name,
                biography: userInfo.biography,
                followerCount: userInfo.follower_count,
                followingCount: userInfo.following_count,
                postCount: userInfo.media_count,
                profilePicUrl: userInfo.profile_pic_url,
                lastLogin: new Date(),
                password: hashedPassword,
            };

            const newUser = await this.userModel
                .findOneAndUpdate(
                    { email: meta.email },
                    { $push: { InstagramAccounts: userData } },
                    {
                        _id: 0,
                        new: true,
                        select: 'email InstagramAccounts.username InstagramAccounts.userId',
                    }
                )
                .lean();

            if (!newUser) {
                throw new BadRequestException('User not found');
            }

            return {
                message: 'Login successful',
                newUser,
            };
        } catch (error) {
            this.logger.error(`Login failed for user ${username}:`, error);
            throw new BadRequestException('Invalid Credentials');
        }
    }

    async generatePasswordHash(password: string) {
        const salt = crypto.randomBytes(8).toString('hex');
        const hash = (await scryptAsync(password, salt, 32)) as Buffer;

        return `${hash.toString('hex')}.${salt}`;
    }

    async delete(body: DeleteInstagramAuthDto, meta: Meta) {
        const { username } = body;

        const newUser = await this.userModel
            .findOneAndUpdate(
                { _id: meta.userId },
                {
                    $pull: {
                        InstagramAccounts: { username: username },
                    },
                },
                { new: true }
            )
            .lean();

        if (!newUser) {
            throw new BadRequestException('User not found');
        }

        return {
            message: 'Account deleted successfully',
            instagramAccounts: newUser.InstagramAccounts,
        };
    }
}
