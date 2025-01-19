import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { InstagramAuthDto } from '../dto/instagram-auth.dto';

@Injectable()
export class InstagramAuthService {
    private readonly logger = new Logger(InstagramAuthService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly ig: IgApiClient,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async login({ username, password }: InstagramAuthDto) {
        this.ig.state.generateDevice(username);

        try {
            const user = await this.ig.account.login(username, password);
            const token = await this.ig.state.serialize();

            console.log('User:', user);
            console.log('Token:', token);

            // Fetch additional user info
            const userInfo = await this.ig.user.info(user.pk);

            console.log('userInfo:', userInfo);

            // // Prepare user data for database
            // const userData: InstagramUser = {
            //     userId: user.pk.toString(),
            //     username: user.username,
            //     fullName: userInfo.full_name,
            //     biography: userInfo.biography,
            //     followerCount: userInfo.follower_count,
            //     followingCount: userInfo.following_count,
            //     postCount: userInfo.media_count,
            //     profilePicUrl: userInfo.profile_pic_url,
            //     token: JSON.stringify(token),
            //     lastLogin: new Date(),
            // };

            // // Update or create user in database
            // await this.userModel.findOneAndUpdate({ userId: userData.userId }, userData, { upsert: true, new: true });

            // return {
            //     message: 'Login successful',
            //     userData: {
            //         username: userData.username,
            //         fullName: userData.fullName,
            //         followerCount: userData.followerCount,
            //         postCount: userData.postCount,
            //     },
            // };
        } catch (error) {
            this.logger.error(`Login failed for user ${username}:`, error);
            throw new BadRequestException('Invalid Credentials');
        }
    }
}
