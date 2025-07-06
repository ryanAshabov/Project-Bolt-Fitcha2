/**
 * Push Notifications Utilities for Fitcha Mobile
 * 
 * This file contains utilities for managing push notifications.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reportError } from './errorReporting';
import { ErrorSeverity } from './errorReporting';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
export const registerForPushNotifications = async (): Promise<string | undefined> => {
  if (!Device.isDevice) {
    console.log('Push notifications are not available in the simulator');
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Get the token
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Save token to Firestore
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        expoPushToken: token,
        deviceType: Platform.OS,
        lastTokenUpdate: serverTimestamp(),
      });
    }

    // Save token locally
    await AsyncStorage.setItem('expoPushToken', token);

    // Required for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      
      // Create additional channels for different notification types
      Notifications.setNotificationChannelAsync('game_invites', {
        name: 'Game Invites',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
      
      Notifications.setNotificationChannelAsync('messages', {
        name: 'Messages',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 100, 100, 100],
        lightColor: '#8B5CF6',
      });
      
      Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 100, 50, 100],
        lightColor: '#10B981',
      });
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    reportError(error as Error, ErrorSeverity.MEDIUM, { action: 'register_push_notifications' });
    return undefined;
  }
};

// Send local notification
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>,
  channelId: string = 'default'
) => {
  try {
    // Check if notifications are enabled
    const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
    if (notificationsEnabled === 'false') return;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        badge: 1,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
    reportError(error as Error, ErrorSeverity.LOW, { 
      action: 'send_local_notification',
      additionalData: { title, body }
    });
  }
};

// Schedule notification
export const scheduleNotification = async (
  title: string,
  body: string,
  scheduledTime: Date,
  data?: Record<string, any>,
  channelId: string = 'default'
) => {
  try {
    // Check if notifications are enabled
    const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
    if (notificationsEnabled === 'false') return;
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: {
        date: scheduledTime,
        channelId,
      },
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    reportError(error as Error, ErrorSeverity.LOW, { 
      action: 'schedule_notification',
      additionalData: { title, body, scheduledTime }
    });
  }
};

// Cancel scheduled notification
export const cancelScheduledNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling scheduled notification:', error);
    reportError(error as Error, ErrorSeverity.LOW, { 
      action: 'cancel_scheduled_notification',
      additionalData: { notificationId }
    });
  }
};

// Get badge count
export const getBadgeCount = async (): Promise<number> => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    reportError(error as Error, ErrorSeverity.LOW, { action: 'get_badge_count' });
    return 0;
  }
};

// Set badge count
export const setBadgeCount = async (count: number) => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
    reportError(error as Error, ErrorSeverity.LOW, { 
      action: 'set_badge_count',
      additionalData: { count }
    });
  }
};

// Add notification response handler
export const addNotificationResponseHandler = (
  handler: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(handler);
};

// Add notification received handler
export const addNotificationReceivedHandler = (
  handler: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(handler);
};

// Remove notification listener
export const removeNotificationListener = (
  listener: Notifications.Subscription
) => {
  Notifications.removeNotificationSubscription(listener);
};

// Enable/disable notifications
export const setNotificationsEnabled = async (enabled: boolean) => {
  await AsyncStorage.setItem('notificationsEnabled', enabled.toString());
};

// Check if notifications are enabled
export const areNotificationsEnabled = async (): Promise<boolean> => {
  const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
  return notificationsEnabled !== 'false'; // Default to true if not set
};