'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stop extends Model {
    static associate(models) {
      Stop.belongsTo(models.Trip, {
        foreignKey: 'trip_id',
        as: 'trip',
        onDelete: 'CASCADE'
      });

      Stop.belongsTo(models.City, {
        foreignKey: 'city_id',
        as: 'city',
        onDelete: 'RESTRICT'
      });

      Stop.hasMany(models.Activity, {
        foreignKey: 'stop_id',
        as: 'activities',
        onDelete: 'CASCADE'
      });
    }
  }

  Stop.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isAfterOrEqualStartDate(value) {
          if (this.start_date && value < this.start_date) {
            throw new Error('end_date must be greater than or equal to start_date');
          }
        }
      }
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Stop',
    tableName: 'stops',
    underscored: true,
    timestamps: true
  });

  return Stop;
};
