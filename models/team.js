'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Team is created by a user
      this.belongsTo(models.User, { foreignKey: 'created_by' });

      // Team has many members (users)
      this.belongsToMany(models.User, { through: models.TeamMember, foreignKey: 'team_id' });
    }
  }
  Team.init(
    {
      created_by: DataTypes.BIGINT,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Team',
    }
  );
  return Team;
};
