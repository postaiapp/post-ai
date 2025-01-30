import { Session } from '@schemas/token';

export type InstagramAccount = {
	_id?: string;
	userId: string;
	username: string;
	fullName: string;
	biography: string;
	followerCount: number;
	followingCount: number;
	postCount: number;
	profilePicUrl: string;
	lastLogin: Date;
	isPrivate?: boolean;
	isVerified?: boolean;
	session: Session;
};
