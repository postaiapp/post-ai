import { Injectable } from '@nestjs/common';
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

        const user = await this.ig.account.login('ata1de', password);

        console.log(user);

        //ONLY FOR TESTS
        const imageBuffer = await get({
            url: 'https://i.imgur.com/BZBHsauh.jpg',
            encoding: null,
        });

        console.log(imageBuffer);

        this.ig.publish.photo({
            file: imageBuffer,
            caption,
        });
    }
}
