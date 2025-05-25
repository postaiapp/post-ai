import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister, UseFormReset } from 'react-hook-form';

export interface InstagramAccountType {
	id: string;
	username: string;
	password?: string;
}

export interface HeaderProps {
	accounts?: InstagramAccountType[];
	selectedAccount?: InstagramAccountType;
	handleAccountChange: (account: InstagramAccountType) => void;
	handleLogout: () => void;
	handleNavigateUserDetails: () => void;
}

type HeaderPropsInternal = {
	onSubmit: SubmitHandler<InstagramAccountType>;
	handleSubmit: UseFormHandleSubmit<InstagramAccountType>;
	register: UseFormRegister<InstagramAccountType>;
	errors: FieldErrors<InstagramAccountType>;
	isLoading: boolean;
	isLoginPending: boolean;
	reset: UseFormReset<InstagramAccountType>;
	accounts: InstagramAccountType[];
	modalOpen: boolean;
	setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export type { HeaderPropsInternal };
