import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Plan } from '@models/plan.model';

@Table({
	tableName: 'plan_prices',
	timestamps: true,
	underscored: true,
})
export class PlanPrice extends Model {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

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
		unique: true,
		field: 'stripe_price_id',
	})
	stripe_price_id: string;

	@Column({
		type: DataType.STRING(3),
		allowNull: false,
		defaultValue: 'BRL',
	})
	currency: string;

	@Column({
		type: DataType.ENUM('month', 'year'),
		allowNull: false,
	})
	interval: 'month' | 'year';

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		comment: 'Amount in cents (e.g., 9900 = R$ 99.00)',
	})
	amount: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		defaultValue: 0,
		field: 'trial_days',
	})
	trial_days: number;

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

	@BelongsTo(() => Plan)
	plan: Plan;
}
