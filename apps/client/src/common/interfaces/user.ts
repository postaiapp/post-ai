import { InstagramAccountStore } from './instagramAccount';

export type User = {
	_id: string;
	name: string;
	email: string;
	InstagramAccounts: InstagramAccountStore[];
};

export type UpdateUserData = {
	name: string;
	email: string;
	cpf: string;
	phone: string;
	city: string;
	country: string;
};
