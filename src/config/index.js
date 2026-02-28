require('dotenv').config();

const config = {
    port: parseInt(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config;
