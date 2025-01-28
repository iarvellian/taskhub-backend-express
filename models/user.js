'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User has many projects
      this.hasMany(models.Project, { foreignKey: 'owner_id' });

      // User has many tasks assigned
      this.hasMany(models.Task, { foreignKey: 'assigned_to' });

      // User can create many teams
      this.hasMany(models.Team, { foreignKey: 'created_by' });

      // User can comment on many tasks
      this.hasMany(models.Comment, { foreignKey: 'user_id' });

      // User can upload many files
      this.hasMany(models.File, { foreignKey: 'uploaded_by' });

      // User can have many notifications
      this.hasMany(models.Notification, { foreignKey: 'user_id' });

      // User can belong to many teams
      this.belongsToMany(models.Team, { through: models.TeamMember, foreignKey: 'user_id' });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
      role: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
