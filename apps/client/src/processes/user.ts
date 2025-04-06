import { ClientResponse } from '@common/interfaces/api';

import { UpdateUserData } from '@common/interfaces/user';
import client from './api';

export const updateUser = async (body: UpdateUserData) => {
	const { data }: ClientResponse = await client.put(`/user`, body);

	return {
		data,
	};
};

export const deleteUser = async () => {
  const { data }: ClientResponse = await client.delete(`/user`);

	return {
		data,
	};
};

