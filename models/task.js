'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Task has many comments
      this.hasMany(models.Comment, { foreignKey: 'task_id' });

      // Task has many files
      this.hasMany(models.File, { foreignKey: 'task_id' });

      // Task belongs to a project
      this.belongsTo(models.Project, { foreignKey: 'project_id' });

      // Task belongs to a user (assigned_to)
      this.belongsTo(models.User, { foreignKey: 'assigned_to' });
    }
  }
  Task.init(
    {
      project_id: DataTypes.BIGINT,
      assigned_to: DataTypes.BIGINT,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('to-do', 'in progress', 'done'),
        defaultValue: 'to-do'
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
      },
      due_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );
  return Task;
};
