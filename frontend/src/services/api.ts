const API_BASE =
  import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL?.startsWith('http') ? import.meta.env.VITE_API_URL : '/api')
    : (import.meta.env.VITE_API_URL || '/api');

export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('campuscare_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // If 401 Unauthorized, token might be expired
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('campuscare_token');
        localStorage.removeItem('campuscare_user');
      }

      throw new ApiError(
        data.message || 'An error occurred while processing your request',
        response.status,
        data.errors
      );
    }

    return data.data !== undefined ? data.data : data;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network error. Please check your internet connection.',
      500
    );
  }
}
