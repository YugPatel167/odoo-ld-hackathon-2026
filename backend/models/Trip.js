'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    static associate(models) {
      Trip.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE'
      });

      Trip.hasMany(models.Stop, {
        foreignKey: 'trip_id',
        as: 'stops',
        onDelete: 'CASCADE'
      });
    }
  }

  Trip.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cover_photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    share_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Trip',
    tableName: 'trips',
    underscored: true,
    timestamps: true
  });

  return Trip;
};
