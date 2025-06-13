export type Platform = {
	id: number;
	name: string;
	status: 'ACTIVE' | 'PENDING';
	created_at: Date;
	updated_at: Date;
};
