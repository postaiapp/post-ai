import { CreatePostDto } from '@modules/post/dto/post.dto';
import { Meta } from './meta';
import { Session } from '@schemas/token';
import { Pagination } from '@common/dto/pagination.dto';
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

type GetUserPostsProps = {
	pagination: Pagination;
	meta: Meta
}
type VerifyPostPublishProps = {
	postId: string;
	caption: string;
	username: string;
	session: Session;
	img: string;
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
	VerifyPostPublishProps,
	GetUserPostsProps
};

