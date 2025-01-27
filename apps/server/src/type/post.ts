import { CreatePostDto } from '@modules/post/dto/post.dto';
import { Meta } from './meta';

export type PostCreate = {
	body: CreatePostDto;
	meta: Meta;
};

export type PublishedPostProps = PostCreate & { id?: string };

export type PostBodyCreate = {
	caption: string;
	imageUrl: Buffer | string;
	userId: string;
	publishedAt: Date;
	scheduledAt: Date;
};
