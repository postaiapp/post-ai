import { User } from '@models/user.model';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserPlatform } from './user-platform.model';

@Table({
	tableName: 'posts',
	timestamps: true,
	paranoid: true,
	underscored: true,
})
export class Post extends Model {
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
	caption: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'image_url',
	})
	imageUrl: string;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		field: 'published_at',
	})
	publishedAt: Date;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		field: 'scheduled_at',
	})
	scheduledAt: Date;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		field: 'canceled_at',
	})
	canceledAt: Date;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		field: 'creator_id',
	})
	creatorId: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'account_id',
	})
	accountId: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
		field: 'external_id',
	})
	externalId: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	code: string;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: true,
		field: 'failed_to_post',
	})
	failedToPost: boolean;

	@Column({
		type: DataType.STRING,
		allowNull: true,
		field: 'job_id',
	})
	jobId: string;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
		field: 'created_at',
	})
	createdAt: Date;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
		field: 'updated_at',
	})
	updatedAt: Date;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		field: 'deleted_at',
	})
	deletedAt: Date;

	@BelongsTo(() => User, {
		as: 'creator',
		foreignKey: 'creatorId',
	})
	creator: User;

	@BelongsTo(() => UserPlatform, {
		as: 'account',
		foreignKey: 'accountId',
	})
	account: UserPlatform;
}
