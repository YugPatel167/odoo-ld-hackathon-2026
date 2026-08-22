'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      stop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stops',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      activity_catalog_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'activity_catalog',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      custom_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cost: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60
      },
      scheduled_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    await queryInterface.addIndex('activities', ['stop_id'], { name: 'idx_activities_stop_id' });
    await queryInterface.addIndex('activities', ['activity_catalog_id'], { name: 'idx_activities_catalog_id' });

    // MySQL 8.0.16+ CHECK constraints
    await queryInterface.sequelize.query(`
      ALTER TABLE \`activities\` 
      ADD CONSTRAINT \`chk_activity_cost\` CHECK (\`cost\` >= 0),
      ADD CONSTRAINT \`chk_activity_duration\` CHECK (\`duration_minutes\` > 0);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activities');
  }
};
