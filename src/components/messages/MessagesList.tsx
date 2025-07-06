import React from 'react';
import { mockConversations } from '../../data/mockData';
import { Crown } from 'lucide-react';

export const MessagesList: React.FC = () => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  const getConversationDisplay = (conversation: any) => {
    if (conversation.type === 'direct') {
      // For direct conversations, get the other participant (not the current user)
      const otherParticipant = conversation.participants.find((p: any) => p.id !== 'current-user-id') || conversation.participants[0];
      return {
        avatar: otherParticipant?.avatar || '/default-avatar.png',
        name: `${otherParticipant?.firstName || 'Unknown'} ${otherParticipant?.lastName || 'User'}`,
        isPro: otherParticipant?.isPro || false,
        isOnline: otherParticipant?.isOnline || false,
        verified: otherParticipant?.verified || false,
      };
    } else {
      // For game conversations, use conversation-level properties
      return {
        avatar: conversation.avatar || '/default-avatar.png',
        name: conversation.name || 'Game Chat',
        isPro: false,
        isOnline: false,
        verified: false,
      };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 h-96 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">Messages</h2>
      </div>
      
      <div className="divide-y divide-slate-100">
        {mockConversations.map((conversation) => {
          const displayInfo = getConversationDisplay(conversation);
          
          return (
            <div
              key={conversation.id}
              className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={displayInfo.avatar}
                    alt={displayInfo.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {displayInfo.isPro && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                  )}
                  {displayInfo.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <p className="font-medium text-slate-900 truncate">
                        {displayInfo.name}
                      </p>
                      {displayInfo.verified && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'
                  }`}>
                    {conversation.lastMessage.content}
                  </p>
                </div>
                
                {conversation.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-200">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all messages
        </button>
      </div>
    </div>
  );
};