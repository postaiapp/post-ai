'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('subscriptions', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			stripe_customer_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			stripe_subscription_id: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			stripe_price_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			plan_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'plans',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			current_period_start: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			current_period_end: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			cancel_at_period_end: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			trial_end: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});

		await queryInterface.addIndex('subscriptions', ['user_id']);
		await queryInterface.addIndex('subscriptions', ['stripe_customer_id']);
		await queryInterface.addIndex('subscriptions', ['stripe_subscription_id']);
		await queryInterface.addIndex('subscriptions', ['plan_id']);
		await queryInterface.addIndex('subscriptions', ['status']);
		await queryInterface.addIndex('subscriptions', ['current_period_end']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('subscriptions');
	},
};
