import {
	Column,
	Model,
	Table,
	DataType,
	HasMany,
	HasOne,
	Scopes,
	ForeignKey,
} from 'sequelize-typescript';
import { UserPlatform } from '@models/user-platform.model';
import { File } from '@models';

@Scopes(() => ({
	withAccounts: {
		include: {
			model: UserPlatform,
			as: 'user_platforms',
		},
	},
	withFile: {
		include: {
			model: File,
			as: 'company_file',
		},
	},
}))
@Table({
	tableName: 'users',
	timestamps: true,
	underscored: true,
	paranoid: true,
})
export class User extends Model {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING,
		unique: true,
		allowNull: false,
	})
	email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	password: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	avatar_url?: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	phone_number?: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	phone_country_code?: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	phone_dial_code?: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	city?: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	country?: string;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	company_description?: string;

	@ForeignKey(() => File)
	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	company_file_id?: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	brand_color?: string;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
		field: 'created_at',
	})
	created_at!: Date;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
		field: 'updated_at',
	})
	updated_at!: Date;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		field: 'deleted_at',
	})
	deleted_at!: Date | null;

	@HasMany(() => UserPlatform)
	user_platforms: UserPlatform[];

	@HasOne(() => File, {
		foreignKey: 'id',
		sourceKey: 'company_file_id',
		as: 'company_file',
	})
	company_file: File;
}
