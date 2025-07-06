/**
 * Enhanced Messages Page
 * 
 * Comprehensive messaging system for Fitcha sports platform
 * Features:
 * - Real-time chat interface
 * - Game coordination
 * - Community mess                         {/* Header Actions */}
            <div className="flex items-center space-x-2">
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
              </Button>utline" size="sm">
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
              </Button>actions and notifications
 * - Mobile responsive design
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Messaging System
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  GamepadIcon,
  Search,
  Plus,
  Bell,
  Settings,
  Zap,
  Calendar,
  Filter
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
  count?: number;
  color: string;
  action: () => void;
}

export const MessagesPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [showChatList, setShowChatList] = useState(true);
  const [currentUserId] = useState('current-user');
  const [showStats, setShowStats] = useState(true);

  // Enhanced stats tracking
  const [stats, setStats] = useState<MessageStats>({
    totalChats: 12,
    unreadMessages: 5,
    activeGames: 3,
    onlineFriends: 8
  });

  // Quick actions for enhanced messaging
  const quickActions: QuickAction[] = [
    {
      id: 'new-message',
      label: 'New Message',
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        console.log('Creating new message...');
        // Handle new message creation
      }
    },
    {
      id: 'create-group',
      label: 'Create Group',
      icon: <Users className="h-4 w-4" />,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      action: () => {
        console.log('Creating group chat...');
        // Handle group creation
      }
    },
    {
      id: 'game-chat',
      label: 'Game Chats',
      icon: <GamepadIcon className="h-4 w-4" />,
      count: stats.activeGames,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        console.log('Viewing game chats...');
        // Filter to show only game chats
      }
    },
    {
      id: 'quick-invite',
      label: 'Quick Invite',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => {
        console.log('Sending quick invite...');
        // Handle quick game invitations
      }
    }
  ];

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    // Auto-hide chat list on mobile when chat is selected
    if (window.innerWidth < 1024) {
      setShowChatList(false);
    }
  };

  const handleToggleChatList = () => {
    setShowChatList(!showChatList);
  };

  const handleNewMessage = () => {
    console.log('Opening new message dialog...');
    // Open new message modal/dialog
  };

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineFriends: Math.floor(Math.random() * 15) + 5,
        unreadMessages: Math.max(0, prev.unreadMessages + Math.floor(Math.random() * 3) - 1)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Header */}
      <Header />
      
      {/* Messages Header with Stats and Actions */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Title Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Messages</h1>
                  <p className="text-sm text-slate-600 hidden sm:block">Connect with your sports community</p>
                </div>
              </div>
              
              {/* Stats Display */}
              {showStats && (
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">{stats.totalChats} chats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-600">{stats.unreadMessages} unread</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">{stats.onlineFriends} online</span>
                  </div>
                </div>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" title="Search Messages">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="relative" title="Notifications">
                <Bell className="h-4 w-4" />
                {stats.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="sm" title="Filter Messages">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" title="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-x-auto">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={action.action}
                  className={`${action.color} text-white flex items-center space-x-2 whitespace-nowrap relative shadow-sm`}
                  size="sm"
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
                  {action.count && action.count > 0 && (
                    <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                      {action.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="hidden md:flex"
              >
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats Cards */}
      {showStats && (
        <div className="md:hidden bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-blue-100">
                <div className="text-xl font-bold text-blue-600">{stats.totalChats}</div>
                <div className="text-xs text-blue-700">Total Chats</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-red-100">
                <div className="text-xl font-bold text-red-600">{stats.unreadMessages}</div>
                <div className="text-xs text-red-700">Unread</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-purple-100">
                <div className="text-xl font-bold text-purple-600">{stats.activeGames}</div>
                <div className="text-xs text-purple-700">Game Chats</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
                <div className="text-xl font-bold text-green-600">{stats.onlineFriends}</div>
                <div className="text-xs text-green-700">Online</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Chat Interface */}
      <div className="max-w-7xl mx-auto">
        <div className="h-[calc(100vh-240px)] lg:h-[calc(100vh-200px)] bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading messages...</p>
              </div>
            </div>
          ) : (
            <ChatInterface
              currentUserId={currentUserId}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
              showChatList={showChatList}
              onToggleChatList={handleToggleChatList}
            />
          )}
        </div>
      </div>

      {/* Mobile Floating Actions */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-3 lg:hidden">
        {/* Chat List Toggle */}
        {!showChatList && (
          <Button
            onClick={handleToggleChatList}
            className="bg-slate-600 hover:bg-slate-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            title="Show Chat List"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
        
        {/* New Message Button */}
        <Button
          onClick={handleNewMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          title="New Message"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Welcome Screen for No Selected Chat */}
      {!selectedChatId && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 bg-opacity-95 z-10 pointer-events-none">
          <div className="text-center max-w-md mx-auto p-6 pointer-events-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Welcome to Fitcha Messages
            </h2>
            <p className="text-slate-600 mb-6">
              Connect with your sports partners, coordinate games, and build your community
            </p>
            
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Quick Messages</div>
                  <div className="text-sm text-slate-600">Send instant updates like "On my way!"</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Game Coordination</div>
                  <div className="text-sm text-slate-600">Organize games and manage teams</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Group Chats</div>
                  <div className="text-sm text-slate-600">Connect with multiple players at once</div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setSelectedChatId('chat-1')}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              Start Your First Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};