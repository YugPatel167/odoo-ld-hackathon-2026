'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_catalog', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('sightseeing', 'food', 'adventure', 'culture', 'other'),
        allowNull: false
      },
      estimated_cost: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING(500),
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

    await queryInterface.addIndex('activity_catalog', ['city_id'], { name: 'idx_activity_catalog_city_id' });
    await queryInterface.addIndex('activity_catalog', ['category'], { name: 'idx_activity_catalog_category' });
    await queryInterface.addIndex('activity_catalog', ['name'], { name: 'idx_activity_catalog_name' });

    // MySQL 8.0.16+ CHECK constraints
    await queryInterface.sequelize.query(`
      ALTER TABLE \`activity_catalog\` 
      ADD CONSTRAINT \`chk_act_cat_cost\` CHECK (\`estimated_cost\` >= 0),
      ADD CONSTRAINT \`chk_act_cat_duration\` CHECK (\`duration_minutes\` > 0);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_catalog');
  }
};
