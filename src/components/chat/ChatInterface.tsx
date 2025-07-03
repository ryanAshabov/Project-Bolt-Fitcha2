import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, MapPin, Clock } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  conversationId: string;
  onClose?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId, onClose }) => {
  const { messages, loading, typing, sendMessage, sendQuickMessage, markAsRead } = useChat(conversationId);
  const [newMessage, setNewMessage] = useState('');
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickMessages = [
    { id: 'on_my_way', label: "I'm on my way!", icon: '🚗' },
    { id: 'running_late', label: 'Running late', icon: '⏰' },
    { id: 'arrived', label: "I'm here!", icon: '📍' },
    { id: 'cancelled', label: 'Need to cancel', icon: '😔' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  const handleQuickMessage = (messageType: any) => {
    sendQuickMessage(messageType);
    setShowQuickMessages(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
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