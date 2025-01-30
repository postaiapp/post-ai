import { CreatePostDto } from '@modules/post/dto/post.dto';
import { Meta } from './meta';
import { Session } from '@schemas/token';

export type PostCreate = {
	body: CreatePostDto;
	meta: Meta;
};

export type PublishedPostProps = PostCreate & { id?: string; session?: Session };

export type PostBodyCreate = {
	caption: string;
	imageUrl: Buffer | string;
	userId: string;
	publishedAt: Date;
	scheduledAt: Date;
};
