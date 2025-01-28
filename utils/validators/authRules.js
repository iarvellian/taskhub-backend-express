const commonRules = require('./commonRules');

const authRules = {
    register: [
        commonRules.name,
        commonRules.email,
        commonRules.password
    ],
    login: [
        commonRules.email,
        commonRules.password
    ],
};

module.exports = authRules;