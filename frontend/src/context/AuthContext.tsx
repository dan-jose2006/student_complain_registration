// Import React hooks and types for managing context, state, and side-effects
import React, { createContext, useContext, useState, useEffect } from 'react';
// Import User interface definition
import { User } from '../types';
// Import authService API wrapper and payload types
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

/**
 * Interface defining the shape of Authentication Context values and functions.
 */
interface AuthContextType {
  user: User | null;                                    // Currently authenticated user object or null
  token: string | null;                                 // Stored JWT authorization token or null
  loading: boolean;                                     // Flag indicating whether session restoration is in progress
  login: (credentials: LoginPayload) => Promise<User>;  // Handles sign-in and token persistence
  register: (payload: RegisterPayload) => Promise<User>;// Handles user account creation
  logout: () => void;                                   // Clears stored user session and tokens
  isAuthenticated: boolean;                             // True if user and token both exist
  isAdmin: boolean;                                     // True if authenticated user has ADMIN role
  isStudent: boolean;                                   // True if authenticated user has STUDENT role
}

// Create React context for authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * Wraps application components to provide authentication state and actions.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize user state from localStorage if previously stored
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campuscare_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Initialize JWT token state from localStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('campuscare_token');
  });

  // Loading state indicating if the app is currently checking for active sessions
  const [loading, setLoading] = useState<boolean>(true);

  // Run on mount to validate stored token against backend /me endpoint
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('campuscare_token');
      if (storedToken) {
        try {
          // Fetch current verified user profile from backend
          const profile = await authService.getMe();
          setUser(profile);
          // Sync fresh profile into localStorage
          localStorage.setItem('campuscare_user', JSON.stringify(profile));
        } catch (error) {
          // If token verification fails (expired or invalid), clear localStorage and state
          console.error('Session restoration failed, clearing token:', error);
          localStorage.removeItem('campuscare_token');
          localStorage.removeItem('campuscare_user');
          setUser(null);
          setToken(null);
        }
      }
      // Completed initial authentication check
      setLoading(false);
    };

    // Execute authentication initialization
    initAuth();
  }, []);

  /**
   * Log in user with credentials, save session to state and localStorage.
   */
  const login = async (credentials: LoginPayload): Promise<User> => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('campuscare_token', result.token);
    localStorage.setItem('campuscare_user', JSON.stringify(result.user));
    return result.user;
  };

  /**
   * Register a new user, automatically saving token and user upon successful creation.
   */
  const register = async (payload: RegisterPayload): Promise<User> => {
    const result = await authService.register(payload);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('campuscare_token', result.token);
    localStorage.setItem('campuscare_user', JSON.stringify(result.user));
    return result.user;
  };

  /**
   * Clear user credentials and session from memory and localStorage.
   */
  const logout = () => {
    localStorage.removeItem('campuscare_token');
    localStorage.removeItem('campuscare_user');
    setUser(null);
    setToken(null);
  };

  // Helper boolean flags for quick conditional rendering
  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  // Render context provider passing down authentication state and helpers
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom React Hook to conveniently consume AuthContext.
 * Throws an error if used outside an AuthProvider hierarchy.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

