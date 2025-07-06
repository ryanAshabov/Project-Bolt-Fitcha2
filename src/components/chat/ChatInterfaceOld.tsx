/**
 * Enhanced Chat Interface Component
 * 
 * Real-time messaging system for game coordination and community building
 * Features:
 * - 1-on-1 messaging
 * - Group chats for games
 * - Quick messages
 * - File sharing
 * - Smart notifications
 * - Message status indicators
 * - Game integration
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Real-time Chat System
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  MapPin, 
  Clock,
  Users,
  Search,
  ArrowLeft,
  CheckCheck,
  Check,
  Image,
  File,
  Calendar,
  Star,
  Zap,
  Navigation
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

// Enhanced Types
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'location' | 'quick' | 'game-invite' | 'court-booking';
  timestamp: Date;
  isRead: boolean;
  isDelivered: boolean;
  gameId?: string;
  courtId?: string;
  locationData?: {
    lat: number;
    lng: number;
    address: string;
  };
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
    gameName?: string;
    courtName?: string;
    gameTime?: Date;
  };
}

interface Chat {
  id: string;
  type: 'direct' | 'group' | 'game';
  name: string;
  avatar?: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: Date;
    role?: 'admin' | 'member';
  }[];
  lastMessage?: Message;
  unreadCount: number;
  gameId?: string;
  courtId?: string;
  isPinned: boolean;
  isMuted: boolean;
  description?: string;
  gameInfo?: {
    name: string;
    sport: string;
    time: Date;
    location: string;
    courtName: string;
    playersNeeded: number;
    currentPlayers: number;
  };
}

interface ChatInterfaceProps {
  currentUserId: string;
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onClose?: () => void;
  showChatList?: boolean;
  onToggleChatList?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentUserId,
  selectedChatId,
  onChatSelect,
  onClose,
  showChatList = true,
  onToggleChatList
}) => {
  const { messages, loading, typing, sendMessage, sendQuickMessage, markAsRead } = useChat(selectedChatId || '');
  const [chats, setChats] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced Quick Messages
  const quickMessages = [
    { id: 'on_my_way', text: "I'm on my way! 🚗", icon: '🚗', category: 'status' },
    { id: 'running_late_5', text: 'Running 5 minutes late ⏰', icon: '⏰', category: 'status' },
    { id: 'running_late_10', text: 'Running 10 minutes late ⏰', icon: '⏰', category: 'status' },
    { id: 'arrived', text: "I'm here! Where are you? 📍", icon: '📍', category: 'status' },
    { id: 'need_ride', text: 'Need a ride? 🚙', icon: '🚙', category: 'help' },
    { id: 'bringing_water', text: 'Bringing water bottles 💧', icon: '💧', category: 'help' },
    { id: 'great_game', text: 'Great game! 🏆', icon: '🏆', category: 'social' },
    { id: 'good_luck', text: 'Good luck everyone! 💪', icon: '💪', category: 'social' },
    { id: 'need_to_cancel', text: 'Sorry, need to cancel 😔', icon: '😔', category: 'status' },
    { id: 'cant_make_it', text: "Can't make it today 😞", icon: '😞', category: 'status' }
  ];

  // Mock data for development
  const mockChats: Chat[] = [
    {
      id: 'chat-1',
      type: 'game',
      name: 'Basketball Game - City Sports',
      participants: [
        { id: 'user-1', name: 'Ahmed M.', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isOnline: true, role: 'admin' },
        { id: 'user-2', name: 'Sarah K.', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isOnline: true, role: 'member' },
        { id: 'user-3', name: 'Omar T.', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isOnline: false, lastSeen: new Date(Date.now() - 30 * 60 * 1000), role: 'member' }
      ],
      lastMessage: {
        id: 'msg-1',
        senderId: 'user-2',
        senderName: 'Sarah K.',
        senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        content: 'I\'m running 5 minutes late ⏰',
        type: 'quick',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isRead: false,
        isDelivered: true
      },
      unreadCount: 2,
      gameId: 'game-1',
      courtId: 'court-1',
      isPinned: true,
      isMuted: false,
      gameInfo: {
        name: 'Friday Basketball',
        sport: 'Basketball',
        time: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        location: 'Downtown Cairo',
        courtName: 'City Sports Complex',
        playersNeeded: 2,
        currentPlayers: 4
      }
    },
    {
      id: 'chat-2',
      type: 'direct',
      name: 'Mohamed S.',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      participants: [
        { id: 'user-4', name: 'Mohamed S.', avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isOnline: true }
      ],
      lastMessage: {
        id: 'msg-2',
        senderId: 'user-4',
        senderName: 'Mohamed S.',
        senderAvatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        content: 'Want to join for tennis tomorrow?',
        type: 'text',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false,
        isDelivered: true
      },
      unreadCount: 1,
      isPinned: false,
      isMuted: false
    },
    {
      id: 'chat-3',
      type: 'group',
      name: 'Weekend Warriors',
      participants: [
        { id: 'user-5', name: 'Yasmin H.', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isOnline: false },
        { id: 'user-6', name: 'Karim M.', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isOnline: true },
        { id: 'user-7', name: 'Nour A.', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isOnline: true }
      ],
      lastMessage: {
        id: 'msg-3',
        senderId: 'user-6',
        senderName: 'Karim M.',
        senderAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        content: 'Football this Friday?',
        type: 'text',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: true,
        isDelivered: true
      },
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      description: 'Group for weekend sports activities'
    }
  ];

  const [localChats, setLocalChats] = useState<Chat[]>(mockChats);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setLocalChats(mockChats);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId) return;

    await sendMessage(newMessage);
    setNewMessage('');
    setShowQuickMessages(false);
  };

  const handleQuickMessage = async (messageData: any) => {
    await sendQuickMessage(messageData);
    setShowQuickMessages(false);
  };

  const handleSendQuickMessage = (message: string) => {
    if (!selectedChatId) return;
    
    // Simulate sending quick message
    console.log('Sending quick message:', message);
    setShowQuickMessages(false);
  };

  const selectedChat = localChats.find(chat => chat.id === selectedChatId);
  const filteredChats = localChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const getChatTypeIcon = (type: string) => {
    switch (type) {
      case 'game': return '🏀';
      case 'group': return '👥';
      default: return '💬';
    }
  };

  const getOnlineCount = (participants: any[]) => {
    return participants.filter(p => p.isOnline).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Enhanced Chat List */}
      {showChatList && (
        <div className="w-80 border-r border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Messages</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
                {onClose && (
                  <Button variant="outline" size="sm" onClick={onClose}>
                    ✕
                  </Button>
                )}
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                  selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                      {chat.avatar ? (
                        <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-lg">{getChatTypeIcon(chat.type)}</span>
                      )}
                    </div>
                    {/* Online indicator for direct chats */}
                    {chat.type === 'direct' && chat.participants[0]?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {/* Online count for group chats */}
                    {chat.type !== 'direct' && getOnlineCount(chat.participants) > 0 && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{getOnlineCount(chat.participants)}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800 truncate flex items-center space-x-1">
                        <span>{chat.name}</span>
                        {chat.isPinned && <span className="text-slate-400">📌</span>}
                        {chat.isMuted && <span className="text-slate-400">🔕</span>}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-slate-500">
                          {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-slate-600 truncate">
                        {chat.lastMessage && (
                          <>
                            {chat.lastMessage.senderId === currentUserId ? 'You: ' : ''}
                            {chat.lastMessage.type === 'quick' && '⚡ '}
                            {chat.lastMessage.content}
                          </>
                        )}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Game info preview */}
                    {chat.gameInfo && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600">
                        <Clock className="h-3 w-3" />
                        <span>Game in {formatTime(chat.gameInfo.time)}</span>
                        <span>•</span>
                        <span>{chat.gameInfo.currentPlayers}/{chat.gameInfo.currentPlayers + chat.gameInfo.playersNeeded} players</span>
                      </div>
                    )}

                    {/* Group description */}
                    {chat.type === 'group' && chat.description && (
                      <p className="text-xs text-slate-500 mt-1 truncate">{chat.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Enhanced Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {onToggleChatList && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden"
                      onClick={onToggleChatList}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                    {selectedChat.avatar ? (
                      <img src={selectedChat.avatar} alt={selectedChat.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{getChatTypeIcon(selectedChat.type)}</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                      <span>{selectedChat.name}</span>
                      {selectedChat.type === 'game' && <span className="text-sm">🏀</span>}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {selectedChat.type === 'direct' 
                        ? selectedChat.participants[0]?.isOnline 
                          ? 'Online' 
                          : `Last seen ${selectedChat.participants[0]?.lastSeen ? formatTime(selectedChat.participants[0].lastSeen) : 'recently'}`
                        : `${selectedChat.participants.length} members${getOnlineCount(selectedChat.participants) > 0 ? `, ${getOnlineCount(selectedChat.participants)} online` : ''}`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" title="Voice Call">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Video Call">
                    <Video className="h-4 w-4" />
                  </Button>
                  {selectedChat.gameInfo && (
                    <Button variant="outline" size="sm" title="Game Details">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" title="More Options">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Game Info Banner */}
              {selectedChat.gameInfo && (
                <div className="mt-3 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                        🏀
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">{selectedChat.gameInfo.name}</p>
                        <p className="text-sm text-blue-700">
                          {selectedChat.gameInfo.time.toLocaleDateString()} at {selectedChat.gameInfo.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-blue-600">
                          📍 {selectedChat.gameInfo.courtName} • {selectedChat.gameInfo.currentPlayers}/{selectedChat.gameInfo.currentPlayers + selectedChat.gameInfo.playersNeeded} players
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        <MapPin className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        View Game
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {typing && typing.length > 0 && (
                <div className="mt-2 text-sm text-blue-600">
                  {typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
            </div>

            {/* Enhanced Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.senderId === currentUserId ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar for others */}
                    {message.senderId !== currentUserId && (
                      <img
                        src={message.senderAvatar || 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}

                    {/* Enhanced Message Bubble */}
                    <div
                      className={`p-3 rounded-2xl shadow-sm ${
                        message.senderId === currentUserId
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-slate-800 rounded-bl-md border border-slate-200'
                      } ${message.type === 'quick' ? 'border-l-4 border-yellow-400' : ''}`}
                    >
                      {/* Quick message indicator */}
                      {message.type === 'quick' && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Zap className="h-3 w-3" />
                          <span className="text-xs opacity-75">Quick message</span>
                        </div>
                      )}
                      
                      {/* Message content */}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {/* Enhanced message footer */}
                      <div className={`flex items-center justify-between mt-2 space-x-2 ${message.senderId === currentUserId ? 'text-blue-100' : 'text-slate-500'}`}>
                        <span className="text-xs">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        {/* Enhanced delivery status */}
                        {message.senderId === currentUserId && (
                          <div className="flex items-center space-x-1">
                            {message.isDelivered ? (
                              message.isRead ? (
                                <CheckCheck className="h-3 w-3 text-blue-200" title="Read" />
                              ) : (
                                <CheckCheck className="h-3 w-3 text-blue-300" title="Delivered" />
                              )
                            ) : (
                              <Check className="h-3 w-3 text-blue-200" title="Sent" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Quick Messages Panel */}
            {showQuickMessages && (
              <div className="border-t border-slate-200 p-4 bg-yellow-50">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span>Quick Messages</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickMessages.map((qm) => (
                    <button
                      key={qm.id}
                      onClick={() => handleSendQuickMessage(qm.text)}
                      className="flex items-center space-x-2 px-3 py-2 bg-white hover:bg-yellow-100 border border-yellow-200 rounded-lg text-sm transition-colors text-left"
                    >
                      <span className="text-lg">{qm.icon}</span>
                      <span className="flex-1 truncate">{qm.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Message Input */}
            <div className="border-t border-slate-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                {/* Quick Messages Toggle */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQuickMessages(!showQuickMessages)}
                  className={`${showQuickMessages ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : ''} transition-colors`}
                  title="Quick Messages"
                >
                  <Zap className="h-4 w-4" />
                </Button>
                
                {/* Attachment Button */}
                <Button type="button" variant="outline" size="sm" title="Attach File">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                {/* Message Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    title="Emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send Message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          /* Enhanced No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">Select a conversation</h3>
              <p className="text-slate-600 mb-4">
                Choose a chat to start messaging with your game partners and sports community
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4" />
                  <span>Quick messages</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Game coordination</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Group chats</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2"
            alt="Chat participant"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-slate-900">Sarah Johnson</h3>
            <p className="text-sm text-emerald-600">Online</p>
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
            className={`flex ${message.sender.id === 'current-user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender.id === 'current-user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-900'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender.id === 'current-user' ? 'text-blue-100' : 'text-slate-500'
              }`}>
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        
        {typing.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages */}
      {showQuickMessages && (
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="grid grid-cols-2 gap-2">
            {quickMessages.map((quick) => (
              <button
                key={quick.id}
                onClick={() => handleQuickMessage(quick.id as any)}
                className="p-2 text-left text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="mr-2">{quick.icon}</span>
                {quick.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowQuickMessages(!showQuickMessages)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Clock className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>
          
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;