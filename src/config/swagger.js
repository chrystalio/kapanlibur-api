const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KapanLibur API',
            version: '1.0.0',
            description: 'API untuk informasi hari libur nasional Indonesia',
            contact: {
                name: 'Chrystalio (Kristoff)',
                url: 'https://kristoff.my.id'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'https://kapanliburapi.kristoff.my.id',
                description: 'Production server'
            },
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'object',
                            properties: {
                                code: {
                                    type: 'string',
                                    example: 'INVALID_DATE'
                                },
                                message: {
                                    type: 'string',
                                    example: 'Date must be YYYY-MM-DD'
                                }
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Holidays',
                description: 'Holiday data and suggestions'
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
