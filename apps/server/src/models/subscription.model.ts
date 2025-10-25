import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '@models/user.model';
import { Plan } from '@models/plan.model';

@Table({
	tableName: 'subscriptions',
	timestamps: true,
	underscored: true,
})
export class Subscription extends Model {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		field: 'user_id',
	})
	user_id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'stripe_customer_id',
	})
	stripe_customer_id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
		field: 'stripe_subscription_id',
	})
	stripe_subscription_id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'stripe_price_id',
	})
	stripe_price_id: string;

	@ForeignKey(() => Plan)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		field: 'plan_id',
	})
	plan_id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	status: string;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		field: 'current_period_start',
	})
	current_period_start: Date;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		field: 'current_period_end',
	})
	current_period_end: Date;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		field: 'cancel_at_period_end',
	})
	cancel_at_period_end: boolean;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		field: 'trial_end',
	})
	trial_end?: Date;

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

	@BelongsTo(() => Plan)
	plan: Plan;
}
