import { InstagramAccountSchema } from '@common/schemas/instagramAccount';
import { z } from 'zod';

interface InstagramAccountStore {
	userId: string;
	username: string;
	fullName?: string;
	biography?: string;
	followerCount: number;
	followingCount: number;
	postCount: number;
	profilePicUrl: string;
	lastLogin: Date;
	password: string;
	isPrivate?: boolean;
}

interface InstagramLogoutType {
	userName: string;
}

type InstagramAccountType = z.infer<typeof InstagramAccountSchema>;

export type { InstagramAccountStore, InstagramAccountType, InstagramLogoutType };
