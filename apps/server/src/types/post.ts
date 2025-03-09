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
	username: string;
};

type VerifyPostPublishProps = {
	postId: string;
	caption: string;
	username: string;
	session: Session;
	img: string;
};

export type { CanceledPostBody, DefaultPostBodyCreate, PostBodyCreate, PublishedPostProps, VerifyPostPublishProps };
