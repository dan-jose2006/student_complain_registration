// Import the application factory that sets up Express, middleware, and route handlers
import { createApp } from './app';
// Import application configuration (ports, environment variables, API keys)
import { config } from './config';
// Import standardized logger utility for console and diagnostic outputs
import { logger } from './utils/logger';

// Instantiate the configured Express application
const app = createApp();

/**
 * Initializes and starts the HTTP server listening on the configured port.
 * Logs active environment details, service health, and integration statuses.
 */
const startServer = () => {
  // Listen for incoming network requests on the specified port
  app.listen(config.port, () => {
    // Print banner separator in server log
    logger.info(`=======================================================`);
    // Print startup message indicating which port the server is bound to
    logger.info(`🚀 CampusCare Backend Server running on port ${config.port}`);
    // Print local URL where the backend can be reached
    logger.info(`🌐 Backend URL: http://localhost:${config.port}`);
    // Print health check endpoint URL for easy verification
    logger.info(`📡 API Health:  http://localhost:${config.port}/api/health`);
    // Print expected frontend URL allowed for CORS communication
    logger.info(`💻 Frontend:    ${config.frontendUrl}`);
    // Report whether Groq AI API key is configured or falling back to local engine
    logger.info(`🤖 Groq AI:     ${config.groqApiKey ? 'Configured (Active)' : 'Local Heuristic Engine (Active)'}`);
    // Print closing banner separator in server log
    logger.info(`=======================================================`);
  });
};

// Execute startup sequence to bring up the server
startServer();

