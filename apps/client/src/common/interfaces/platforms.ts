export type Platform = {
	id: number;
	name: string;
	status: 'ACTIVE' | 'PENDING';
	created_at: Date;
	updated_at: Date;
};

export type PlatformIcon = {
	id: number;
	label: string;
	key: string;
	icon: React.ReactNode;
	enabled: boolean;
};
