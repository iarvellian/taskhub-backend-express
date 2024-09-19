'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Project belongs to a user (owner)
      this.belongsTo(models.User, { foreignKey: 'owner_id' });

      // Project has many tasks
      this.hasMany(models.Task, { foreignKey: 'project_id' });
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
      owner_id: DataTypes.INTEGER,
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
