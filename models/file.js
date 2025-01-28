'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      // File belongs to a task
      this.belongsTo(models.Task, { foreignKey: 'task_id' });

      // File is uploaded by a user
      this.belongsTo(models.User, { foreignKey: 'uploaded_by' });
    }
  }
  File.init(
    {
      task_id: DataTypes.BIGINT,
      uploaded_by: DataTypes.BIGINT,
      file_name: DataTypes.STRING,
      file_path: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'File',
    }
  );
  return File;
};
