import { ClientResponse } from '@common/interfaces/api';

import client from './api';

export const connect = async (code: string, platformId: number) => {
	const { data }: ClientResponse = await client.post('/platforms/connect', {
		code,
		platform_id: platformId,
	});

	return { data };
};
