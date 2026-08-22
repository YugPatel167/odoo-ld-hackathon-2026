'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stops', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      trip_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'trips',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      order_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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

    await queryInterface.addIndex('stops', ['trip_id'], { name: 'idx_stops_trip_id' });
    await queryInterface.addIndex('stops', ['city_id'], { name: 'idx_stops_city_id' });
    await queryInterface.addIndex('stops', ['trip_id', 'order_index'], { name: 'idx_stops_trip_order' });

    // MySQL 8.0.16+ CHECK constraints
    await queryInterface.sequelize.query(`
      ALTER TABLE \`stops\` 
      ADD CONSTRAINT \`chk_stops_dates\` CHECK (\`end_date\` >= \`start_date\`),
      ADD CONSTRAINT \`chk_stops_order\` CHECK (\`order_index\` >= 0);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stops');
  }
};
