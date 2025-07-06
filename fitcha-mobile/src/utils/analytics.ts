/**
 * Analytics Utilities for Fitcha Mobile
 * 
 * This file contains utilities for tracking app usage and user behavior.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

// Event types
export enum AnalyticsEvent {
  APP_OPEN = 'app_open',
  SCREEN_VIEW = 'screen_view',
  SEARCH = 'search',
  COURT_VIEW = 'court_view',
  COURT_BOOK = 'court_book',
  GAME_CREATE = 'game_create',
  GAME_JOIN = 'game_join',
  USER_PROFILE_VIEW = 'user_profile_view',
  MESSAGE_SEND = 'message_send',
  FEATURE_USE = 'feature_use',
  ERROR = 'error',
}

// Track event in Firestore
export const trackEvent = async (
  eventName: AnalyticsEvent,
  properties?: Record<string, any>
) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    // Don't track events if user has opted out
    const analyticsEnabled = await AsyncStorage.getItem('analyticsEnabled');
    if (analyticsEnabled === 'false') return;
    
    // Log event to Firestore
    const eventData = {
      userId: currentUser.uid,
      eventName,
      properties: properties || {},
      timestamp: serverTimestamp(),
      platform: Platform.OS,
      appVersion: Platform.OS === 'ios' 
        ? Platform.constants.reactNativeVersion 
        : Platform.Version,
    };
    
    // Update user analytics in Firestore
    const userAnalyticsRef = doc(db, 'userAnalytics', currentUser.uid);
    await updateDoc(userAnalyticsRef, {
      [`eventCounts.${eventName}`]: increment(1),
      lastActive: serverTimestamp(),
    });
    
    // Log to console in development
    if (__DEV__) {
      console.log('Analytics event:', eventName, properties);
    }
  } catch (error) {
    // Silently fail in production, log in development
    if (__DEV__) {
      console.error('Error tracking event:', error);
    }
  }
};

// Track screen view
export const trackScreenView = (screenName: string) => {
  trackEvent(AnalyticsEvent.SCREEN_VIEW, { screenName });
};

// Track search
export const trackSearch = (query: string, filters?: Record<string, any>) => {
  trackEvent(AnalyticsEvent.SEARCH, { query, filters });
};

// Track court view
export const trackCourtView = (courtId: string, courtName: string) => {
  trackEvent(AnalyticsEvent.COURT_VIEW, { courtId, courtName });
};

// Track court booking
export const trackCourtBook = (
  courtId: string, 
  courtName: string, 
  date: string, 
  timeSlot: string,
  price: number
) => {
  trackEvent(AnalyticsEvent.COURT_BOOK, { 
    courtId, 
    courtName, 
    date, 
    timeSlot,
    price,
  });
};

// Track game creation
export const trackGameCreate = (
  gameType: string,
  location: string,
  participantCount: number,
  isPaid: boolean
) => {
  trackEvent(AnalyticsEvent.GAME_CREATE, {
    gameType,
    location,
    participantCount,
    isPaid,
  });
};

// Track game join
export const trackGameJoin = (gameId: string, gameType: string) => {
  trackEvent(AnalyticsEvent.GAME_JOIN, { gameId, gameType });
};

// Track feature use
export const trackFeatureUse = (featureName: string, details?: Record<string, any>) => {
  trackEvent(AnalyticsEvent.FEATURE_USE, { featureName, ...details });
};

// Track error
export const trackError = (errorCode: string, errorMessage: string, context?: Record<string, any>) => {
  trackEvent(AnalyticsEvent.ERROR, { errorCode, errorMessage, context });
};

// Opt out of analytics
export const optOutOfAnalytics = async () => {
  await AsyncStorage.setItem('analyticsEnabled', 'false');
};

// Opt in to analytics
export const optInToAnalytics = async () => {
  await AsyncStorage.setItem('analyticsEnabled', 'true');
};

// Check if analytics is enabled
export const isAnalyticsEnabled = async (): Promise<boolean> => {
  const analyticsEnabled = await AsyncStorage.getItem('analyticsEnabled');
  return analyticsEnabled !== 'false'; // Default to true if not set
};