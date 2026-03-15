const { tError } = require('../utils/translator');

function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    const lang = req.language || 'id';
    let statusCode = err.statusCode || 500;
    let code = err.code || 'INTERNAL_ERROR';

    if (err.name === 'SyntaxError' && err.status === 400) {
        statusCode = 400;
        code = 'INVALID_JSON';
    }

    const message = tError(code, lang);

    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
}

function notFoundHandler(req, res) {
    const lang = req.language || 'id';
    const message = tError('NOT_FOUND', lang);

    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message
        },
        ...(process.env.NODE_ENV === 'development' && {
            method: req.method,
            path: req.originalUrl || req.url
        })
    });
}

module.exports = { errorHandler, notFoundHandler };
