'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Task belongs to a project
      this.belongsTo(models.Project, { foreignKey: 'project_id' });

      // Task belongs to a user (assigned_to)
      this.belongsTo(models.User, { foreignKey: 'assigned_to' });

      // Task has many comments
      this.hasMany(models.Comment, { foreignKey: 'task_id' });

      // Task has many files
      this.hasMany(models.File, { foreignKey: 'task_id' });
    }
  }
  Task.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
      priority: DataTypes.STRING,
      due_date: DataTypes.DATE,
      project_id: DataTypes.INTEGER,
      assigned_to: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );
  return Task;
};
