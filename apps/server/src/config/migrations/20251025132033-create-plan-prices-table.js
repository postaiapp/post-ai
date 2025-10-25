'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('plan_prices', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
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
				onDelete: 'CASCADE',
			},
			stripe_price_id: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			currency: {
				type: Sequelize.STRING(3),
				allowNull: false,
				defaultValue: 'BRL',
			},
			interval: {
				type: Sequelize.ENUM('month', 'year'),
				allowNull: false,
			},
			amount: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: 'Amount in cents (e.g., 9900 = R$ 99.00)',
			},
			trial_days: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
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

		await queryInterface.addIndex('plan_prices', ['plan_id']);
		await queryInterface.addIndex('plan_prices', ['stripe_price_id']);
		await queryInterface.addIndex('plan_prices', ['currency', 'interval']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('plan_prices');
	},
};
