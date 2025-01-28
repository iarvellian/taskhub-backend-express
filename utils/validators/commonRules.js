const { check } = require('express-validator');

const commonRules = {
    name: check('name').notEmpty().withMessage('Name is required'),
    email: check('email')
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage('Invalid email format'),
    password: check('password')
        .notEmpty().withMessage('Password is required').bail()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters').bail(),
    description: check('description').notEmpty().withMessage('Description is required'),
    status: check('status')
        .notEmpty().withMessage('Status is required').bail()
        .isIn(['to-do','in progress','done']).withMessage('Invalid status value'),
};

module.exports = commonRules;