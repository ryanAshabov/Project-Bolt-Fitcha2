import React, { useState } from 'react';
import { Bell, Check, CheckCheck, X, Clock, Trophy, Users, MessageCircle, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

export const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.isRead
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'game_invite': return <Users className="h-5 w-5 text-blue-600" />;
      case 'player_joined': return <Users className="h-5 w-5 text-emerald-600" />;
      case 'achievement': return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 'message': return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case 'weather_alert': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'game_reminder': return <Clock className="h-5 w-5 text-indigo-600" />;
      default: return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-slate-300 bg-white';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 relative"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <CheckCheck className="h-4 w-4 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 py-1.5 px-3 text-sm rounded-md transition-colors ${
                    filter === 'all' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 py-1.5 px-3 text-sm rounded-md transition-colors ${
                    filter === 'unread' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.isRead ? 'text-slate-900' : 'text-slate-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-500 mt-2">
                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="p-1 hover:bg-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};