const swaggerJsdoc = require('swagger-jsdoc');
const { version } = require('../../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Fans & ACs API Documentation',
      version,
      description: 'API documentation for the E-Commerce platform selling fans and air conditioners',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/swagger/*.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;