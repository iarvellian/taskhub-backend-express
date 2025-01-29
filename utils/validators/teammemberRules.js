const { check } = require('express-validator');
const { Team } = require('../../models');
const { User } = require('../../models');

// Custom validator to check if team_id exists in the teams table
const teamExists = async (value) => {
    const team = await Team.findByPk(value); // or findOne depending on your ORM
    if (!team) {
      throw new Error('Team does not exist');
    }
    return true;
};

// Custom validator to check if user_id exists in the users table
const userExists = async (value) => {
    const user = await User.findByPk(value); // or findOne depending on your ORM
    if (!user) {
      throw new Error('User does not exist');
    }
    return true;
};

const teammemberRules = {
    createTeammember: [
        check('team_id')
            .notEmpty().withMessage('Team is required').bail()
            .custom(teamExists),
        check('user_id')
            .notEmpty().withMessage('User is required').bail()
            .custom(userExists),
        check('role_in_team').optional(),
    ],
    updateTeammember: [
        check('role_in_team').optional(),
    ],
};

module.exports = teammemberRules;