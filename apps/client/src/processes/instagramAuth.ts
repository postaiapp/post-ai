import { ClientResponse } from '@common/interfaces/api';

import client from './api';

export const instagramAuthCallback = async (code: string) => {
	const { data }: ClientResponse = await client.post('/meta/auth/callback', {
		code,
	});
	return { data };
};
