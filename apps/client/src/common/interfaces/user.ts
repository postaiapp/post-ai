import { InstagramAccountStore } from './instagramAccount';

export type User = {
	_id: string;
	name: string;
	email: string;
	InstagramAccounts: InstagramAccountStore[];
};
