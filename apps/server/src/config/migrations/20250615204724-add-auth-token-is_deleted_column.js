'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('auth_tokens', 'is_deleted', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('auth_tokens', 'is_deleted');
	},
};
