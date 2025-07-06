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
  Users,
  Search,
  ArrowLeft,
  CheckCheck,
  Check,
  Calendar,
  Zap,
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

// Interface Props
interface ChatInterfaceProps {
  selectedChatId: string;
  currentUserId: string;
  onChatSelect: (chatId: string) => void;
}

// Enhanced Chat Interface Component
const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  selectedChatId, 
  currentUserId,
  onChatSelect, 
}) => {
  const { messages, loading, typing, sendMessage, sendQuickMessage } = useChat(selectedChatId || '');
  const [newMessage, setNewMessage] = useState('');
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick message templates
  const quickMessages = [
    { id: 'on-way', text: "I'm on my way! 🚗", icon: '🚗' },
    { id: 'late', text: 'Running 10 minutes late ⏰', icon: '⏰' },
    { id: 'arrived', text: "I'm here! 📍", icon: '📍' },
    { id: 'ready', text: 'Ready to play! 🏀', icon: '🏀' },
    { id: 'good-game', text: 'Good game everyone! 🎉', icon: '🎉' },
    { id: 'next-time', text: "Let's play again soon! 👋", icon: '👋' },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
return;
}

    await sendMessage(newMessage);
    setNewMessage('');
  };

  // Quick message handler
  const handleQuickMessage = async (messageData: { text: string; icon?: string }) => {
    await sendQuickMessage(messageData);
    setShowQuickMessages(false);
  };

  // Mock current chat info
  const currentChat = {
    id: selectedChatId,
    name: selectedChatId === 'chat-1' ? 'Basketball Game - City Sports' : 'Tennis Match',
    type: 'group',
    participants: ['Ahmed M.', 'Sarah K.', 'Mohamed S.'],
    isGameChat: true,
    gameInfo: {
      sport: 'Basketball',
      date: 'Today, 6:00 PM',
      location: 'City Sports Complex',
    },
  };

  if (!selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
          <p className="text-gray-500">Choose a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChatSelect('')}
            className="lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentChat.name.charAt(0)}
              </div>
              {currentChat.type === 'group' && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="h-2 w-2 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <h2 className="font-semibold text-gray-800">{currentChat.name}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {currentChat.isGameChat && (
                  <>
                    <Calendar className="h-3 w-3" />
                    <span>{currentChat.gameInfo.date}</span>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    <span>{currentChat.gameInfo.location}</span>
                  </>
                )}
                {!currentChat.isGameChat && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          {currentChat.isGameChat && (
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Info Banner */}
      {currentChat.isGameChat && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-blue-900">{currentChat.gameInfo.sport} Game</p>
                <p className="text-sm text-blue-700">{currentChat.gameInfo.date} • {currentChat.gameInfo.location}</p>
              </div>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender.id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.sender.id === currentUserId ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {message.sender.id !== currentUserId && (
                  <img
                    src={message.sender.avatar || 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                    alt={message.sender.firstName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                
                <div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender.id === currentUserId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    } ${message.type === 'quick_message' ? 'border-l-4 border-yellow-400' : ''}`}
                  >
                    {message.type === 'quick_message' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Zap className="h-3 w-3" />
                        <span className="text-xs font-medium">Quick Message</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                  
                  <div className={`flex items-center justify-between mt-2 space-x-2 ${message.sender.id === currentUserId ? 'text-blue-100' : 'text-gray-500'}`}>
                    <span className="text-xs">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </span>
                    
                    {message.sender.id === currentUserId && (
                      <div className="flex items-center space-x-1">
                        {message.isRead ? (
                          <CheckCheck className="h-3 w-3 text-blue-200" />
                        ) : message.isDelivered ? (
                          <CheckCheck className="h-3 w-3 text-blue-300" />
                        ) : (
                          <Check className="h-3 w-3 text-blue-200" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        )}

        {/* Typing Indicators */}
        {typing.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">Someone is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages Panel */}
      {showQuickMessages && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            {quickMessages.map((quick) => (
              <button
                key={quick.id}
                onClick={() => handleQuickMessage(quick)}
                className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-lg">{quick.icon}</span>
                <span className="text-sm text-gray-700">{quick.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowQuickMessages(!showQuickMessages)}
              className={showQuickMessages ? 'bg-yellow-50 border-yellow-300' : ''}
            >
              <Zap className="h-4 w-4" />
            </Button>
            
            <Button type="button" variant="outline" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-full px-4 py-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
