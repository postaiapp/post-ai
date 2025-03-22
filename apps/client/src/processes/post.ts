import { ClientResponse } from '@common/interfaces/api';
import { PostFormData } from '@common/interfaces/post';

import client from './api';

export const createPost = async (filter: PostFormData) => {
	const { data, error }: ClientResponse = await client({
		method: 'POST',
		url: `/posts`,
		data: filter,
	});

	return {
		data,
		error,
	};
};
