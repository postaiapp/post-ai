import { warningToast } from "@utils/toast";
import axios, { AxiosResponse, AxiosError } from "axios";
import { redirect } from "next/navigation";

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

const TokenInterceptor = (config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const ResponseInterceptor = async (response: AxiosResponse) => {
  const newToken = response.headers["new-bearer-token"];

  if (newToken) {
    localStorage.setItem("new-bearer-token", newToken);
  }

  return Promise.resolve({ data: response.data.data });
};

const ErrorInterceptor = (error: AxiosError) => {
  if (!error.response) {
    return Promise.resolve({
      error: "Erro ao se comunicar com o servidor."
    });
  }

  const statusCode = error.response?.status;
  const url = error.response?.config?.url;

  if (error.message === "Network Error") {
    warningToast("Sem conexão com a internet.");
  }

  if ([401, 403].includes(statusCode) && !url?.includes("/auth/login")) {
    localStorage.clear();
    redirect("/login");
  }

  return Promise.resolve({
    error: error.response ? error.response.data : error.message
  });
};

client.interceptors.request.use(TokenInterceptor);
client.interceptors.response.use(ResponseInterceptor, ErrorInterceptor);

export default client;
