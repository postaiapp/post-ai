'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('users', 'company_description', {
			type: Sequelize.TEXT,
			allowNull: true,
		});

		await queryInterface.addColumn('users', 'company_file_id', {
			type: Sequelize.INTEGER,
			references: {
				model: 'files',
				key: 'id',
			},
			allowNull: true,
		});

		await queryInterface.addColumn('users', 'brand_color', {
			type: Sequelize.STRING,
			allowNull: true,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('users', 'company_description');
		await queryInterface.removeColumn('users', 'company_file_id');
		await queryInterface.removeColumn('users', 'brand_color');
	},
};
