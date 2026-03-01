const rateLimit = require('express-rate-limit');
const config = require('../config');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests, please try again later.'
        }
    },
    standardHeaders: true
});

module.exports = { rateLimiter };
