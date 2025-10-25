'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('plans', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			stripe_product_id: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			key: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			features: {
				type: Sequelize.JSONB,
				allowNull: false,
			},
			is_public: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
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

		await queryInterface.addIndex('plans', ['stripe_product_id']);
		await queryInterface.addIndex('plans', ['key']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('plans');
	},
};
