const { check } = require('express-validator');
const commonRules = require('./commonRules');
const { User } = require('../../models');

// Custom validator to check if user_id exists in the users table
const userExists = async (value) => {
    const user = await User.findByPk(value); // or findOne depending on your ORM
    if (!user) {
      throw new Error('User does not exist');
    }
    return true;
};

const teamRules = {
    createTeam: [
        commonRules.name,
        check('owner_id')
            .notEmpty().withMessage('Owner is required').bail()
            .custom(userExists)
    ],
    updateTeam: [
        commonRules.name.optional()
    ],
};

module.exports = teamRules;