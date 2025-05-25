import {
	Column,
	Model,
	Table,
	DataType,
	ForeignKey,
	BelongsTo,
	HasOne,
} from 'sequelize-typescript';
import { User } from '@models/user.model';
import { Platform } from '@models/platform.model';
import { UserPlatform } from '@models/user-platform.model';

@Table({
	tableName: 'auth_tokens',
	timestamps: true,
	underscored: true,
})
export class AuthToken extends Model {
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

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	access_token: string;

	@Column({
		type: DataType.DATE,
		allowNull: true,
	})
	expires_at: Date;

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

	@BelongsTo(() => User)
	user: User;

	@BelongsTo(() => Platform)
	platform: Platform;

	@HasOne(() => UserPlatform)
	user_platform: UserPlatform;
}
