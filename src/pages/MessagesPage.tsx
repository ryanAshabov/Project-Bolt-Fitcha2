/**
 * Enhanced Messages Page
 * 
 * Comprehensive messaging system for Fitcha sports platform
 * Features:
 * - Real-time chat interface
 * - Game coordination
 * - Community messaging
 * - Quick actions and notifications
 * - Mobile responsive design
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Messaging System
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  GamepadIcon,
  Search,
  Plus,
  Bell,
  Settings,
  Zap,
  Filter,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import ChatInterface from '../components/chat/ChatInterface';

// Types for enhanced messaging
interface MessageStats {
  totalChats: number;
  unreadMessages: number;
  activeGames: number;
  onlineFriends: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

// Enhanced Messages Page Component
export const MessagesPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [showChatList, setShowChatList] = useState(true);
  const [currentUserId] = useState('current-user');
  const [showStats] = useState(true);

  // Enhanced stats tracking
  const [stats] = useState<MessageStats>({
    totalChats: 12,
    unreadMessages: 5,
    activeGames: 3,
    onlineFriends: 8,
  });

  // Quick actions for enhanced messaging
  const quickActions: QuickAction[] = [
    {
      id: 'new-message',
      label: 'New Message',
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'blue',
      action: () => setSelectedChatId(''),
    },
    {
      id: 'create-group',
      label: 'Create Group',
      icon: <Users className="h-4 w-4" />,
      color: 'green',
      action: () => console.log('Create group'),
    },
    {
      id: 'game-chat',
      label: 'Game Chat',
      icon: <GamepadIcon className="h-4 w-4" />,
      color: 'purple',
      action: () => console.log('Game chat'),
    },
    {
      id: 'quick-match',
      label: 'Quick Match',
      icon: <Zap className="h-4 w-4" />,
      color: 'yellow',
      action: () => console.log('Quick match'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-screen pt-16">
        {/* Enhanced Sidebar - Chat List */}
        <div className={`${showChatList ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex flex-col`}>
          
          {/* Enhanced Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-500" />
                Messages
              </h1>
            </div>

            {/* Enhanced Stats Cards */}
            {showStats && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Chats</p>
                      <p className="text-lg font-semibold text-gray-800">{stats.totalChats}</p>
                    </div>
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Unread</p>
                      <p className="text-lg font-semibold text-red-600">{stats.unreadMessages}</p>
                    </div>
                    <Bell className="h-4 w-4 text-red-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Active Games</p>
                      <p className="text-lg font-semibold text-green-600">{stats.activeGames}</p>
                    </div>
                    <GamepadIcon className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Online</p>
                      <p className="text-lg font-semibold text-blue-600">{stats.onlineFriends}</p>
                    </div>
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Search and Quick Actions */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 4).map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                      action.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                      action.color === 'green' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                      action.color === 'purple' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
                      'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      {action.icon}
                      <span>{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 mt-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {stats.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.unreadMessages}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="space-y-1">
                {/* Mock conversation items would go here */}
                <p className="text-sm text-gray-500 text-center py-8">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChatId ? (
            <ChatInterface 
              selectedChatId={selectedChatId}
              currentUserId={currentUserId}
              onChatSelect={setSelectedChatId}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Welcome to Fitcha Messages
                </h2>
                <p className="text-gray-500 mb-6 max-w-md">
                  Connect with players, coordinate games, and build your sports community.
                  Select a conversation to start chatting.
                </p>
                
                {/* Enhanced Welcome Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => setSelectedChatId('chat-1')}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Start Chatting</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => console.log('Find partners')}
                    className="flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Find Partners</span>
                  </Button>
                </div>

                {/* Features Highlight */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Real-time Chat</p>
                    <p className="text-xs text-gray-500">Instant messaging</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <GamepadIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Game Coordination</p>
                    <p className="text-xs text-gray-500">Organize matches</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Group Chats</p>
                    <p className="text-xs text-gray-500">Team communication</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Toggle Chat List Button */}
        <div className="lg:hidden fixed bottom-6 left-6 z-50">
          <Button
            onClick={() => setShowChatList(!showChatList)}
            className="rounded-full h-12 w-12 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile: New Message FAB */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setSelectedChatId('')}
            className="rounded-full h-12 w-12 p-0 bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
