import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { get } from 'request-promise';
import { CreatePost } from './dto/post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly ig: IgApiClient
    ) {
        this.ig = new IgApiClient();
    }

    async create({ username, caption, password }: CreatePost) {
        this.ig.state.generateDevice(username);

        try {
            const user = await this.ig.account.login(username, password);

            //ONLY FOR TESTS
            console.log(user);

            const imageBuffer = await get({
                url: 'https://i.imgur.com/BZBHsauh.jpg',
                encoding: null,
            });

            this.ig.publish.photo({
                file: imageBuffer,
                caption,
            });

            return { message: 'Post created successfully' };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new BadRequestException('Invalid Credentials');
        }
    }
}
