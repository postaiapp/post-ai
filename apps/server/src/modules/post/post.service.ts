import { BadRequestException, Injectable } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';
import { get } from 'request-promise';
import { CreatePost } from './dto/post.dto';

@Injectable()
export class PostService {
    constructor(private readonly ig: IgApiClient) {
        this.ig = new IgApiClient();
    }

    async create({ caption, password }: CreatePost) {
        this.ig.state.generateDevice('ata1de');
        console.log('body', { caption, password });

        try {
            await this.ig.account.login('ata1de', password);

            //ONLY FOR TESTS
            const imageBuffer = await get({
                url: 'https://i.imgur.com/BZBHsauh.jpg',
                encoding: null,
            });

            this.ig.publish.photo({
                file: imageBuffer,
                caption,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new BadRequestException('Invalid Credentials');
        }
    }
}
