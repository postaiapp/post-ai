'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('posts', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			caption: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			image_url: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			published_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			scheduled_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			canceled_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			creator_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			account_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'user_platforms',
					key: 'id',
				},
				allowNull: false,
			},
			external_id: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			code: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			failed_to_post: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			job_id: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn('NOW'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn('NOW'),
			},
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('posts');
	},
};
