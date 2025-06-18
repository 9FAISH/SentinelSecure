// src/lib/auth.ts
import { User } from '../types';

// Mock API functions - these would connect to actual backend in production

export async function loginUser(username: string, password: string): Promise<{
  token?: string;
  user?: User;
  requires2FA: boolean;
  error?: string;
}> {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication
    if (username === 'admin' && password === 'password') {
      // Mock user data
      const user: User = {
        id: '1',
        username: 'admin',
        email: 'admin@sentinelsecure.com',
        role: 'admin',
        twoFactorEnabled: true
      };
      
      return {
        requires2FA: true,
        user,
      };
    } else {
      return {
        requires2FA: false,
        error: 'Invalid username or password',
      };
    }
  } catch (error) {
    return {
      requires2FA: false,
      error: 'Authentication failed. Please try again.',
    };
  }
}

export async function verify2FA(code: string): Promise<{
  token?: string;
  user?: User;
  error?: string;
}> {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock verification - in real app, this would verify the code
    if (code === '123456') {
      // Mock user data
      const user: User = {
        id: '1',
        username: 'admin',
        email: 'admin@sentinelsecure.com',
        role: 'admin',
        twoFactorEnabled: true
      };
      
      const token = 'mock-jwt-token-would-be-provided-by-backend';
      
      return {
        token,
        user,
      };
    } else {
      return {
        error: 'Invalid 2FA code',
      };
    }
  } catch (error) {
    return {
      error: 'Verification failed. Please try again.',
    };
  }
}

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, you would invalidate the token on the backend
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getCurrentUser(): Promise<{
  user?: User;
  error?: string;
}> {
  try {
    // Retrieve token from storage
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return { error: 'No authentication token found' };
    }
    
    // Simulate API call to validate token and get current user
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock user data
    const user: User = {
      id: '1',
      username: 'admin',
      email: 'admin@sentinelsecure.com',
      role: 'admin',
      twoFactorEnabled: true
    };
    
    return { user };
  } catch (error) {
    return { error: 'Failed to fetch user information' };
  }
}