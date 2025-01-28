const commonRules = require('./commonRules');

const userRules = {
    updateProfile: [
        commonRules.name.optional(),
        commonRules.email.optional(),
        commonRules.password.optional()
    ]
};

module.exports = userRules;