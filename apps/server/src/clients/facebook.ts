import axios from 'axios';

import { CLOUD_API_VERSION } from '@/constants/meta';

const FacebookClient = axios.create({
	baseURL: `https://graph.facebook.com/${CLOUD_API_VERSION}`,
	headers: { 'Content-Type': 'application/json' },
});

const responseInterceptor = response => {
	console.log('GRAPH FACEBOOK API RESPONSE -> ', JSON.stringify(response.data, null, 4));
	return response;
};

const errorInterceptor = error => {
	const errorMessage = error.response?.data?.error || error.message;

	console.error('GRAPH FACEBOOK API ERROR -> ', JSON.stringify(errorMessage, null, 4));

	return Promise.reject(errorMessage);
};

FacebookClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default FacebookClient;
