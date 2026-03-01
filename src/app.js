const express = require('express');
const helmet = require('helmet');
const holidayRoutes = require('./routes/holidays');
const requestLogger = require('./middleware/requestLogger');
const { rateLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(rateLimiter);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/holidays', holidayRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/', (req, res) => {
    res.json({
        name: 'KapanLibur API',
        version: '1.0.0',
        description: 'API untuk informasi hari libur nasional Indonesia',
        author: 'Chrystalio (Kristoff)',
        endpoints: {
            holidays: '/v1/holidays',
            nextHoliday: '/v1/holidays/next',
            currentHoliday: '/v1/holidays/current',
            suggestions: '/v1/holidays/suggestions',
            healthCheck: '/health'
        }
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
