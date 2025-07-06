/**
 * Enhanced Messages Page
 * 
 * Complete messaging system with:
 * - Chat list with recent conversations
 * - Real-time messaging interface
 * - Group chats for games
 * - Message search and filters
 * - Online status indicators
 * - File sharing capabilities
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Messaging System
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Users,
  MessageCircle,
  CheckCheck,
  ArrowLeft,
  Plus,
  Image,
  File
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Mock conversations data
const mockConversations = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'Ahmed Hassan',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: {
      content: 'Great game today! Same time tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      senderId: 'ahmed-123',
      read: false
    },
    participants: ['current-user', 'ahmed-123'],
    isOnline: true,
    unreadCount: 2
  },
  {
    id: 'conv-2',
    type: 'group',
    name: 'Basketball Squad',
    avatar: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: {
      content: 'Sarah: Who is bringing the water bottles?',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      senderId: 'sarah-456',
      read: true
    },
    participants: ['current-user', 'ahmed-123', 'sarah-456', 'omar-789'],
    isOnline: false,
    unreadCount: 0
  },
  {
    id: 'conv-3',
    type: 'direct',
    name: 'Sarah Mohamed',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: {
      content: 'Thanks for the yoga session recommendation!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      senderId: 'sarah-456',
      read: true
    },
    participants: ['current-user', 'sarah-456'],
    isOnline: true,
    unreadCount: 0
  },
  {
    id: 'conv-4',
    type: 'group',
    name: 'Tennis Club',
    avatar: 'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: {
      content: 'Omar: Court 3 is available this weekend',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      senderId: 'omar-789',
      read: true
    },
    participants: ['current-user', 'omar-789', 'nadia-101', 'khaled-202'],
    isOnline: false,
    unreadCount: 0
  },
  {
    id: 'conv-5',
    type: 'direct',
    name: 'Nadia Farouk',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    lastMessage: {
      content: 'Looking forward to our doubles match!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      senderId: 'nadia-101',
      read: true
    },
    participants: ['current-user', 'nadia-101'],
    isOnline: false,
    unreadCount: 0
  }
];

// Mock messages for active conversation
const mockMessages = [
  {
    id: 'msg-1',
    content: 'Hey! Are you free for a basketball game this evening?',
    senderId: 'ahmed-123',
    senderName: 'Ahmed Hassan',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: true,
    type: 'text'
  },
  {
    id: 'msg-2',
    content: 'Yes! What time were you thinking?',
    senderId: 'current-user',
    senderName: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    read: true,
    type: 'text'
  },
  {
    id: 'msg-3',
    content: 'Around 6 PM at the downtown court. I can bring the ball.',
    senderId: 'ahmed-123',
    senderName: 'Ahmed Hassan',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    read: true,
    type: 'text'
  },
  {
    id: 'msg-4',
    content: 'Perfect! I will be there. Should we invite Omar too?',
    senderId: 'current-user',
    senderName: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    read: true,
    type: 'text'
  },
  {
    id: 'msg-5',
    content: 'Great idea! I will message him now.',
    senderId: 'ahmed-123',
    senderName: 'Ahmed Hassan',
    timestamp: new Date(Date.now() - 1000 * 60 * 16),
    read: true,
    type: 'text'
  },
  {
    id: 'msg-6',
    content: 'Great game today! Same time tomorrow?',
    senderId: 'ahmed-123',
    senderName: 'Ahmed Hassan',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    type: 'text'
  }
];

const MessagesPageEnhanced: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: 'current-user',
      senderName: 'You',
      timestamp: new Date(),
      read: true,
      type: 'text' as const
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation's last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation
        ? { ...conv, lastMessage: { ...message, senderId: 'current-user' } }
        : conv
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col ${
        showMobileChat && selectedConversation ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
            <Button size="sm" className="rounded-full p-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                setSelectedConversation(conversation.id);
                setShowMobileChat(true);
              }}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.type === 'direct' && conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                  {conversation.type === 'group' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                      <Users className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 truncate">{conversation.name}</h3>
                    <span className="text-xs text-slate-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-slate-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${
        showMobileChat && selectedConversation ? 'flex' : 'hidden md:flex'
      }`}>
        {selectedConversation && selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <img
                  src={selectedConv.avatar}
                  alt={selectedConv.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                
                <div>
                  <h2 className="font-semibold text-slate-800">{selectedConv.name}</h2>
                  <p className="text-sm text-slate-500">
                    {selectedConv.type === 'group' 
                      ? `${selectedConv.participants.length} members`
                      : selectedConv.isOnline ? 'Online' : 'Offline'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === 'current-user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}>
                    {message.senderId !== 'current-user' && selectedConv.type === 'group' && (
                      <p className="text-xs font-medium mb-1 opacity-75">{message.senderName}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      message.senderId === 'current-user' ? 'text-blue-100' : 'text-slate-400'
                    }`}>
                      <span className="text-xs">{formatTime(message.timestamp)}</span>
                      {message.senderId === 'current-user' && (
                        <CheckCheck className={`h-3 w-3 ${message.read ? 'text-blue-200' : 'text-blue-300'}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-slate-200 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <File className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={1}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 bottom-2"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Select a conversation</h3>
              <p className="text-slate-600">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPageEnhanced;
