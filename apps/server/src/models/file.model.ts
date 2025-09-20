import { User } from '@models';
import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';

@Table({
	tableName: 'files',
	timestamps: true,
	underscored: true,
	paranoid: true,
	createdAt: 'created_at',
	deletedAt: 'deleted_at',
	updatedAt: false,
})
export class File extends Model {
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
	})
	url: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	type: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	size: number;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	user_id: number;

	@Column({
		type: DataType.DATE,
		allowNull: true,
	})
	created_at: Date;

	@Column({
		type: DataType.DATE,
		allowNull: true,
	})
	deleted_at: Date;

	@BelongsTo(() => User)
	user: User;
}
