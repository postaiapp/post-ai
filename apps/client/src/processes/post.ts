import { ClientResponse } from '@common/interfaces/api';
import { PostFormData } from '@common/interfaces/post';

import client from './api';

export const createPost = async (filter: PostFormData) => {
	const { data }: ClientResponse = await client({
		method: 'POST',
		url: `/posts`,
		data: filter,
	});

	return {
		data
	};
};

export const getUserPostsWithDetails = async ({ page, limit } : { page?: number, limit?: number }	) => {
	const { data }: ClientResponse = await client.get(`/posts`, {
		params: {
			page,
			perPage: limit
		},
	});

	return {
		data
	};
};

export const cancelPost = async ({ postId }: { postId: string }) => {
  const { data }: ClientResponse = await client.post(`/posts/cancel/${postId}`);

	return {
		data
	};
};
