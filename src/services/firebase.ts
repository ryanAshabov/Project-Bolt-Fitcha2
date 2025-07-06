/**
 * Firebase Configuration and Initialization
 * 
 * This file contains the Firebase configuration and initialization.
 * It sets up Firebase services including Authentication, Firestore, and Storage.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  // Validate configuration values
  const configStatus = {
    apiKey: firebaseConfig.apiKey ? '✅ Present' : '❌ Missing',
    authDomain: firebaseConfig.authDomain ? '✅ Present' : '❌ Missing',
    projectId: firebaseConfig.projectId ? '✅ Present' : '❌ Missing',
    storageBucket: firebaseConfig.storageBucket ? '✅ Present' : '❌ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Present' : '❌ Missing',
    appId: firebaseConfig.appId ? '✅ Present' : '❌ Missing',
  };
  
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missing = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missing.length > 0) {
    console.error('❌ Missing Firebase configuration fields:', missing);
    console.error('📄 Please check your .env.local file');
    return false;
  }
  
  console.warn('✅ Firebase configuration validated successfully');
  return true;
};

// Validate configuration before initializing
if (!validateFirebaseConfig()) {
  throw new Error('Firebase configuration is incomplete. Please check your environment variables.');
}

console.warn('🚀 Initializing Firebase...');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

console.warn('✅ Firebase services initialized successfully');

// Note: Emulator connections disabled to use production Firebase services
// To enable emulators for development, uncomment the code below and start Firebase emulators
/*
if (import.meta.env.DEV) {
  // Only connect to emulators if not already connected
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error) {
    // Emulators already connected or not available
    console.log('Firebase emulators connection skipped:', error);
  }
}
*/

export default app;