/**
 * Base API URL determination:
 * In production, uses relative '/api' route so Vercel rewrites forward requests to the backend serverless function.
 * In development, reads VITE_API_URL from environment variables or falls back to 'http://localhost:3000/api'.
 */
const API_BASE = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

/**
 * Custom Error Class representing HTTP API errors.
 * Stores HTTP status code and optional validation error details.
 */
export class ApiError extends Error {
  statusCode: number; // HTTP response status code (e.g. 400, 401, 404, 500)
  errors?: any;       // Detailed field-level validation errors if supplied by server

  constructor(message: string, statusCode: number, errors?: any) {
    // Call parent Error constructor with message
    super(message);
    // Set error name identifier
    this.name = 'ApiError';
    // Assign status code
    this.statusCode = statusCode;
    // Assign error payload
    this.errors = errors;
  }
}

/**
 * Generic HTTP Request Client Utility
 * Automatically injects stored JWT bearer tokens and standard headers,
 * handles token eviction upon 401 unauthorized errors, and unpacks JSON responses.
 *
 * @param endpoint - API path (e.g. '/complaints') or absolute URL
 * @param options - Standard fetch RequestInit configuration (method, body, headers, etc.)
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Retrieve persisted authentication token from browser localStorage
  const token = localStorage.getItem('campuscare_token');

  // Initialize request headers defaulting to application/json
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // If auth token exists, append Authorization Bearer header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Construct absolute request URL if relative endpoint was passed
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    // Send asynchronous HTTP network fetch request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse incoming response body as JSON
    const data = await response.json();

    // Check if HTTP status indicates failure (status outside 200-299)
    if (!response.ok) {
      // If 401 Unauthorized occurs on an authenticated route, purge expired session tokens
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('campuscare_token');
        localStorage.removeItem('campuscare_user');
      }

      // Throw structured ApiError with server-provided error message or fallback text
      throw new ApiError(
        data.message || 'An error occurred while processing your request',
        response.status,
        data.errors
      );
    }

    // Return standardized nested data property or top-level payload
    return data.data !== undefined ? data.data : data;
  } catch (error: any) {
    // Re-throw if already an ApiError
    if (error instanceof ApiError) {
      throw error;
    }
    // Wrap generic network/fetch failures in ApiError with HTTP 500
    throw new ApiError(
      error.message || 'Network error. Please check your internet connection.',
      500
    );
  }
}

