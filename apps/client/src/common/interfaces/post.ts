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
