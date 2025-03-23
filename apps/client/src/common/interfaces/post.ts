import { Control, UseFormHandleSubmit } from 'react-hook-form';

import { InstagramAccountStore } from './instagramAccount';
import { User } from './user';

export interface PostFormData {
	username: string;
	caption: string;
	img: string;
	post_date: string | null;
}

export interface PostDetailsUIProps {
	control: Control<PostFormData>;
	handleSubmit: UseFormHandleSubmit<PostFormData>;
	onSubmit: (data: PostFormData) => void;
	showCalendar: boolean;
	toggleCalendar: () => void;
	selectedDate: Date | undefined;
	handleDateChange: (date: Date | undefined) => void;
	selectedTime: string;
	handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	loading: boolean;
	loadingSubmit: boolean;
	selectedAccount?: InstagramAccountStore;
	handleAccountChange: (account: InstagramAccountStore) => void;
	user: User | null;
	caption: string;
	image: string;
}

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
	code: string; // for redirect to post
	createdAt: string;
	user: {
		name: string;
		email: string;
		profilePicUrl?: string;
	};
	account: {
		username: string;
		profilePicUrl?: string;
		fullName?: string;
		isPrivate?: boolean;
		isVerified?: boolean;
	};
	engagement?: {
		hasLiked: boolean;
		likes: number;
		comments: number;
	};
	comments?: {
		recent: Array<{
			text: string;
			user: {
				username: string;
				profile_pic_url: string;
				verified: boolean;
			};
			created_at: string;
			like_count: number;
			reply_count: number;
		}>;
		has_more: boolean;
	};
}
