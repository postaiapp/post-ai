import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '@models/user.model';
import { Platform } from '@models/platform.model';
import { AuthToken } from '@models/auth-token.model';

@Table({
	tableName: 'user_platforms',
	timestamps: true,
	underscored: true,
	paranoid: true,
})
export class UserPlatform extends Model {
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

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	user_id: number;

	@ForeignKey(() => Platform)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	platform_id: number;

	@ForeignKey(() => AuthToken)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	token_id: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	display_name: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	avatar_url: string;

	@Column({
		type: DataType.JSONB,
		allowNull: true,
	})
	profile_data: any;

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

	@BelongsTo(() => User)
	user: User;

	@BelongsTo(() => Platform)
	platform: Platform;

	@BelongsTo(() => AuthToken)
	auth_token: AuthToken;
}
