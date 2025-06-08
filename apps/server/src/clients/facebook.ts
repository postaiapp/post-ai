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
	console.error(
		'GRAPH FACEBOOK API ERROR -> ',
		JSON.stringify(error.response?.data || error.message, null, 4),
	);
	return Promise.reject(error);
};

FacebookClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default FacebookClient;
