'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      // Activity log belongs to a user
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  ActivityLog.init(
    {
      user_id: DataTypes.INTEGER,
      activity_type: DataTypes.STRING,
      entity_id: DataTypes.INTEGER,
      entity_type: DataTypes.STRING,
      timestamp: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'ActivityLog',
    }
  );
  return ActivityLog;
};
