import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campuscare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('campuscare_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('campuscare_token');
      if (storedToken) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem('campuscare_user', JSON.stringify(profile));
        } catch (error) {
          console.error('Session restoration failed, clearing token:', error);
          localStorage.removeItem('campuscare_token');
          localStorage.removeItem('campuscare_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginPayload): Promise<User> => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('campuscare_token', result.token);
    localStorage.setItem('campuscare_user', JSON.stringify(result.user));
    return result.user;
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    const result = await authService.register(payload);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('campuscare_token', result.token);
    localStorage.setItem('campuscare_user', JSON.stringify(result.user));
    return result.user;
  };

  const logout = () => {
    localStorage.removeItem('campuscare_token');
    localStorage.removeItem('campuscare_user');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
