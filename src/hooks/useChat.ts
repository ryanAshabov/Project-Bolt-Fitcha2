import { useState, useEffect } from 'react';
import { Message, Conversation } from '../types';
import { mockUsers } from '../data/mockData';

export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState<string[]>([]);

  useEffect(() => {
    // Mock conversations for development
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        type: 'direct',
        participants: [mockUsers[0], mockUsers[1]],
        lastMessage: {
          id: 'msg-1',
          sender: mockUsers[1],
          content: 'Hey! Ready for tennis tomorrow?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
          type: 'text'
        },
        unreadCount: 2,
        isActive: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 'conv-2',
        type: 'game',
        participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
        lastMessage: {
          id: 'msg-2',
          sender: mockUsers[2],
          content: 'Court is booked! See you at 6 PM',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
          type: 'text'
        },
        unreadCount: 0,
        gameId: 'game-1',
        name: 'Basketball Game - Tonight',
        isActive: true,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
      }
    ];

    setConversations(mockConversations);

    if (conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId]);

  const loadMessages = async (convId: string) => {
    setLoading(true);
    
    // Mock messages for development
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        sender: mockUsers[1],
        content: 'Hey! Are you free for tennis tomorrow?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-2',
        sender: mockUsers[0],
        content: 'Yes! What time works for you?',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-3',
        sender: mockUsers[1],
        content: 'How about 3 PM at Elite Tennis Center?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-4',
        sender: mockUsers[0],
        content: 'Perfect! See you there 🎾',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        type: 'text'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 500));
    setMessages(mockMessages);
    setLoading(false);
  };

  const sendMessage = async (content: string, type: 'text' | 'image' = 'text') => {
    if (!conversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: mockUsers[0], // Current user
      content,
      timestamp: new Date(),
      isRead: false,
      type
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation's last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessage: newMessage }
          : conv
      )
    );

    // Simulate sending to backend
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const sendQuickMessage = (messageType: 'on_my_way' | 'running_late' | 'arrived' | 'cancelled') => {
    const quickMessages = {
      on_my_way: "I'm on my way! 🚗",
      running_late: "Running 10 minutes late, sorry! ⏰",
      arrived: "I'm here! 📍",
      cancelled: "Sorry, need to cancel today 😔"
    };

    sendMessage(quickMessages[messageType], 'quick_message');
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const startTyping = (userId: string) => {
    setTyping(prev => [...prev.filter(id => id !== userId), userId]);
    
    // Remove typing indicator after 3 seconds
    setTimeout(() => {
      setTyping(prev => prev.filter(id => id !== userId));
    }, 3000);
  };

  return {
    messages,
    conversations,
    loading,
    typing,
    sendMessage,
    sendQuickMessage,
    markAsRead,
    startTyping,
    loadMessages
  };
};