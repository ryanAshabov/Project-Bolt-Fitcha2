/**
 * Offline Sync Utilities for Fitcha Mobile
 * 
 * This file contains utilities for managing offline data and synchronization.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { reportError } from './errorReporting';
import { ErrorSeverity } from './errorReporting';

// Sync status
export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SYNCED = 'synced',
  ERROR = 'error',
}

// Offline data types
export enum OfflineDataType {
  COURTS = 'courts',
  GAMES = 'games',
  PROFILE = 'profile',
  MESSAGES = 'messages',
  NOTIFICATIONS = 'notifications',
}

// Sync queue item
interface SyncQueueItem {
  id: string;
  collection: string;
  operation: 'create' | 'update' | 'delete';
  data?: any;
  timestamp: number;
  attempts: number;
}

// Cache data with expiration
export const cacheData = async (key: string, data: any, expirationMinutes: number = 60) => {
  try {
    const item = {
      data,
      expiration: Date.now() + expirationMinutes * 60 * 1000,
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error caching data:', error);
    reportError(error as Error, ErrorSeverity.LOW, { action: 'cache_data', additionalData: { key } });
  }
};

// Get cached data
export const getCachedData = async (key: string) => {
  try {
    const cachedItem = await AsyncStorage.getItem(key);
    
    if (!cachedItem) return null;
    
    const item = JSON.parse(cachedItem);
    
    // Check if data is expired
    if (item.expiration < Date.now()) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    reportError(error as Error, ErrorSeverity.LOW, { action: 'get_cached_data', additionalData: { key } });
    return null;
  }
};

// Add item to sync queue
export const addToSyncQueue = async (item: Omit<SyncQueueItem, 'attempts' | 'timestamp'>) => {
  try {
    // Get current queue
    const queueString = await AsyncStorage.getItem('syncQueue');
    const queue: SyncQueueItem[] = queueString ? JSON.parse(queueString) : [];
    
    // Add new item to queue
    queue.push({
      ...item,
      timestamp: Date.now(),
      attempts: 0,
    });
    
    // Save updated queue
    await AsyncStorage.setItem('syncQueue', JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to sync queue:', error);
    reportError(error as Error, ErrorSeverity.MEDIUM, { action: 'add_to_sync_queue' });
  }
};

// Process sync queue
export const processSyncQueue = async (): Promise<SyncStatus> => {
  try {
    // Check network connection
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return SyncStatus.IDLE;
    }
    
    // Get current queue
    const queueString = await AsyncStorage.getItem('syncQueue');
    if (!queueString) {
      return SyncStatus.SYNCED;
    }
    
    const queue: SyncQueueItem[] = JSON.parse(queueString);
    if (queue.length === 0) {
      return SyncStatus.SYNCED;
    }
    
    // Process queue items
    const updatedQueue: SyncQueueItem[] = [];
    let syncStatus = SyncStatus.SYNCED;
    
    for (const item of queue) {
      try {
        // Skip items that have been attempted too many times
        if (item.attempts >= 5) {
          continue;
        }
        
        // Process based on operation type
        switch (item.operation) {
          case 'create':
            await setDoc(doc(db, item.collection, item.id), {
              ...item.data,
              updatedAt: serverTimestamp(),
              createdAt: serverTimestamp(),
            });
            break;
            
          case 'update':
            await updateDoc(doc(db, item.collection, item.id), {
              ...item.data,
              updatedAt: serverTimestamp(),
            });
            break;
            
          case 'delete':
            // For delete operations, we don't need to do anything as they're handled separately
            break;
        }
      } catch (error) {
        // If operation failed, increment attempts and keep in queue
        updatedQueue.push({
          ...item,
          attempts: item.attempts + 1,
        });
        
        syncStatus = SyncStatus.ERROR;
        console.error('Error processing sync item:', error);
        reportError(error as Error, ErrorSeverity.MEDIUM, { 
          action: 'process_sync_queue', 
          additionalData: { item } 
        });
      }
    }
    
    // Save updated queue
    await AsyncStorage.setItem('syncQueue', JSON.stringify(updatedQueue));
    
    return syncStatus;
  } catch (error) {
    console.error('Error processing sync queue:', error);
    reportError(error as Error, ErrorSeverity.HIGH, { action: 'process_sync_queue' });
    return SyncStatus.ERROR;
  }
};

// Cache user profile
export const cacheUserProfile = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      await cacheData('userProfile', userDoc.data(), 1440); // Cache for 24 hours
    }
  } catch (error) {
    console.error('Error caching user profile:', error);
    reportError(error as Error, ErrorSeverity.MEDIUM, { action: 'cache_user_profile' });
  }
};

// Cache courts data
export const cacheCourts = async () => {
  try {
    const courtsQuery = query(collection(db, 'courts'));
    const courtsSnapshot = await getDocs(courtsQuery);
    
    const courts = courtsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    await cacheData('courts', courts, 60); // Cache for 1 hour
  } catch (error) {
    console.error('Error caching courts:', error);
    reportError(error as Error, ErrorSeverity.MEDIUM, { action: 'cache_courts' });
  }
};

// Cache user games
export const cacheUserGames = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    // Get games created by user
    const createdGamesQuery = query(
      collection(db, 'games'),
      where('creatorId', '==', currentUser.uid)
    );
    const createdGamesSnapshot = await getDocs(createdGamesQuery);
    
    // Get games user is participating in
    const participatingGamesQuery = query(
      collection(db, 'games'),
      where('participants', 'array-contains', currentUser.uid)
    );
    const participatingGamesSnapshot = await getDocs(participatingGamesQuery);
    
    // Combine and deduplicate games
    const gamesMap = new Map();
    
    createdGamesSnapshot.docs.forEach(doc => {
      gamesMap.set(doc.id, {
        id: doc.id,
        ...doc.data(),
      });
    });
    
    participatingGamesSnapshot.docs.forEach(doc => {
      if (!gamesMap.has(doc.id)) {
        gamesMap.set(doc.id, {
          id: doc.id,
          ...doc.data(),
        });
      }
    });
    
    const games = Array.from(gamesMap.values());
    
    await cacheData('userGames', games, 30); // Cache for 30 minutes
  } catch (error) {
    console.error('Error caching user games:', error);
    reportError(error as Error, ErrorSeverity.MEDIUM, { action: 'cache_user_games' });
  }
};

// Clear all cached data
export const clearCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => 
      key.startsWith('courts') || 
      key.startsWith('games') || 
      key.startsWith('profile') || 
      key.startsWith('messages') || 
      key.startsWith('notifications')
    );
    
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
    reportError(error as Error, ErrorSeverity.MEDIUM, { action: 'clear_cache' });
  }
};

// Initialize offline sync
export const initializeOfflineSync = async () => {
  // Set up network change listener
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      processSyncQueue();
    }
  });
  
  // Cache essential data
  await Promise.all([
    cacheUserProfile(),
    cacheCourts(),
    cacheUserGames(),
  ]);
};