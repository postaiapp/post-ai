import { AxiosResponse } from "axios";

interface ClientResponse extends AxiosResponse {
	error: any;
}

export type { ClientResponse };
