import { warningToast } from "@utils/toast";
import axios, { AxiosResponse, AxiosError } from "axios";
import { redirect } from "next/navigation";

const client = axios.create({ baseURL: "http://localhost:3333" });

const TokenInterceptor = (config: any) => {
	const token = localStorage.getItem("token");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
};


const ResponseInterceptor = async (response: AxiosResponse) => {
	const newToken = response.data?.token;

	if (newToken) {
		localStorage.setItem("token", newToken);
	}

	return response;
};


const ErrorInterceptor = (error: AxiosError) => {
	if (!error.response) {
		return Promise.resolve({
			data: null,
			error: "Erro ao se comunicar com o servidor."
		});
	}

	const statusCode = error.response?.status;
	const url = error.response?.config?.url;

	if (error.message === "Network Error") {
	  	warningToast("Sem conexão com a internet.");
	}

	if ([401, 403].includes(statusCode) && !url?.includes("/auth")) {
	  	localStorage.clear();
	  	redirect("/auth");
	}

	return Promise.resolve({
		data: null,
		error: error.response.data || error.message
	});
  };


client.interceptors.request.use(TokenInterceptor);
client.interceptors.response.use(ResponseInterceptor, ErrorInterceptor);

export default client;
