'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Project has many tasks
      this.hasMany(models.Task, { foreignKey: 'project_id' });

      // Project belongs to a user (owner)
      this.belongsTo(models.User, { foreignKey: 'owner_id' });
    }
  }
  Project.init(
    {
      owner_id: DataTypes.BIGINT,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('to-do', 'in progress', 'done'),
        defaultValue: 'to-do'
      },
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Project',
    }
  );
  return Project;
};
