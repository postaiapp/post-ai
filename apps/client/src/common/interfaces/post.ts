import { InstagramAccountStore } from "./instagramAccount";

export interface PostEntity {
	_id: string;
	caption: string;
	imageUrl: string;
	userId: string;
	accountId: string;
	publishedAt: Date;
	scheduledAt: Date;
	canceledAt?: Date;
	jobId?: string;
}

export interface PostEntityWithDetails extends PostEntity {
	user: {
		name: string;
		email: string;
		profilePicUrl: string;
	};
	account: {
		username: InstagramAccountStore['username'];
		profilePicUrl: InstagramAccountStore['profilePicUrl'];
	};
}
