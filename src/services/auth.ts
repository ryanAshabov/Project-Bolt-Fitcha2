/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations including
 * user registration, login, logout, and profile management.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

/**
 * Interface for user registration data
 */
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
}

/**
 * Interface for authentication response
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Register a new user with email and password
 * 
 * @param userData - User registration data
 * @returns Promise<AuthResponse>
 */
export const registerUser = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    // Create user with Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const firebaseUser = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(firebaseUser, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    // Create user document in Firestore
    const newUser: Omit<User, 'id'> = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=3B82F6&color=fff`,
      headline: 'New Fitcha Member',
      location: userData.location,
      connections: 0,
      isOnline: true,
      verified: false,
      isPro: false,
      sports: ['Basketball'], // Default sport
      skillLevel: 'Beginner',
      rating: 4.0,
      gamesPlayed: 0,
      winRate: 0,
      badges: [],
      availability: ['Evening'],
      trustScore: 80,
      achievements: [],
      preferences: {
        theme: 'light',
        notifications: {
          gameInvites: true,
          gameReminders: true,
          chatMessages: true,
          achievements: true,
          weatherAlerts: true,
          pushNotifications: true,
          emailNotifications: false
        },
        privacy: {
          showLocation: true,
          showOnlineStatus: true,
          allowGameInvites: 'everyone',
          showStatistics: true
        },
        gameDefaults: {
          preferredSports: ['Basketball'],
          skillLevel: 'Beginner',
          maxDistance: 10,
          preferredTimes: ['Evening'],
          paymentPreference: 'both'
        }
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
      }
    };

    // Save user to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Return the complete user object
    const completeUser: User = {
      id: firebaseUser.uid,
      ...newUser
    };

    return {
      success: true,
      user: completeUser
    };

  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Sign in user with email and password
 * 
 * @param email - User email
 * @param password - User password
 * @returns Promise<AuthResponse>
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Sign in with Firebase Auth
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    
    // Update last login time and online status
    await updateDoc(doc(db, 'users', firebaseUser.uid), {
      isOnline: true,
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const user: User = {
      id: firebaseUser.uid,
      ...userData
    } as User;

    return {
      success: true,
      user
    };

  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Sign out the current user
 * 
 * @returns Promise<boolean>
 */
export const logoutUser = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    
    // Update online status before signing out
    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        isOnline: false,
        lastSeenAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Get current user data from Firestore
 * 
 * @param uid - User ID
 * @returns Promise<User | null>
 */
export const getCurrentUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    return {
      id: uid,
      ...userData
    } as User;

  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

/**
 * Update user profile
 * 
 * @param uid - User ID
 * @param updates - Profile updates
 * @returns Promise<boolean>
 */
export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

/**
 * Convert Firebase Auth error codes to user-friendly messages
 * 
 * @param errorCode - Firebase error code
 * @returns User-friendly error message
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email or try logging in.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address. Please check and try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An error occurred. Please try again.';
  }
};

/**
 * Check if user is authenticated
 * 
 * @returns Promise<boolean>
 */
export const isAuthenticated = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};