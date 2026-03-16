const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KapanLibur API',
            version: '1.1.0',
            description: `
                API untuk informasi hari libur nasional Indonesia.

                **Indonesian Holiday API**

                Provides comprehensive data on national holidays, religious observances, and collective leave (cuti bersama) days in Indonesia.

                ## Language Support

                The API supports **Indonesian (id)** and **English (en)** languages.

                Use the \`lang\` query parameter to specify your preferred language:

                * \`?lang=id\` - Indonesian (default)
                * \`?lang=en\` - English

                Or use the \`Accept-Language\` header.
            `,
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
                url: 'https://kapanlibur-api.krisdev.my.id',
                description: 'Production server'
            }
        ],
        components: {
            parameters: {
                Lang: {
                    name: 'lang',
                    in: 'query',
                    description: 'Language preference for response content',
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['en', 'id'],
                        default: 'id'
                    },
                    example: 'en'
                }
            },
            schemas: {
                Holiday: {
                    type: 'object',
                    description: 'A holiday object with bilingual support',
                    properties: {
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Holiday date in ISO format',
                            example: '2026-01-01'
                        },
                        day: {
                            type: 'string',
                            description: 'Day of the week (translated based on lang parameter)',
                            example: 'Thursday'
                        },
                        name: {
                            type: 'string',
                            description: 'Holiday name (translated based on lang parameter)',
                            example: "New Year's Day 2026"
                        },
                        is_joint: {
                            type: 'boolean',
                            description: 'Whether this is a collective leave (cuti bersama) day',
                            example: false
                        }
                    }
                },
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
                                    description: 'Translated error message based on lang parameter',
                                    example: 'Date must be in YYYY-MM-DD format'
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
                description: 'Holiday data endpoints with bilingual support'
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
