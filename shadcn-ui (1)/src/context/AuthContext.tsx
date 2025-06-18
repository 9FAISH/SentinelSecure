// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials } from '../types';
import { loginUser, verify2FA, logoutUser, getCurrentUser } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{
    requires2FA: boolean;
    user?: User;
    error?: string;
  }>;
  verify2FA: (code: string) => Promise<{
    token?: string;
    user?: User;
    error?: string;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const result = await loginUser(username, password);
      
      if (result.user && !result.requires2FA) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      return {
        requires2FA: false,
        error: 'Login failed. Please try again.',
      };
    }
  };

  const verify2FACode = async (code: string) => {
    try {
      const result = await verify2FA(code);
      
      if (result.user && result.token) {
        setUser(result.user);
        localStorage.setItem('auth_token', result.token);
      }
      
      return result;
    } catch (error) {
      console.error('2FA verification failed:', error);
      return {
        error: '2FA verification failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if logout API fails
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    verify2FA: verify2FACode,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};