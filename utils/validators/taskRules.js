const { check } = require('express-validator');
const commonRules = require('./commonRules');
const { User } = require('../../models');
const { Project } = require('../../models');

// Custom validator to check if project_id exists in the projects table
const projectExists = async (value) => {
    const project = await Project.findByPk(value); // or findOne depending on your ORM
    if (!project) {
      throw new Error('Project does not exist');
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

const taskRules = {
    createTask: [
        commonRules.name,
        commonRules.description,
        commonRules.status,
        check('priority')
            .notEmpty().withMessage('Priority is required').bail()
            .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
        check('project_id')
            .notEmpty().withMessage('Project is required').bail()
            .custom(projectExists),
        check('assigned_to')
            .notEmpty().withMessage('Assignee is required').bail()
            .custom(userExists),
        check('due_date').optional().isISO8601().withMessage('Invalid due date')
    ],
    updateTask: [
        commonRules.name.optional(),
        commonRules.description.optional(),
        commonRules.status.optional(),
        check('priority').optional()
            .notEmpty().withMessage('Priority is required').bail()
            .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
        check('assigned_to').optional()
            .notEmpty().withMessage('Assignee is required').bail()
            .custom(userExists),
        check('due_date').optional().isISO8601().withMessage('Invalid due date')
    ],
};

module.exports = taskRules;