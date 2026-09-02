// Import Express and Application type definition
import express, { Application } from 'express';
// Import Cross-Origin Resource Sharing middleware
import cors from 'cors';
// Import Helmet middleware for setting secure HTTP response headers
import helmet from 'helmet';
// Import application configuration constants
import { config } from './config';
// Import custom global error and 404 handler middlewares
import { errorHandler, notFoundHandler } from './middleware/error';

// Import route modules
import authRoutes from './routes/auth.routes';            // Authentication routes (login, register, me)
import complaintRoutes from './routes/complaint.routes';  // Student complaint management routes
import adminRoutes from './routes/admin.routes';          // Administrator management and dashboard routes
import aiRoutes from './routes/ai.routes';                // Groq AI issue categorization and insights routes
import healthRoutes from './routes/health.routes';        // Server health check route

/**
 * Application Factory Function
 * Configures and returns an Express application instance with security, parsing, and routes.
 */
export const createApp = (): Application => {
  // Initialize Express instance
  const app = express();

  // Security Middleware: Helmet secures HTTP headers against common web vulnerabilities
  app.use(helmet());

  // CORS Middleware: Controls which domains can communicate with this API
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman or server-to-server)
        if (!origin) return callback(null, true);

        // Define allowed domain regex patterns (localhost, 127.0.0.1, Vercel deployments)
        const allowedPatterns = [
          /^https?:\/\/localhost(:\d+)?$/,
          /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
          /^https:\/\/.*\.vercel\.app$/,
          /^https:\/\/softwareproject-zeta\.vercel\.app$/,
        ];

        // Also allow the configured FRONTEND_URL environment variable if set
        if (config.frontendUrl && origin === config.frontendUrl) {
          return callback(null, true);
        }

        // Test if the requesting origin matches any of the approved regular expressions
        const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));
        if (isAllowed) {
          // Allow cross-origin access
          callback(null, true);
        } else {
          // Reject cross-origin access
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      // Allow cookies and authorization headers in cross-origin requests
      credentials: true,
      // Allowed HTTP methods for API access
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      // Allowed request headers from clients
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing Middleware: Parse incoming JSON request payloads with 10MB limit
  app.use(express.json({ limit: '10mb' }));
  // Body Parsing Middleware: Parse URL-encoded form data with 10MB limit
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Mount API Sub-Routers
  app.use('/api/health', healthRoutes);        // Health check endpoint
  app.use('/api/auth', authRoutes);            // User registration and login
  app.use('/api/complaints', complaintRoutes); // Complaint submission and tracking
  app.use('/api/admin', adminRoutes);          // Administrator actions and metrics
  app.use('/api/ai', aiRoutes);                // AI assistant and analysis endpoints

  // Fallback 404 Handler for unmatched routes
  app.use(notFoundHandler);

  // Global Centralized Error Handler to catch all unhandled exceptions
  app.use(errorHandler);

  // Return the fully configured Express application
  return app;
};

// Default export of application factory
export default createApp;

