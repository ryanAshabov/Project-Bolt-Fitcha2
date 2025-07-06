/**
 * Authentication Context for Fitcha Mobile
 * 
 * This context provides authentication state and functions throughout the app.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth as useFirebaseAuth } from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth context type
type AuthContextType = ReturnType<typeof useFirebaseAuth> & {
  // Add any additional auth-related state or functions here
};

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuth();
  
  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const initializeAuthState = async () => {
      try {
        const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
        // Note: This is just for initial UI state. The actual auth state
        // will be determined by Firebase Auth in the useAuth hook.
      } catch (error) {
        console.error('Error initializing auth state:', error);
      }
    };
    
    initializeAuthState();
  }, []);
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};