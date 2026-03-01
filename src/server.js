const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
    console.log(`🚀 KapanLibur API running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Health check: http://localhost:${config.port}/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received, shutting down...`);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
