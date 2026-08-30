import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/error';

// Import Routes
import authRoutes from './routes/auth.routes';
import complaintRoutes from './routes/complaint.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import healthRoutes from './routes/health.routes';

export const createApp = (): Application => {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: [config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);

  // Fallback 404 Handler
  app.use(notFoundHandler);

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
