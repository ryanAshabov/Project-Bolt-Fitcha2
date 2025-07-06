/**
 * Firebase Configuration for Fitcha Mobile App
 * 
 * This file contains the Firebase configuration and initialization for the mobile app.
 * It uses the same project as the web app to ensure data consistency across platforms.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Firebase configuration from environment variables or Constants
const firebaseConfig = {
  apiKey: "AIzaSyDO77qHLuBcKhal6SYDb2xepEJnSWEDQUU",
  authDomain: "fitcha-3483c.firebaseapp.com",
  projectId: "fitcha-3483c",
  storageBucket: "fitcha-3483c.firebasestorage.app",
  messagingSenderId: "189896981747",
  appId: "1:189896981747:web:b65e7d4fb0430487838b86",
  measurementId: ""
};

// Initialize Firebase if it hasn't been initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  
  // Log initialization in development
  if (__DEV__) {
    console.log('Firebase initialized successfully');
  }
} else {
  app = getApp();
}

// Initialize Auth with AsyncStorage persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence for Firestore (mobile only)
if (Platform.OS !== 'web') {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required for persistence
        console.warn('Firestore persistence not supported in this environment');
      }
    });
}

// Initialize Storage
const storage = getStorage(app);

// Initialize Functions
const functions = getFunctions(app);

export { app, auth, db, storage, functions };