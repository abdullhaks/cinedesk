import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/dbConnection';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import dns from 'dns';


 dns.setServers(['8.8.8.8', '1.1.1.1']);
// Load environment variables from config/.env
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', app: 'CINIDESK PRO', version: '1.0.0' });
});

// Swagger documentation (accessible at /apidocs and /api-docs)
const swaggerUiOptions = {
  customSiteTitle: 'CINIDESK PRO - Enterprise API Documentation',
  customCss: `
    .swagger-ui .topbar { background-color: #0f172a; border-bottom: 2px solid #6366f1; }
    .swagger-ui .topbar .topbar-wrapper .link span { display: inline-block; font-size: 20px; font-weight: 700; color: #fff; }
    .swagger-ui .info { margin: 25px 0; }
    .swagger-ui .info .title { font-size: 32px; color: #0f172a; }
    .swagger-ui .btn.authorize { background-color: #6366f1; color: #fff; border-color: #6366f1; font-weight: 600; border-radius: 6px; }
    .swagger-ui .btn.authorize svg { fill: #fff; }
    .swagger-ui .opblock.opblock-post { border-color: #10b981; background: rgba(16,185,129,0.05); }
    .swagger-ui .opblock.opblock-get { border-color: #3b82f6; background: rgba(59,130,246,0.05); }
    .swagger-ui .opblock.opblock-put { border-color: #f59e0b; background: rgba(245,158,11,0.05); }
    .swagger-ui .opblock.opblock-patch { border-color: #8b5cf6; background: rgba(139,92,246,0.05); }
    .swagger-ui .opblock.opblock-delete { border-color: #ef4444; background: rgba(239,68,68,0.05); }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    docExpansion: 'list',
  },
};

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/docs', (_req, res) => res.redirect('/apidocs'));

// API routes
app.use('/api', router);

// Global error handler (must be after routes)
app.use(errorHandler);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(port, () => {
    logger.info(`CINIDESK PRO is running on http://localhost:${port}`);
  });
});

export default app;
