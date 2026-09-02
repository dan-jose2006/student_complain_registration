// Import dotenv library to load environment variables from a .env file into process.env
import dotenv from 'dotenv';
// Import Node.js path module for working with file and directory paths
import path from 'path';

// Load environment variables from the root .env file relative to this file's location
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Centralized Application Configuration Object
 * Provides typed access with safe defaults for server, database, security, and external services.
 */
export const config = {
  // HTTP server port number where backend runs (default: 3000)
  port: parseInt(process.env.PORT || '3000', 10),
  // Current runtime environment ('development', 'production', or 'test')
  nodeEnv: process.env.NODE_ENV || 'development',
  // Allowed Frontend Client URL used for cross-origin requests
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // Secret key used to sign and verify JWT authentication tokens
  jwtSecret: process.env.JWT_SECRET || 'campuscare-super-secret-jwt-key-change-in-production-2026',
  // Duration for which a generated JWT auth token remains valid
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // PostgreSQL / Supabase connection string for Prisma ORM
  databaseUrl: process.env.DATABASE_URL || '',
  // Groq Cloud API key for Llama 3 LLM operations
  groqApiKey: process.env.GROQ_API_KEY || '',
  // Groq model identifier used for complaint analysis and reframing
  groqModel: process.env.GROQ_MODEL || 'llama3-8b-8192',
  // Supabase project URL
  supabaseUrl: process.env.SUPABASE_URL || '',
  // Supabase public anonymous API key for client operations
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  // Supabase service role secret key for administrative tasks
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

