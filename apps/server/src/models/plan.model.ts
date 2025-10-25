import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { PlanPrice } from '@models/plan-price.model';

@Table({
	tableName: 'plans',
	timestamps: true,
	underscored: true,
})
export class Plan extends Model {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
		field: 'stripe_product_id',
	})
	stripe_product_id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	key: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	description?: string;

	@Column({
		type: DataType.JSONB,
		allowNull: false,
	})
	features: object;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
		defaultValue: true,
		field: 'is_public',
	})
	is_public: boolean;

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

	@HasMany(() => PlanPrice)
	plan_prices: PlanPrice[];
}
