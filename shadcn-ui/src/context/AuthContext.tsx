import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials } from '../types';
import { loginUser, verify2FA as apiVerify2FA, getCurrentUser } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ requires2FA: boolean; error?: string; tempUserData?: any }>;
  logout: () => Promise<void>;
  verify2FA: (code: string, tempUserData: any) => Promise<{ user?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    username: 'admin',
    email: 'admin@sentinelsecure.com',
    role: 'admin',
    twoFactorEnabled: false // Set to false to bypass 2FA
  });
  const [isLoading, setIsLoading] = useState(false);

  // No need for useEffect to check user if we are always authenticated
  /*
  useEffect(() => {
    const checkUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser || null);
      setIsLoading(false);
    };
    checkUser();
  }, []);
  */

  const login = async (credentials: LoginCredentials) => {
    // Simulate successful login without actual auth
    setUser({
      id: '1',
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      role: 'admin',
      twoFactorEnabled: false
    });
    return { requires2FA: false };
  };

  const logout = async () => {
    // Simulate logout
    setUser(null);
  };

  const verify2FA = async (code: string, tempUserData: any) => {
    // Simulate 2FA success
    setUser(tempUserData || {
      id: '1',
      username: 'admin',
      email: 'admin@sentinelsecure.com',
      role: 'admin',
      twoFactorEnabled: false
    });
    return { user: user as User };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, verify2FA }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 