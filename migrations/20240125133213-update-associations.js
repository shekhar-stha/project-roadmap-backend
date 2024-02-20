'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add changes to update associations
    await queryInterface.createTable('ProjectUsers', {
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Add changes to revert associations
    await queryInterface.dropTable('ProjectUsers');
  },
};
