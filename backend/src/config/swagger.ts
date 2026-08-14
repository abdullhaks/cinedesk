import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Film Production Management Platform API (CINIDESK PRO)',
      version: '1.0.0',
      description:
        'Enterprise RBAC-driven film production management system supporting contractor onboarding, production management, location booking, fund approvals, costume assignment, audit logs, and in-app notifications.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Local Server',
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
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
