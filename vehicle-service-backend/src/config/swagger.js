const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Service Management API',
      version: '1.0.0',
      description: 'API documentation for Vehicle Service Management System',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], // reads swagger comments from all route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
