'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('auth_tokens', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			user_platform_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'user_platforms',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			access_token: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			expires_at: {
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

		await queryInterface.addIndex('auth_tokens', ['user_platform_id']);

		await queryInterface.addIndex('auth_tokens', ['access_token']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('auth_tokens');
	},
};
