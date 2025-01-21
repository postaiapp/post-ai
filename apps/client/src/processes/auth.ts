import client from "./api";
import { AuthLoginType, AuthRegisterType } from "@common/interfaces/auth";
import { ClientResponse } from "@common/interfaces/api";

export const login = async (filter: AuthLoginType) => {
	const { data, error }: ClientResponse = await client({
		method: 'POST',
		url: `/auth`,
		data: filter
	});

	return {
		data,
		error
	};
};

export const register = async (filter: AuthRegisterType) => {
	const { data, error }: ClientResponse = await client({
		method: 'POST',
		url: `/auth/register`,
		data: filter
	});

	return {
		data,
		error
	};
};
