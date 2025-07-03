/**
 * Authentication Hook - useAuth
 * 
 * This hook manages user authentication state and provides methods for:
 * - User login/logout
 * - User registration
 * - Authentication state management
 * - JWT token handling
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

/**
 * Interface for user login credentials
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface for user registration data
 */
interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
}

/**
 * Interface for authentication API responses
 */
interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

/**
 * Mock backend simulation for development environment
 * In production, this would be replaced with actual API calls
 */
const mockAuthenticationService = {
  /**
   * Simulate user login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication logic with updated password
    if (email === 'obada@gmail.com' && password === 'quds123456') {
      return {
        success: true,
        user: mockUsers[0],
        token: 'mock-jwt-token-12345',
        message: 'Login successful'
      };
    } else if (email === 'demo@fitcha.com' && password === 'demo123') {
      return {
        success: true,
        user: mockUsers[1],
        token: 'mock-jwt-token-67890',
        message: 'Login successful'
      };
    } else {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  },
  
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock signup logic
    if (userData.email === 'existing@gmail.com') {
      return {
        success: false,
        message: 'Email already exists'
      };
    }
    
    // Create new user based on signup data
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      headline: 'New Fitcha Member',
      location: userData.location,
      connections: 0,
      isOnline: true,
      verified: false,
      isPro: false,
      sports: ['Basketball'],
      skillLevel: 'Beginner',
      rating: 4.0,
      gamesPlayed: 0,
      winRate: 0,
      badges: [],
      availability: ['Evening']
    };
    
    return {
      success: true,
      user: newUser,
      token: 'mock-jwt-token-new-user',
      message: 'Account created successfully'
    };
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (parseError) {
        console.error('Error parsing stored user data:', parseError);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Use mock backend for development
      const data = await mockAuthenticationService.login(email, password);

      if (data.success && data.user) {
        // Store authentication token and user data
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update authentication state - THIS IS CRITICAL
        setUser(data.user);
        setIsAuthenticated(true);
        
        setIsLoading(false);
        return true;
      } else {
        // Handle authentication errors
        setError(data.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return false;
      }
    } catch (networkError) {
      // Handle network or server errors
      setError('Unable to connect to server. Please try again later.');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Use mock backend for development
      const data = await mockAuthenticationService.signup(userData);

      if (data.success && data.user) {
        // Store authentication token and user data
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update authentication state - THIS IS CRITICAL
        setUser(data.user);
        setIsAuthenticated(true);
        
        setIsLoading(false);
        return true;
      } else {
        // Handle signup errors
        setError(data.message || 'Signup failed. Please try again.');
        setIsLoading(false);
        return false;
      }
    } catch (networkError) {
      // Handle network or server errors
      setError('Unable to connect to server. Please try again later.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Clear all stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Reset authentication state
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    signup,
    clearError
  };
};