'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trips', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cover_photo_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      share_token: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
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

    await queryInterface.addIndex('trips', ['user_id'], { name: 'idx_trips_user_id' });
    await queryInterface.addIndex('trips', ['share_token'], { name: 'idx_trips_share_token', unique: true });
    await queryInterface.addIndex('trips', ['is_public'], { name: 'idx_trips_is_public' });

    // MySQL 8.0.16+ CHECK constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE \`trips\` 
      ADD CONSTRAINT \`chk_trips_dates\` CHECK (\`end_date\` >= \`start_date\`);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trips');
  }
};
