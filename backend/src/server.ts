import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const app = createApp();

const startServer = () => {
  app.listen(config.port, () => {
    logger.info(`=======================================================`);
    logger.info(`🚀 CampusCare Backend Server running on port ${config.port}`);
    logger.info(`🌐 Backend URL: http://localhost:${config.port}`);
    logger.info(`📡 API Health:  http://localhost:${config.port}/api/health`);
    logger.info(`💻 Frontend:    ${config.frontendUrl}`);
    logger.info(`🤖 Groq AI:     ${config.groqApiKey ? 'Configured (Active)' : 'Local Heuristic Engine (Active)'}`);
    logger.info(`=======================================================`);
  });
};

startServer();
