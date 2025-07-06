/**
 * Enhanced Chat Hook
 * 
 * Comprehensive chat functionality for real-time messaging
 * Features:
 * - Real-time message handling
 * - Quick message support
 * - Typing indicators
 * - Message status tracking
 * - Game integration
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Chat System
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Conversation } from '../types';
import { mockUsers } from '../data/mockData';

// Enhanced message types
interface EnhancedMessage extends Message {
  isDelivered?: boolean;
  replyTo?: string;
  gameId?: string;
  courtId?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
  };
}

interface ChatState {
  messages: EnhancedMessage[];
  conversations: Conversation[];
  loading: boolean;
  typing: string[];
  error: string | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export const useChat = (conversationId?: string) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    conversations: [],
    loading: false,
    typing: [],
    error: null,
    connectionStatus: 'connected'
  });

  const typingTimeoutRef = useRef<number>();
  const reconnectTimeoutRef = useRef<number>();

  // Mock messages for the selected conversation
  const getMockMessages = useCallback((convId: string): EnhancedMessage[] => {
    const mockMessages: { [key: string]: EnhancedMessage[] } = {
      'chat-1': [
        {
          id: 'msg-1a',
          sender: mockUsers[0],
          content: 'Hey everyone! Game starts in 1 hour at City Sports Complex',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          isRead: true,
          isDelivered: true,
          type: 'text',
          gameId: 'game-1'
        },
        {
          id: 'msg-1b',
          sender: mockUsers[1],
          content: 'Perfect! I\'ll be there. Should I bring extra basketballs?',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          isRead: true,
          isDelivered: true,
          type: 'text'
        },
        {
          id: 'msg-1c',
          sender: mockUsers[2],
          content: 'Yes please! And I\'ll bring the first aid kit',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: true,
          isDelivered: true,
          type: 'text'
        },
        {
          id: 'msg-1d',
          sender: mockUsers[1],
          content: 'I\'m running 5 minutes late ⏰',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          isRead: false,
          isDelivered: true,
          type: 'quick_message'
        }
      ],
      'chat-2': [
        {
          id: 'msg-2a',
          sender: mockUsers[3],
          content: 'Want to join for tennis tomorrow?',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: false,
          isDelivered: true,
          type: 'text'
        }
      ]
    };

    return mockMessages[convId] || [];
  }, []);

  // Enhanced mock conversations
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: 'chat-1',
        type: 'group',
        participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
        lastMessage: {
          id: 'msg-1d',
          sender: mockUsers[1],
          content: 'I\'m running 5 minutes late ⏰',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          isRead: false,
          type: 'quick_message'
        },
        unreadCount: 2,
        isActive: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        name: 'Basketball Game - City Sports',
        gameId: 'game-1'
      },
      {
        id: 'chat-2',
        type: 'direct',
        participants: [mockUsers[3]],
        lastMessage: {
          id: 'msg-2a',
          sender: mockUsers[3],
          content: 'Want to join for tennis tomorrow?',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: false,
          type: 'text'
        },
        unreadCount: 1,
        isActive: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        name: 'Mohamed S.'
      },
      {
        id: 'chat-3',
        type: 'group',
        participants: [mockUsers[4], mockUsers[5], mockUsers[6]],
        lastMessage: {
          id: 'msg-3a',
          sender: mockUsers[5],
          content: 'Football this Friday?',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          isRead: true,
          type: 'text'
        },
        unreadCount: 0,
        isActive: true,
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
        name: 'Weekend Warriors'
      }
    ];

    setChatState(prev => ({
      ...prev,
      conversations: mockConversations,
      loading: false
    }));
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (conversationId) {
      setChatState(prev => ({ ...prev, loading: true }));
      
      // Simulate loading delay
      const timeout = setTimeout(() => {
        const messages = getMockMessages(conversationId);
        setChatState(prev => ({
          ...prev,
          messages,
          loading: false
        }));
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [conversationId, getMockMessages]);

  // Enhanced send message function
  const sendMessage = useCallback(async (content: string, type: 'text' | 'quick_message' | 'image' | 'system' = 'text') => {
    if (!conversationId || !content.trim()) return;

    const newMessage: EnhancedMessage = {
      id: `msg-${Date.now()}`,
      sender: {
        id: 'current-user',
        firstName: 'You',
        lastName: '',
        email: 'you@fitcha.com',
        avatar: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        headline: 'Your Profile',
        location: 'Your Location',
        coordinates: { lat: 0, lng: 0 },
        connections: 0,
        isOnline: true,
        verified: true,
        isPro: false,
        sports: [],
        skillLevel: 'Beginner',
        rating: 5.0,
        gamesPlayed: 0,
        winRate: 0,
        badges: [],
        availability: [],
        trustScore: 100,
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
            emailNotifications: true
          },
          privacy: {
            showLocation: true,
            showOnlineStatus: true,
            allowGameInvites: 'everyone',
            showStatistics: true
          },
          gameDefaults: {
            preferredSports: [],
            skillLevel: 'Beginner',
            maxDistance: 10,
            preferredTimes: [],
            paymentPreference: 'both'
          }
        },
        statistics: {
          totalGames: 0,
          totalWins: 0,
          totalLosses: 0,
          averageRating: 5.0,
          favoriteTime: 'Evening',
          favoriteSport: 'Basketball',
          mostPlayedWith: [],
          monthlyGames: [],
          courtVisits: []
        }
      },
      content: content.trim(),
      timestamp: new Date(),
      isRead: false,
      isDelivered: false,
      type
    };

    // Optimistically add message
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mark as delivered
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, isDelivered: true }
            : msg
        )
      }));

      // Simulate read receipt after a short delay
      setTimeout(() => {
        setChatState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, isRead: true }
              : msg
          )
        }));
      }, 2000);

    } catch (error) {
      console.error('Failed to send message:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to send message. Please try again.'
      }));
    }
  }, [conversationId]);

  // Enhanced quick message function
  const sendQuickMessage = useCallback(async (messageData: { text: string; icon?: string }) => {
    return sendMessage(messageData.text, 'quick_message');
  }, [sendMessage]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        messageIds.includes(msg.id) 
          ? { ...msg, isRead: true }
          : msg
      )
    }));
  }, []);

  // Typing indicator
  const startTyping = useCallback((userId: string) => {
    setChatState(prev => ({
      ...prev,
      typing: [...prev.typing.filter(id => id !== userId), userId]
    }));

    // Clear typing after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = window.setTimeout(() => {
      setChatState(prev => ({
        ...prev,
        typing: prev.typing.filter(id => id !== userId)
      }));
    }, 3000);
  }, []);

  const stopTyping = useCallback((userId: string) => {
    setChatState(prev => ({
      ...prev,
      typing: prev.typing.filter(id => id !== userId)
    }));
  }, []);

  // Connection management
  const reconnect = useCallback(() => {
    setChatState(prev => ({ ...prev, connectionStatus: 'connecting' }));
    
    // Simulate reconnection
    reconnectTimeoutRef.current = window.setTimeout(() => {
      setChatState(prev => ({ ...prev, connectionStatus: 'connected' }));
    }, 2000);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    messages: chatState.messages,
    conversations: chatState.conversations,
    loading: chatState.loading,
    typing: chatState.typing,
    error: chatState.error,
    connectionStatus: chatState.connectionStatus,
    
    // Actions
    sendMessage,
    sendQuickMessage,
    markAsRead,
    startTyping,
    stopTyping,
    reconnect,
    
    // Utilities
    clearError: () => setChatState(prev => ({ ...prev, error: null }))
  };
};