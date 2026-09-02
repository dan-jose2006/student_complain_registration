// Vercel Serverless Function entry point
// The createApp() call is at module level so it is only executed ONCE per cold start.
// Subsequent warm invocations reuse the same Express app instance, improving performance.
import { createApp } from '../backend/src/app';

// Create and export the Express app as the default Vercel handler
const app = createApp();

export default app;

