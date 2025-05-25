'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('user_platforms', {
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
			platform_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'platforms',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			token_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'auth_tokens',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			display_name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			avatar_url: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			profile_data: {
				type: Sequelize.JSONB,
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
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});

		await queryInterface.addIndex('user_platforms', ['token_id']);

		await queryInterface.addIndex('user_platforms', ['user_id', 'platform_id'], {
			unique: true,
			where: {
				deleted_at: null,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('user_platforms');
	},
};
