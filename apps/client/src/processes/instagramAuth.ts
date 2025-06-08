import { ClientResponse } from '@common/interfaces/api';

import client from './api';

export const connectAccount = async (code: string) => {
	console.log('code', code);
	const { data }: ClientResponse = await client.post('/meta/account/connect', {
		code,
	});

	return { data };
};
