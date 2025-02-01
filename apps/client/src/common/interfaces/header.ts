import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister, UseFormReset } from 'react-hook-form';

import { InstagramAccountStore, InstagramAccountType } from './instagramAccount';

type HeaderProps = {
	onSubmit: SubmitHandler<InstagramAccountType>;
	handleSubmit: UseFormHandleSubmit<InstagramAccountType>;
	register: UseFormRegister<InstagramAccountType>;
	errors: FieldErrors<InstagramAccountType>;
	isLoading: boolean;
	isLoginPending: boolean;
	reset: UseFormReset<{
		username: string;
		password: string;
	}>;
	accounts: InstagramAccountStore[];
	handleLogout: (username: string) => void;
	modalOpen: boolean;
	setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export type { HeaderProps };
