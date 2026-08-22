'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActivityCatalog extends Model {
    static associate(models) {
      ActivityCatalog.belongsTo(models.City, {
        foreignKey: 'city_id',
        as: 'city',
        onDelete: 'CASCADE'
      });

      ActivityCatalog.hasMany(models.Activity, {
        foreignKey: 'activity_catalog_id',
        as: 'activities',
        onDelete: 'SET NULL'
      });
    }
  }

  ActivityCatalog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('sightseeing', 'food', 'adventure', 'culture', 'other'),
      allowNull: false,
      validate: {
        isIn: [['sightseeing', 'food', 'adventure', 'culture', 'other']]
      }
    },
    estimated_cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0
      }
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
      validate: {
        min: 1
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ActivityCatalog',
    tableName: 'activity_catalog',
    underscored: true,
    timestamps: true
  });

  return ActivityCatalog;
};
