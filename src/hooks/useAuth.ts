/**
 * Authentication Hook - useAuth
 * 
 * Complete Firebase Authentication integration with:
 * - Real-time Firebase Auth state management
 * - User login/logout with Firebase
 * - User registration with Firebase and Firestore
 * - Email verification
 * - Password reset functionality
 * - User profile creation and management
 * 
 * @author Fitcha Team
 * @version 3.0.0 - Complete Firebase Integration
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
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User } from '../types';

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
 * Helper function to convert Firebase User to our User type
 */
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
        avatar: firebaseUser.photoURL || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        headline: additionalData?.headline || 'New Fitcha Member',
        location: additionalData?.location || '',
        coordinates: additionalData?.coordinates,
        connections: 0,
        isOnline: true,
        verified: firebaseUser.emailVerified,
        isPro: false,
        sports: additionalData?.sports || ['Basketball'],
        skillLevel: additionalData?.skillLevel || 'Beginner',
        rating: 4.0,
        gamesPlayed: 0,
        winRate: 0,
        badges: additionalData?.badges || [],
        availability: additionalData?.availability || ['Evening'],
        trustScore: 75,
        achievements: additionalData?.achievements || [],
        preferences: {
          theme: 'light',
          notifications: {
            gameInvites: true,
            gameReminders: true,
            chatMessages: true,
            achievements: true,
            weatherAlerts: true,
            pushNotifications: true,
            emailNotifications: true
          },
          privacy: {
            showLocation: true,
            showOnlineStatus: true,
            allowGameInvites: 'everyone',
            showStatistics: true
          },
          gameDefaults: {
            preferredSports: ['Basketball'],
            skillLevel: 'Intermediate',
            maxDistance: 10,
            preferredTimes: ['Evening'],
            paymentPreference: 'both'
          }
        },
        socialLinks: {
          instagram: '',
          twitter: '',
          facebook: '',
          website: ''
        },
        statistics: {
          totalGames: 0,
          totalWins: 0,
          totalLosses: 0,
          averageRating: 4.0,
          favoriteTime: 'Evening',
          favoriteSport: 'Basketball',
          mostPlayedWith: [],
          monthlyGames: [],
          courtVisits: []
        },
        // Note: createdAt and updatedAt will be added separately as they're not part of User type
      };

      // Save user to Firestore with timestamps
      await setDoc(userDocRef, {
        ...newUserData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: firebaseUser.uid, ...newUserData } as User;
    }
  } catch (error) {
    console.error('Error creating/fetching user profile:', error);
    console.error('User ID:', firebaseUser.uid);
    console.error('User Email:', firebaseUser.email);
    
    const errorDetails = error as Error;
    console.error('Error details:', {
      name: errorDetails.name,
      message: errorDetails.message,
      stack: errorDetails.stack
    });
    
    throw new Error(`Failed to create user profile: ${errorDetails.message || 'Unknown error'}`);
  }
};

/**
 * Firebase Authentication Hook
 */
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
        } else {
          // User is signed out
          setFirebaseUser(null);
          setUser(null);
          setIsAuthenticated(false);
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

  /**
   * Login with email and password
   */
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

  /**
   * Register new user with email and password
   */
  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user profile in Firestore (handled by auth state change)
      // But we need to pass the additional data
      await createUserProfile(userCredential.user, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        location: userData.location
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

  /**
   * Logout user
   */
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

  /**
   * Send password reset email
   */
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

  /**
   * Resend email verification
   */
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

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Update user profile in Firestore
   */
  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) {
      setError('No user found to update.');
      return false;
    }

    try {
      const userDocRef = doc(db, 'users', user.id);
      await setDoc(userDocRef, {
        ...updates,
        updatedAt: serverTimestamp()
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
    signup,
    logout,
    resetPassword,
    resendEmailVerification,
    updateUserProfile,
    clearError
  };
};