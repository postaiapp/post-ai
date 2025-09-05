import { StaticImageData } from 'next/image';
import { Control, UseFormHandleSubmit } from 'react-hook-form';

import { User } from './user';
import { UserPlatform } from './user-platforms';

export interface PostFormData {
	user_platform_id: number;
	caption: string;
	media_url: string;
	scheduled_at: string | null;
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
	loadingSubmit: boolean;
	selectedAccount?: UserPlatform;
	handleAccountChange: (account: UserPlatform) => void;
	user: User | null;
	caption: string;
	image: string;
	generateCaption: () => void;
	loadingCaption: boolean;
	getPlatformLogo: (platform: UserPlatform) => StaticImageData;
}

export interface PostEntity {
	id: number;
	caption: string;
	imageUrl: string;
	creatorId: number;
	accountId: number;
	publishedAt: string | null;
	scheduledAt: string | null;
	canceledAt: string | null;
	externalId: string;
	code: string;
	failedToPost: boolean | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface PostEntityWithDetails extends PostEntity {
	account: {
		id: number;
		name: string;
		user_id: number;
		platform_id: number;
		display_name: string;
		avatar_url: string;
		profile_data: {
			username: string;
			media_count: number;
			follows_count: number;
			followers_count: number;
			instagram_user_id: number;
		};
		created_at: string;
		updated_at: string;
		deleted_at: string | null;
		createdAt: string;
		updatedAt: string;
		deletedAt: string | null;
	};
}

// Interface mais simples para debug
export interface SimplePost {
	id: number;
	caption: string;
	imageUrl: string;
	publishedAt: string | null;
	scheduledAt: string | null;
	canceledAt: string | null;
	account: {
		profile_data: {
			username: string;
		};
		display_name: string;
		avatar_url: string;
	};
}
