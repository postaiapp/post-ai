import { CreatePostDto } from '@modules/post/dto/post.dto';
import { Session } from '@schemas/token';
import { Meta } from './meta';

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

export type GetUserPostsProps = {
	query: {
		page?: number;
		limit?: number;
	};
	meta: Meta
}
type VerifyPostPublishProps = {
	postId: string;
	caption: string;
	username: string;
	session: Session;
};

type GenerateImageOptions = {
	prompt: string;
	n?: number;
	size?: string;
	style?: string;
};

type GeneratedImage = {
	url: string;
};

export type {
	CanceledPostBody,
	DefaultPostBodyCreate,
	GeneratedImage,
	GenerateImageOptions,
	PostBodyCreate,
	PublishedPostProps,
	VerifyPostPublishProps
};

