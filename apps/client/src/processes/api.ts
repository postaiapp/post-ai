import { localStorageClear, localStorageGetKey, localStorageSet } from '@utils/storage';
import { warningToast } from '@utils/toast';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';

const client = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

const TokenInterceptor = (config: any) => {
	const token = localStorageGetKey('token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
};

const ResponseInterceptor = async (response: AxiosResponse) => {
	const newToken = response.data?.token;

	if (newToken) {
		localStorageSet('token', newToken);
	}

	return response;
};

const ErrorInterceptor = async (error: AxiosError) => {
	if (!error.response) {
		return Promise.resolve({
			data: null,
			error: 'Erro ao se comunicar com o servidor.',
		});
	}

	const statusCode = error.response?.status;

	if (error.message === 'Network Error') {
		warningToast('Sem conexão com a internet.');
	}

	if ([401, 403].includes(statusCode)) {
		localStorageClear();
		return redirect('/auth');
	}

	return Promise.reject(error.response?.data || error.message);
};

client.interceptors.request.use(TokenInterceptor);
client.interceptors.response.use(ResponseInterceptor, ErrorInterceptor);

export default client;
