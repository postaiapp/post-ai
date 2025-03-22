import { CreatePostDto } from '@modules/post/dto/post.dto';
import { Meta } from './meta';
import { Session } from '@schemas/token';

type DefaultPostBodyCreate = {
	data?: CreatePostDto;
	meta?: Meta;
	query?: CanceledPostBody;
};

type PublishedPostProps = DefaultPostBodyCreate & { id?: string; session?: Session };

type PostBodyCreate = {
	caption: string;
	imageUrl: Buffer | string;
	userId: string;
	publishedAt: Date;
	scheduledAt: Date;
	canceledAt?: Date;
	jobId?: string;
};

type CanceledPostBody = {
	postId: string;
};

type VerifyPostPublishProps = {
	postId: string;
	caption: string;
	username: string;
	session: Session;
	img: string;
};

type GetUserPostsProps = {
	query: {
		page?: number;
		limit?: number;
	};
	meta: Meta
}

export type { CanceledPostBody, DefaultPostBodyCreate, PostBodyCreate, PublishedPostProps, VerifyPostPublishProps, GetUserPostsProps };
