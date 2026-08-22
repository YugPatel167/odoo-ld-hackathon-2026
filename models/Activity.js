'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.Stop, {
        foreignKey: 'stop_id',
        as: 'stop',
        onDelete: 'CASCADE'
      });

      Activity.belongsTo(models.ActivityCatalog, {
        foreignKey: 'activity_catalog_id',
        as: 'catalogItem',
        onDelete: 'SET NULL'
      });
    }

    /**
     * Helper to get effective name (either custom_name or from catalog)
     */
    getEffectiveName() {
      if (this.custom_name) return this.custom_name;
      if (this.catalogItem && this.catalogItem.name) return this.catalogItem.name;
      return 'Unnamed Activity';
    }
  }

  Activity.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    stop_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activity_catalog_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    custom_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cost: {
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
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities',
    underscored: true,
    timestamps: true
  });

  return Activity;
};
