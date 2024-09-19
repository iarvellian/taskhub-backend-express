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
      user_id: DataTypes.INTEGER,
      message: DataTypes.STRING,
      is_read: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Notification',
    }
  );
  return Notification;
};
