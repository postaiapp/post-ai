import { CreatePostDto } from '@modules/post/dto/post.dto';
import { Meta } from './meta';

export type PostCreate = {
    body: CreatePostDto;
    meta: Meta;
};
