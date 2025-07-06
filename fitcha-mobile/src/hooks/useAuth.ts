/**
 * Authentication Hook for Fitcha Mobile
 * 
 * This hook provides authentication functionality using Firebase Auth
 * and manages user profiles in Firestore.
 */

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

// User type
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  headline?: string;
  location?: string;
  verified: boolean;
  isPro: boolean;
  [key: string]: any;
}

// Auth constants
const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  DEFAULT_AVATAR: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  DEFAULT_TRUST_SCORE: 75,
  DEFAULT_RATING: 4.0,
};

// Signup data interface
interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
}

// Create user profile in Firestore
const createUserProfile = async (firebaseUser: FirebaseUser, additionalData?: Partial<User>): Promise<User> => {
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  
  try {
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Return existing user data from Firestore
      return { id: firebaseUser.uid, ...userDoc.data() } as User;
    } else {
      // Create new user profile in Firestore
      const newUserData: Omit<User, 'id'> = {
        firstName: additionalData?.firstName || firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: additionalData?.lastName || firebaseUser.displayName?.split(' ')[1] || '',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || AUTH_CONSTANTS.DEFAULT_AVATAR,
        headline: additionalData?.headline || 'New Fitcha Member',
        location: additionalData?.location || '',
        verified: firebaseUser.emailVerified,
        isPro: false,
        sports: additionalData?.sports || ['Basketball'],
        skillLevel: additionalData?.skillLevel || 'Beginner',
        rating: AUTH_CONSTANTS.DEFAULT_RATING,
        gamesPlayed: 0,
        winRate: 0,
        badges: additionalData?.badges || [],
        availability: additionalData?.availability || ['Evening'],
        trustScore: AUTH_CONSTANTS.DEFAULT_TRUST_SCORE,
      };

      // Save user to Firestore with timestamps
      await setDoc(userDocRef, {
        ...newUserData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return { id: firebaseUser.uid, ...newUserData } as User;
    }
  } catch (error) {
    console.error('Error creating/fetching user profile:', error);
    throw new Error(`Failed to create user profile: ${(error as Error).message || 'Unknown error'}`);
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time Firebase Auth state listener
  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          setFirebaseUser(firebaseUser);
          
          // Get or create user profile in Firestore
          const userProfile = await createUserProfile(firebaseUser);
          setUser(userProfile);
          setIsAuthenticated(true);
          
          // Store auth state in AsyncStorage for persistence
          await AsyncStorage.setItem('isAuthenticated', 'true');
        } else {
          // User is signed out
          setFirebaseUser(null);
          setUser(null);
          setIsAuthenticated(false);
          
          // Clear auth state in AsyncStorage
          await AsyncStorage.removeItem('isAuthenticated');
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Firebase Auth state change will automatically handle user setup
      return true;
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = 'Login failed. Please try again.';
      
      switch (authError.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = authError.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Login with biometrics
  const loginWithBiometrics = async (): Promise<boolean> => {
    try {
      // Check if biometrics is available
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        setError('Biometric authentication is not available on this device');
        return false;
      }
      
      // Check if biometrics is enrolled
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setError('No biometrics enrolled on this device');
        return false;
      }
      
      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with biometrics',
        fallbackLabel: 'Use password',
      });
      
      if (result.success) {
        // Get stored credentials from secure storage
        const email = await AsyncStorage.getItem('userEmail');
        const password = await AsyncStorage.getItem('userPassword');
        
        if (email && password) {
          return await login(email, password);
        } else {
          setError('Biometric login setup required. Please login with email and password first.');
          return false;
        }
      } else {
        setError('Biometric authentication failed');
        return false;
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      setError('Biometric login failed');
      return false;
    }
  };

  // Register new user with email and password
  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password,
      );

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user profile in Firestore
      await createUserProfile(userCredential.user, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        location: userData.location,
      });

      return true;
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (authError.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        default:
          errorMessage = authError.message || 'Registration failed. Please try again.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Logout user
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await signOut(auth);
      // Firebase Auth state change will automatically handle state reset
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send password reset email
  const resetPassword = async (email: string): Promise<boolean> => {
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = 'Failed to send reset email.';
      
      switch (authError.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        default:
          errorMessage = authError.message || 'Failed to send reset email.';
      }
      
      setError(errorMessage);
      return false;
    }
  };

  // Resend email verification
  const resendEmailVerification = async (): Promise<boolean> => {
    if (!firebaseUser) {
      setError('No user found to send verification email.');
      return false;
    }

    try {
      await sendEmailVerification(firebaseUser);
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message || 'Failed to send verification email.');
      return false;
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Update user profile in Firestore
  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) {
      setError('No user found to update.');
      return false;
    }

    try {
      const userDocRef = doc(db, 'users', user.id);
      await setDoc(userDocRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update profile. Please try again.');
      return false;
    }
  };

  return {
    user,
    firebaseUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithBiometrics,
    signup,
    logout,
    resetPassword,
    resendEmailVerification,
    updateUserProfile,
    clearError,
  };
};