import { Platform } from './platforms';
import { User } from './user';

export type UserPlatform = {
	id: number;
	name: string;
	user_id: number;
	platform_id: number;
	display_name?: string;
	avatar_url?: string;
	profile_data?: any;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date | null;
	user?: User;
	platform?: Platform;
};
