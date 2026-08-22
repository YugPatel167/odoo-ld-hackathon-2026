'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cost_index: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      popularity_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50
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

    await queryInterface.addIndex('cities', ['name'], { name: 'idx_cities_name' });
    await queryInterface.addIndex('cities', ['country'], { name: 'idx_cities_country' });
    await queryInterface.addIndex('cities', ['popularity_score'], { name: 'idx_cities_popularity' });

    // MySQL 8.0.16+ CHECK constraints
    await queryInterface.sequelize.query(`
      ALTER TABLE \`cities\` 
      ADD CONSTRAINT \`chk_city_cost_index\` CHECK (\`cost_index\` >= 0),
      ADD CONSTRAINT \`chk_city_popularity\` CHECK (\`popularity_score\` >= 0 AND \`popularity_score\` <= 100);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cities');
  }
};
