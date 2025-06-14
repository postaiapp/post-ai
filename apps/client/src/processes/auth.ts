import { ClientResponse } from '@common/interfaces/api';
import { AuthLoginType, AuthRegisterType } from '@common/interfaces/auth';

import client from './api';

export const login = async (filter: AuthLoginType) => {
	const { data, error }: ClientResponse = await client({
		method: 'POST',
		url: `/auth`,
		data: filter,
	});

	return {
		data: data.data,
		error,
	};
};

export const register = async (filter: AuthRegisterType) => {
	const { data, error }: ClientResponse = await client({
		method: 'POST',
		url: `/auth/register`,
		data: filter,
	});

	return {
		data,
		error,
	};
};

export const refreshToken = async () => {
	const { data }: ClientResponse = await client.patch('/auth/refresh');

	return {
		data,
	};
};

export const logout = async () => {
	const { data }: ClientResponse = await client.delete('/auth/logout');

	return {
		data,
	};
};
