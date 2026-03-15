const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerSpec = require('./config/swagger');
const holidayRoutes = require('./routes/holidays');
const languageHandler = require('./middleware/languageHandler');
const requestLogger = require('./middleware/requestLogger');
const { rateLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(cors());
app.use(rateLimiter);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Language detection (must be before routes)
app.use(languageHandler);

app.get('/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.get('/docs', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>KapanLibur API Docs</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
        .swagger-ui .topbar { display: none; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/docs/swagger.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 1,
                persistAuthorization: true
            });
            window.ui = ui;
        };
    </script>
</body>
</html>
    `);
});

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
        uptime: formatUptime(process.uptime()),
        language: req.language
    });
});

app.get('/', (req, res) => {
    res.json({
        name: 'KapanLibur API',
        version: '1.1.0',
        description: 'API untuk informasi hari libur nasional Indonesia',
        description_en: 'API for Indonesian national holiday information',
        author: 'Chrystalio (Kristoff)',
        documentation: '/docs',
        language: req.language,
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
