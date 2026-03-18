const rateLimit = require('express-rate-limit');
const { tError } = require('../utils/translator');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    // Use CF-Connecting-IP header for Cloudflare Tunnel, fallback to req.ip
    keyGenerator: (req) => {
        return req.headers['cf-connecting-ip'] || req.ip;
    },
    handler: (req, res) => {
        const lang = req.language || 'id';
        res.status(429).json({
            success: false,
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: tError('TOO_MANY_REQUESTS', lang)
            }
        });
    }
});

module.exports = { rateLimiter };
