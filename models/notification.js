'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Notification belongs to a user
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Notification.init(
    {
      user_id: DataTypes.BIGINT,
      title: DataTypes.STRING,
      message: DataTypes.TEXT,
      is_read: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
      },
    },
    {
      sequelize,
      modelName: 'Notification',
    }
  );
  return Notification;
};
