'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Comment belongs to a task
      this.belongsTo(models.Task, { foreignKey: 'task_id' });

      // Comment belongs to a user
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Comment.init(
    {
      task_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
