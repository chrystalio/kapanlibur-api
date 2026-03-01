const express = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'KapanLibur API Docs',
    customCss: '.swagger-ui .topbar { display: none }'
}));

app.use('/v1/holidays', holidayRoutes);

const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
};

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: formatUptime(process.uptime())
    });
});

app.get('/', (req, res) => {
    res.json({
        name: 'KapanLibur API',
        version: '1.0.0',
        description: 'API untuk informasi hari libur nasional Indonesia',
        author: 'Chrystalio (Kristoff)',
        documentation: '/docs',
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
