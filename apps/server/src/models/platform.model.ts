import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { AuthToken } from '@models/auth-token.model';
import { UserPlatform } from '@models/user-platform.model';

@Table({
	tableName: 'platforms',
	timestamps: true,
	underscored: true,
})
export class Platform extends Model {
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
		allowNull: false,
		defaultValue: 'ACTIVE',
	})
	status: string;

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

	@HasMany(() => AuthToken)
	auth_tokens: AuthToken[];

	@HasMany(() => UserPlatform)
	user_platforms: UserPlatform[];
}
