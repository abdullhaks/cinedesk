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
import dns from 'dns';


 dns.setServers(['8.8.8.8', '1.1.1.1']);
// Load environment variables from config/.env
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const app = express();
const port = process.env.PORT || 5000;

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

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
