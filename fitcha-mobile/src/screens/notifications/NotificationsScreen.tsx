import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

type NotificationsScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Notifications'>;

// Notification types
type NotificationType = 
  | 'game_invite' 
  | 'player_joined' 
  | 'achievement' 
  | 'message' 
  | 'weather_alert' 
  | 'game_reminder' 
  | 'friend_request'
  | 'rating_received'
  | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  data?: any;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'game_invite',
    title: 'Game Invitation',
    message: 'Ahmed invited you to play football tomorrow at 3 PM',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    data: { gameId: 'game-1', from: 'ahmed-id' },
    actionUrl: '/games/game-1',
    priority: 'high',
  },
  {
    id: '2',
    type: 'player_joined',
    title: 'Player Joined',
    message: 'Mohammed joined your basketball game',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    data: { gameId: 'game-2', playerId: 'mohammed-id' },
    actionUrl: '/games/game-2',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You earned the "Team Player" badge',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    data: { achievementId: 'team-player' },
    priority: 'low',
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'Sarah sent you a message',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: true,
    data: { conversationId: 'conv-1', senderId: 'sarah-id' },
    actionUrl: '/messages/conv-1',
    priority: 'medium',
  },
  {
    id: '5',
    type: 'weather_alert',
    title: 'Weather Alert',
    message: 'Rain expected during your scheduled outdoor game tomorrow',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: false,
    data: { gameId: 'game-3', weatherCondition: 'rain' },
    priority: 'high',
  },
  {
    id: '6',
    type: 'game_reminder',
    title: 'Game Reminder',
    message: 'Your football match starts in 1 hour',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isRead: false,
    data: { gameId: 'game-4' },
    priority: 'urgent',
  },
  {
    id: '7',
    type: 'friend_request',
    title: 'Friend Request',
    message: 'Khalid sent you a friend request',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isRead: true,
    data: { userId: 'khalid-id' },
    priority: 'medium',
  },
  {
    id: '8',
    type: 'rating_received',
    title: 'New Rating',
    message: 'You received a 5-star rating from Omar',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    data: { userId: 'omar-id', rating: 5 },
    priority: 'low',
  },
  {
    id: '9',
    type: 'system',
    title: 'System Update',
    message: 'Fitcha app has been updated to version 2.0',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    priority: 'low',
  },
];

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.isRead
  );
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  const markAsRead = (notificationId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Mark All as Read",
      "Are you sure you want to mark all notifications as read?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Mark All", 
          onPress: () => {
            setNotifications(prev => 
              prev.map(notification => ({ ...notification, isRead: true }))
            );
          }
        }
      ]
    );
  };
  
  const deleteNotification = (notificationId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setNotifications(prev => 
              prev.filter(notification => notification.id !== notificationId)
            );
          }
        }
      ]
    );
  };
  
  const handleNotificationPress = (notification: Notification) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'game_invite':
        navigation.navigate('GameDetails', { gameId: notification.data?.gameId });
        break;
      case 'player_joined':
        navigation.navigate('GameDetails', { gameId: notification.data?.gameId });
        break;
      case 'achievement':
        navigation.navigate('Profile', { tab: 'achievements' });
        break;
      case 'message':
        navigation.navigate('Messages', { conversationId: notification.data?.conversationId });
        break;
      case 'weather_alert':
        navigation.navigate('GameDetails', { gameId: notification.data?.gameId });
        break;
      case 'game_reminder':
        navigation.navigate('GameDetails', { gameId: notification.data?.gameId });
        break;
      case 'friend_request':
        navigation.navigate('OtherProfile', { userId: notification.data?.userId });
        break;
      case 'rating_received':
        navigation.navigate('Profile', { tab: 'stats' });
        break;
      case 'system':
        // No action for system notifications
        break;
    }
  };
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'game_invite': return { name: 'game-controller-outline', color: '#3B82F6' };
      case 'player_joined': return { name: 'person-add-outline', color: '#10B981' };
      case 'achievement': return { name: 'trophy-outline', color: '#F59E0B' };
      case 'message': return { name: 'chatbubble-outline', color: '#8B5CF6' };
      case 'weather_alert': return { name: 'rainy-outline', color: '#EF4444' };
      case 'game_reminder': return { name: 'alarm-outline', color: '#EC4899' };
      case 'friend_request': return { name: 'person-outline', color: '#6366F1' };
      case 'rating_received': return { name: 'star-outline', color: '#F59E0B' };
      case 'system': return { name: 'information-circle-outline', color: '#9CA3AF' };
    }
  };
  
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return { borderColor: '#EF4444', bgColor: '#FEF2F2' };
      case 'high': return { borderColor: '#F59E0B', bgColor: '#FEF3C7' };
      case 'medium': return { borderColor: '#3B82F6', bgColor: '#EFF6FF' };
      case 'low': return { borderColor: '#9CA3AF', bgColor: '#F3F4F6' };
      default: return { borderColor: '#9CA3AF', bgColor: '#F3F4F6' };
    }
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };
  
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);
    const priorityStyle = getPriorityStyle(item.priority);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { 
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderLeftColor: priorityStyle.borderColor,
            opacity: item.isRead ? 0.8 : 1,
          }
        ]}
        onPress={() => handleNotificationPress(item)}
        onLongPress={() => deleteNotification(item.id)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.notificationIconContainer,
          { backgroundColor: priorityStyle.bgColor }
        ]}>
          <Ionicons name={icon.name as any} size={24} color={icon.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[
              styles.notificationTitle,
              { 
                color: isDark ? '#E5E7EB' : '#1F2937',
                fontWeight: item.isRead ? '500' : '700',
              }
            ]}>
              {item.title}
            </Text>
            <Text style={styles.notificationTime}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
          
          <Text style={[
            styles.notificationMessage,
            { color: isDark ? '#D1D5DB' : '#4B5563' }
          ]}>
            {item.message}
          </Text>
          
          {!item.isRead && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="notifications-off-outline" 
        size={64} 
        color={isDark ? '#4B5563' : '#9CA3AF'} 
      />
      <Text style={[
        styles.emptyTitle,
        { color: isDark ? '#E5E7EB' : '#1F2937' }
      ]}>
        No notifications
      </Text>
      <Text style={[
        styles.emptyMessage,
        { color: isDark ? '#9CA3AF' : '#6B7280' }
      ]}>
        {filter === 'unread' 
          ? "You've read all your notifications"
          : "You don't have any notifications yet"}
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? '#111827' : '#F9FAFB' }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? '#E5E7EB' : '#1F2937'} 
          />
        </TouchableOpacity>
        
        <Text style={[
          styles.headerTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          Notifications
        </Text>
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllReadButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && { 
              backgroundColor: isDark ? '#3B82F6' : '#3B82F6',
            }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterButtonText,
            filter === 'all' && { color: '#FFFFFF' }
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'unread' && { 
              backgroundColor: isDark ? '#3B82F6' : '#3B82F6',
            }
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[
            styles.filterButtonText,
            filter === 'unread' && { color: '#FFFFFF' }
          ]}>
            Unread
            {unreadCount > 0 && ` (${unreadCount})`}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#3B82F6']}
              tintColor={isDark ? '#3B82F6' : '#3B82F6'}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  markAllReadButton: {
    padding: 8,
  },
  markAllReadText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    padding: 16,
    paddingTop: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 0,
    right: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default NotificationsScreen;