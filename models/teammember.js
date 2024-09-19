'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeamMember extends Model {
    static associate(models) {
      // TeamMember belongs to a team
      this.belongsTo(models.Team, { foreignKey: 'team_id' });

      // TeamMember belongs to a user
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  TeamMember.init(
    {
      team_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      role_in_team: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'TeamMember',
    }
  );
  return TeamMember;
};
