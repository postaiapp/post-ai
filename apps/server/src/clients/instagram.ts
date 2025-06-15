import axios from 'axios';

const InstagramClient = axios.create({
	baseURL: 'https://graph.instagram.com',
	headers: { 'Content-Type': 'application/json' },
});

const responseInterceptor = response => {
	console.log('INSTAGRAM API RESPONSE -> ', JSON.stringify(response.data, null, 4));
	return response;
};

const errorInterceptor = error => {
	const errorMessage = error.response?.data?.error || error.message;

	console.error('INSTAGRAM API ERROR -> ', JSON.stringify(errorMessage, null, 4));

	return Promise.reject(errorMessage);
};

InstagramClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default InstagramClient;
