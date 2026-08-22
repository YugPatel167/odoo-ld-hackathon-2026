'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      City.hasMany(models.Stop, {
        foreignKey: 'city_id',
        as: 'stops',
        onDelete: 'RESTRICT'
      });

      City.hasMany(models.ActivityCatalog, {
        foreignKey: 'city_id',
        as: 'activityCatalog',
        onDelete: 'CASCADE'
      });
    }
  }

  City.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cost_index: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.0,
      validate: {
        min: 0
      }
    },
    popularity_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      validate: {
        min: 0,
        max: 100
      }
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'City',
    tableName: 'cities',
    underscored: true,
    timestamps: true
  });

  return City;
};
