/**
 * Activities Service
 * 
 * This service handles all activity-related operations including
 * creating activities, joining, searching, and managing participants.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { ActivitySession } from '../types';

/**
 * Interface for activity filters
 */
export interface ActivityFilters {
  type?: string;
  category?: string;
  skillLevel?: string;
  location?: string;
  date?: string;
  isPaid?: boolean;
  status?: string;
}

/**
 * Database version of ActivitySession with string arrays for participants
 */
interface ActivitySessionDB extends Omit<ActivitySession, 'currentParticipants' | 'waitingList' | 'creator'> {
  creator: string;
  currentParticipants: string[];
  waitingList: string[];
}

/**
 * Create a new activity session
 * 
 * @param activityData - Activity data
 * @param creatorId - Creator user ID
 * @returns Promise<string> - New activity ID
 */
export const createActivity = async (
  activityData: Omit<ActivitySession, 'id' | 'currentParticipants' | 'waitingList' | 'paymentStatus' | 'chatId' | 'createdAt' | 'updatedAt'>,
  creatorId: string,
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activityData,
      creator: creatorId,
      currentParticipants: [creatorId], // Creator automatically joins
      waitingList: [],
      paymentStatus: {},
      chatId: '', // Will be created separately
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw new Error('Failed to create activity');
  }
};

/**
 * Get activities with optional filters
 * 
 * @param filters - Search filters
 * @param pageSize - Number of activities per page
 * @returns Promise<ActivitySessionDB[]>
 */
export const getActivities = async (
  filters: ActivityFilters = {},
  pageSize: number = 20,
): Promise<ActivitySessionDB[]> => {
  try {
    let q = query(collection(db, 'activities'));

    // Apply filters
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters.skillLevel) {
      q = query(q, where('skillLevel', '==', filters.skillLevel));
    }

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.isPaid !== undefined) {
      q = query(q, where('isPaid', '==', filters.isPaid));
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));

    const querySnapshot = await getDocs(q);
    const activities: ActivitySessionDB[] = [];

    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data(),
      } as ActivitySessionDB);
    });

    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

/**
 * Get a single activity by ID
 * 
 * @param activityId - Activity ID
 * @returns Promise<ActivitySessionDB | null>
 */
export const getActivityById = async (activityId: string): Promise<ActivitySessionDB | null> => {
  try {
    const activityDoc = await getDoc(doc(db, 'activities', activityId));
    
    if (!activityDoc.exists()) {
      return null;
    }

    return {
      id: activityDoc.id,
      ...activityDoc.data(),
    } as ActivitySessionDB;

  } catch (error) {
    console.error('Error fetching activity:', error);
    return null;
  }
};

/**
 * Join an activity
 * 
 * @param activityId - Activity ID
 * @param userId - User ID
 * @returns Promise<boolean>
 */
export const joinActivity = async (activityId: string, userId: string): Promise<boolean> => {
  try {
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }

    // Check if user is already a participant
    if (activity.currentParticipants.includes(userId)) {
      throw new Error('User already joined this activity');
    }

    // Check if activity is full
    if (activity.currentParticipants.length >= activity.maxParticipants) {
      // Add to waiting list
      await updateDoc(doc(db, 'activities', activityId), {
        waitingList: arrayUnion(userId),
        updatedAt: serverTimestamp(),
      });
      return false; // Added to waiting list
    }

    // Add user to participants
    await updateDoc(doc(db, 'activities', activityId), {
      currentParticipants: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });

    // Update status if activity is now full
    if (activity.currentParticipants.length + 1 >= activity.maxParticipants) {
      await updateDoc(doc(db, 'activities', activityId), {
        status: 'full',
      });
    }

    return true;
  } catch (error) {
    console.error('Error joining activity:', error);
    throw error;
  }
};

/**
 * Leave an activity
 * 
 * @param activityId - Activity ID
 * @param userId - User ID
 * @returns Promise<boolean>
 */
export const leaveActivity = async (activityId: string, userId: string): Promise<boolean> => {
  try {
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }

    // Remove user from participants
    await updateDoc(doc(db, 'activities', activityId), {
      currentParticipants: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });

    // If there's someone on the waiting list, move them to participants
    if (activity.waitingList.length > 0) {
      const nextUser = activity.waitingList[0];
      await updateDoc(doc(db, 'activities', activityId), {
        currentParticipants: arrayUnion(nextUser),
        waitingList: arrayRemove(nextUser),
      });
    }

    // Update status if activity is no longer full
    if (activity.status === 'full') {
      await updateDoc(doc(db, 'activities', activityId), {
        status: 'open',
      });
    }

    return true;
  } catch (error) {
    console.error('Error leaving activity:', error);
    return false;
  }
};

/**
 * Update activity information
 * 
 * @param activityId - Activity ID
 * @param updates - Activity updates
 * @param userId - User ID (must be creator)
 * @returns Promise<boolean>
 */
export const updateActivity = async (
  activityId: string,
  updates: Partial<ActivitySession>,
  userId: string,
): Promise<boolean> => {
  try {
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }

    // Check if user is the creator
    if (activity.creator !== userId) {
      throw new Error('Only the creator can update this activity');
    }

    await updateDoc(doc(db, 'activities', activityId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error updating activity:', error);
    return false;
  }
};

/**
 * Cancel an activity
 * 
 * @param activityId - Activity ID
 * @param userId - User ID (must be creator)
 * @returns Promise<boolean>
 */
export const cancelActivity = async (activityId: string, userId: string): Promise<boolean> => {
  try {
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }

    // Check if user is the creator
    if (activity.creator !== userId) {
      throw new Error('Only the creator can cancel this activity');
    }

    await updateDoc(doc(db, 'activities', activityId), {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error cancelling activity:', error);
    return false;
  }
};

/**
 * Get user's activities (created or joined)
 * 
 * @param userId - User ID
 * @param type - 'created' | 'joined' | 'all'
 * @returns Promise<ActivitySessionDB[]>
 */
export const getUserActivities = async (
  userId: string,
  type: 'created' | 'joined' | 'all' = 'all',
): Promise<ActivitySessionDB[]> => {
  try {
    const activities: ActivitySessionDB[] = [];

    if (type === 'created' || type === 'all') {
      const createdQuery = query(
        collection(db, 'activities'),
        where('creator', '==', userId),
        orderBy('createdAt', 'desc'),
      );
      const createdSnapshot = await getDocs(createdQuery);
      createdSnapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data(),
        } as ActivitySessionDB);
      });
    }

    if (type === 'joined' || type === 'all') {
      const joinedQuery = query(
        collection(db, 'activities'),
        where('currentParticipants', 'array-contains', userId),
        orderBy('createdAt', 'desc'),
      );
      const joinedSnapshot = await getDocs(joinedQuery);
      joinedSnapshot.forEach((doc) => {
        const activity = {
          id: doc.id,
          ...doc.data(),
        } as ActivitySessionDB;
        
        // Avoid duplicates if user is both creator and participant
        if (!activities.find(a => a.id === activity.id)) {
          activities.push(activity);
        }
      });
    }

    // Sort by creation date (newest first)
    activities.sort((a, b) => {
      const aTime = a.createdAt ? 
        (a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as Timestamp).toMillis()) : 0;
      const bTime = b.createdAt ? 
        (b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as Timestamp).toMillis()) : 0;
      return bTime - aTime;
    });

    return activities;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};

/**
 * Search activities by text
 * 
 * @param searchQuery - Search query
 * @param filters - Additional filters
 * @returns Promise<ActivitySessionDB[]>
 */
export const searchActivities = async (
  searchQuery: string,
  filters: ActivityFilters = {},
): Promise<ActivitySessionDB[]> => {
  try {
    const activities = await getActivities(filters);

    const filteredActivities = activities.filter(activity =>
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.description && activity.description.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    return filteredActivities;
  } catch (error) {
    console.error('Error searching activities:', error);
    return [];
  }
};

/**
 * Subscribe to real-time activity updates
 * 
 * @param activityId - Activity ID
 * @param callback - Callback function
 * @returns Unsubscribe function
 */
export const subscribeToActivityUpdates = (
  activityId: string,
  callback: (activity: ActivitySessionDB | null) => void,
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'activities', activityId),
    (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data(),
        } as ActivitySessionDB);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error in activity subscription:', error);
      callback(null);
    },
  );
};

/**
 * Get activities happening today
 * 
 * @returns Promise<ActivitySessionDB[]>
 */
export const getTodaysActivities = async (): Promise<ActivitySessionDB[]> => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const q = query(
      collection(db, 'activities'),
      where('datetime', '>=', startOfDay),
      where('datetime', '<', endOfDay),
      where('status', '==', 'open'),
      orderBy('datetime', 'asc'),
    );

    const querySnapshot = await getDocs(q);
    const activities: ActivitySessionDB[] = [];

    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data(),
      } as ActivitySessionDB);
    });

    return activities;
  } catch (error) {
    console.error('Error fetching today\'s activities:', error);
    return [];
  }
};

/**
 * Get recommended activities for a user
 * 
 * @param userId - User ID
 * @returns Promise<ActivitySessionDB[]>
 */
export const getRecommendedActivities = async (userId: string): Promise<ActivitySessionDB[]> => {
  try {
    // This is a simplified recommendation system
    // In production, you'd use more sophisticated algorithms
    
    // Get user's preferences and activity history
    // For now, we'll just return open activities
    const activities = await getActivities({ status: 'open' }, 10);
    
    // Filter out activities the user has already joined
    const recommendedActivities = activities.filter(activity =>
      !activity.currentParticipants.includes(userId) &&
      !activity.waitingList.includes(userId),
    );

    return recommendedActivities;
  } catch (error) {
    console.error('Error fetching recommended activities:', error);
    return [];
  }
};