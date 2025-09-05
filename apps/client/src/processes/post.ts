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
		data,
	};
};

export const getUserPostsWithDetails = async ({ page, limit, userPlatformId }: { page?: number; limit?: number; userPlatformId?: number }) => {
	const response: ClientResponse = await client.get(`/posts`, {
		params: {
			page,
			items_per_page: limit,
			userPlatformId,
		},
	});

	return response;
};

export const cancelPost = async ({ postId }: { postId: string }) => {
	const { data }: ClientResponse = await client.post(`/posts/cancel/${postId}`);

	return {
		data,
	};
};

export const getUserPlatforms = async () => {
	const { data }: ClientResponse = await client.get(`/platforms/user-platforms`);

	return {
		data,
	};
};
