import { UserPlatform } from './user-platforms';

export type User = {
	id: number;
	name: string;
	email: string;
	password: string;
	avatar_url?: string;
	phone_number?: string;
	phone_country_code?: string;
	phone_dial_code?: string;
	cpf?: string;
	city?: string;
	country?: string;
	company_description?: string;
	company_file_id?: number;
	company_logo_url?: string; // Para exibição da imagem
	brand_color?: string;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date | null;
	user_platforms?: UserPlatform[];
	selected_platform?: UserPlatform;
};

// UpdateUserData é definido no schema de validação
