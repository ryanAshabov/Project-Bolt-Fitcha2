/**
 * Notifications Hook for Fitcha Mobile
 * 
 * This hook provides functionality for managing push notifications
 * and in-app notifications.
 */

import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification type
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Register for push notifications
  useEffect(() => {
    registerForPushNotifications();
    
    // Check if notifications are enabled
    AsyncStorage.getItem('notificationsEnabled')
      .then(value => {
        if (value !== null) {
          setNotificationsEnabled(value === 'true');
        }
      });
  }, []);

  // Listen for notifications from Firestore
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsList: Notification[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        notificationsList.push({
          id: doc.id,
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data,
          isRead: data.isRead,
          createdAt: data.createdAt?.toDate() || new Date(),
          actionUrl: data.actionUrl,
          priority: data.priority || 'medium',
        });
      });

      setNotifications(notificationsList);
      setUnreadCount(notificationsList.filter(n => !n.isRead).length);
    });

    return () => unsubscribe();
  }, []);

  // Register for push notifications
  const registerForPushNotifications = async () => {
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
      setExpoPushToken(token);

      // Save token to Firestore
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          expoPushToken: token,
          deviceType: Platform.OS,
        });
      }

      // Required for Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: serverTimestamp(),
      });

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const batch = db.batch();
      
      notifications.forEach(notification => {
        if (!notification.isRead) {
          const notificationRef = doc(db, 'notifications', notification.id);
          batch.update(notificationRef, {
            isRead: true,
            updatedAt: serverTimestamp(),
          });
        }
      });

      await batch.commit();

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications]);

  // Add a new notification
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, {
        ...notification,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }, []);

  // Remove a notification
  const removeNotification = useCallback(async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await deleteDoc(notificationRef);

      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  }, [notifications]);

  // Toggle notifications enabled/disabled
  const toggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    await AsyncStorage.setItem('notificationsEnabled', enabled.toString());
  };

  return {
    notifications,
    unreadCount,
    expoPushToken,
    notificationsEnabled,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    toggleNotifications,
  };
};