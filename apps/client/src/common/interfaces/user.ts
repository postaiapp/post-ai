import { UserPlatform } from './user-platforms';

export type User = {
	id: number;
	name: string;
	email: string;
	password: string;
	avatar_url?: string;
	phone_number?: string;
	phone_country_code?: string;
	phone_dial_code?: string;
	city?: string;
	country?: string;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date | null;
	user_platforms?: UserPlatform[];
	selected_platform?: UserPlatform;
};

export type UpdateUserData = {
	name: string;
	email: string;
	phone_number?: string;
	phone_country_code?: string;
	phone_dial_code?: string;
	city?: string;
	country?: string;
};
