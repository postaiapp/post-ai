import { LoginSchema, RegisterSchema } from '@common/schemas/auth';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

type AuthLoginType = z.infer<typeof LoginSchema>;

type AuthLoginWithPlanType = AuthLoginType & {
	planKey: string | null;
};

interface AuthResponse {
	user: {
		id: number;
		name: string;
		email: string;
		avatar_url?: string;
		phone_number?: string;
		phone_country_code?: string;
		phone_dial_code?: string;
		city?: string;
		country?: string;
		company_description?: string;
		company_file_id?: number;
		brand_color?: string;
		created_at: string;
		updated_at: string;
		deleted_at?: string;
		user_platforms?: unknown[];
		subscription?: unknown;
	};
	token: string | null;
	hasActiveSubscription: boolean;
	checkoutUrl: string | null;
}

type AuthRegisterType = z.infer<typeof RegisterSchema>;

interface AuthCardProps {
	toggleAuthMode: () => void;
}

interface AuthContainerProps {
	toggleAuthMode: () => void;
	isRegister: boolean;
}

interface LoginCardProps {
	loading: boolean;
	register: UseFormRegister<AuthLoginType>;
	handleSubmit: UseFormHandleSubmit<AuthLoginType>;
	errors: FieldErrors<AuthLoginType>;
	onSubmit: SubmitHandler<AuthLoginType>;
	toggleAuthMode: () => void;
}
interface RegisterCardProps {
	loading: boolean;
	register: UseFormRegister<AuthRegisterType>;
	handleSubmit: UseFormHandleSubmit<AuthRegisterType>;
	errors: FieldErrors<AuthRegisterType>;
	onSubmit: SubmitHandler<AuthRegisterType>;
	toggleAuthMode: () => void;
}

export type { AuthResponse };

export type {
	AuthContainerProps,
	AuthLoginType,
	AuthLoginWithPlanType,
	AuthRegisterType,
	AuthCardProps,
	LoginCardProps,
	RegisterCardProps,
};
