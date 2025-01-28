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

const projectRules = {
    createProject: [
        commonRules.name,
        commonRules.description,
        commonRules.status,
        check('owner_id')
            .notEmpty().withMessage('Owner is required').bail()
            .custom(userExists),
        check('start_date').optional().isISO8601().withMessage('Invalid start date'),
        check('end_date').optional().isISO8601().withMessage('Invalid due date'),
    ],
    updateProject: [
        commonRules.name.optional(),
        commonRules.description.optional(),
        commonRules.status.optional(),
        check('owner_id').optional()
            .notEmpty().withMessage('Owner is required').bail()
            .custom(userExists),
        check('start_date').optional().isISO8601().withMessage('Invalid start date'),
        check('end_date').optional().isISO8601().withMessage('Invalid due date'),
    ],
};

module.exports = projectRules;