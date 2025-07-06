import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock notifications for development
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: 'current-user',
        type: 'game_invite',
        title: 'Game Invitation',
        message: 'Sarah invited you to play tennis tomorrow at 3 PM',
        data: { gameId: 'game-1', from: 'sarah-id' },
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        actionUrl: '/games/game-1',
        priority: 'high',
      },
      {
        id: '2',
        userId: 'current-user',
        type: 'player_joined',
        title: 'Player Joined',
        message: 'Michael joined your basketball game',
        data: { gameId: 'game-2', playerId: 'michael-id' },
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actionUrl: '/games/game-2',
        priority: 'medium',
      },
      {
        id: '3',
        userId: 'current-user',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You earned the "Team Player" badge',
        data: { achievementId: 'team-player' },
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        priority: 'low',
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true })),
    );
    setUnreadCount(0);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    if (!newNotification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
  };
};