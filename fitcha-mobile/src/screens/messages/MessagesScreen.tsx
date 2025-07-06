import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

type MessagesScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Messages'>;
type MessagesScreenRouteProp = RouteProp<MainStackParamList, 'Messages'>;

// Mock data for conversations
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
      read: false,
    },
    isOnline: true,
    unreadCount: 2,
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
      read: true,
    },
    isOnline: false,
    unreadCount: 0,
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
      read: true,
    },
    isOnline: true,
    unreadCount: 0,
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
      read: true,
    },
    isOnline: false,
    unreadCount: 0,
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
      read: true,
    },
    isOnline: false,
    unreadCount: 0,
  },
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
    type: 'text',
  },
  {
    id: 'msg-2',
    content: 'Yes! What time were you thinking?',
    senderId: 'current-user',
    senderName: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    read: true,
    type: 'text',
  },
  {
    id: 'msg-3',
    content: 'Around 6 PM at the downtown court. I can bring the ball.',
    senderId: 'ahmed-123',
    senderName: 'Ahmed Hassan',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    read: true,
    type: 'text',
  },
  {
    id: 'msg-4',
    content: 'Perfect! I will be there. Should we invite Omar too?',
    senderId: 'current-user',
    senderName: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    read: true,
    type: 'text',
  },
  {
    id: 'msg-5',
    content: 'Great idea! I will message him now.',
    senderId: 'ahmed-123',
    senderName: 'Ahmed Hassan',
    timestamp: new Date(Date.now() - 1000 * 60 * 16),
    read: true,
    type: 'text',
  },
  {
    id: 'msg-6',
    content: 'Great game today! Same time tomorrow?',
    senderId: 'ahmed-123',
    senderName: 'Ahmed Hassan',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    type: 'text',
  },
];

const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const route = useRoute<MessagesScreenRouteProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  
  // If conversation ID is passed in route params, select it
  useEffect(() => {
    if (route.params?.conversationId) {
      setSelectedConversation(route.params.conversationId);
    }
  }, [route.params]);
  
  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [selectedConversation, messages.length]);
  
  // Toggle search bar animation
  useEffect(() => {
    Animated.timing(searchAnimation, {
      toValue: showSearch ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showSearch, searchAnimation]);
  
  const searchHeight = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });
  
  const searchOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
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
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: 'current-user',
      senderName: 'You',
      timestamp: new Date(),
      read: true,
      type: 'text' as const,
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update conversation's last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation
        ? { 
            ...conv, 
            lastMessage: { 
              content: newMessage, 
              timestamp: new Date(), 
              senderId: 'current-user', 
              read: true 
            } 
          }
        : conv
    ));
  };
  
  const handleSelectConversation = (conversationId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedConversation(conversationId);
    
    // Mark conversation as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };
  
  const handleBackToConversations = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedConversation(null);
  };
  
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedConv = conversations.find(conv => conv.id === selectedConversation);
  
  // Render conversation list item
  const renderConversationItem = ({ item }: { item: typeof mockConversations[0] }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}
      onPress={() => handleSelectConversation(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.type === 'direct' && item.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
        {item.type === 'group' && (
          <View style={styles.groupIndicator}>
            <Ionicons name="people" size={10} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <View style={styles.conversationDetails}>
        <View style={styles.conversationHeader}>
          <Text 
            style={[
              styles.conversationName, 
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.timeStamp}>
            {formatTime(item.lastMessage.timestamp)}
          </Text>
        </View>
        
        <View style={styles.messagePreviewContainer}>
          <Text 
            style={[
              styles.messagePreview,
              { color: isDark ? '#9CA3AF' : '#6B7280' }
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.content}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render message bubble
  const renderMessage = ({ item }: { item: typeof mockMessages[0] }) => {
    const isOwnMessage = item.senderId === 'current-user';
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}>
        {!isOwnMessage && (
          <Image source={{ uri: selectedConv?.avatar }} style={styles.messageBubbleAvatar} />
        )}
        
        <View style={[
          styles.messageBubble,
          isOwnMessage 
            ? [styles.ownMessageBubble, { backgroundColor: '#3B82F6' }]
            : [styles.otherMessageBubble, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]
        ]}>
          {!isOwnMessage && selectedConv?.type === 'group' && (
            <Text style={styles.messageSender}>{item.senderName}</Text>
          )}
          
          <Text style={[
            styles.messageText,
            { color: isOwnMessage ? '#FFFFFF' : isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            {item.content}
          </Text>
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : isDark ? '#9CA3AF' : '#6B7280' }
            ]}>
              {formatTime(item.timestamp)}
            </Text>
            
            {isOwnMessage && (
              <Ionicons 
                name={item.read ? "checkmark-done" : "checkmark"} 
                size={16} 
                color="rgba(255,255,255,0.7)" 
                style={styles.readStatus}
              />
            )}
          </View>
        </View>
      </View>
    );
  };
  
  // Render empty conversation state
  const renderEmptyConversations = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons 
        name="chatbubble-ellipses-outline" 
        size={64} 
        color={isDark ? '#4B5563' : '#D1D5DB'} 
      />
      <Text style={[
        styles.emptyStateTitle,
        { color: isDark ? '#E5E7EB' : '#1F2937' }
      ]}>
        No conversations yet
      </Text>
      <Text style={[
        styles.emptyStateSubtitle,
        { color: isDark ? '#9CA3AF' : '#6B7280' }
      ]}>
        Start chatting with players and teams
      </Text>
      <TouchableOpacity 
        style={[styles.newChatButton, { backgroundColor: '#3B82F6' }]}
        onPress={() => navigation.navigate('Contacts')}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" style={styles.newChatIcon} />
        <Text style={styles.newChatText}>New Message</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render conversation list view
  const renderConversationsList = () => (
    <View style={styles.conversationsContainer}>
      {/* Search Bar (Animated) */}
      <Animated.View style={[
        styles.searchContainer,
        { 
          height: searchHeight,
          opacity: searchOpacity,
          backgroundColor: isDark ? '#1F2937' : '#F3F4F6'
        }
      ]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isDark ? '#9CA3AF' : '#6B7280'} 
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}
          placeholder="Search conversations..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {/* Conversations List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.conversationsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyConversations()
      )}
    </View>
  );
  
  // Render chat view
  const renderChatView = () => {
    if (!selectedConversation || !selectedConv) return null;
    
    return (
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat Header */}
        <View style={[
          styles.chatHeader,
          { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
        ]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToConversations}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? '#E5E7EB' : '#1F2937'} 
            />
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <Image source={{ uri: selectedConv.avatar }} style={styles.chatHeaderAvatar} />
            <View>
              <Text style={[
                styles.chatHeaderName,
                { color: isDark ? '#E5E7EB' : '#1F2937' }
              ]}>
                {selectedConv.name}
              </Text>
              <Text style={styles.chatHeaderStatus}>
                {selectedConv.type === 'direct' 
                  ? selectedConv.isOnline ? 'Online' : 'Offline'
                  : `${selectedConv.name.split(' ')[0]} Group`
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.chatHeaderActions}>
            <TouchableOpacity style={styles.chatAction}>
              <Ionicons 
                name="call-outline" 
                size={22} 
                color={isDark ? '#E5E7EB' : '#1F2937'} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatAction}>
              <Ionicons 
                name="videocam-outline" 
                size={22} 
                color={isDark ? '#E5E7EB' : '#1F2937'} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.messagesList,
            { backgroundColor: isDark ? '#111827' : '#F9FAFB' }
          ]}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />
        
        {/* Message Input */}
        <View style={[
          styles.inputContainer,
          { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
        ]}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons 
              name="add-circle-outline" 
              size={24} 
              color={isDark ? '#E5E7EB' : '#1F2937'} 
            />
          </TouchableOpacity>
          
          <TextInput
            style={[
              styles.messageInput,
              { 
                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                color: isDark ? '#E5E7EB' : '#1F2937'
              }
            ]}
            placeholder="Type a message..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              { backgroundColor: newMessage.trim() ? '#3B82F6' : isDark ? '#374151' : '#E5E7EB' }
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={newMessage.trim() ? '#FFFFFF' : isDark ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? '#111827' : '#F9FAFB' }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {!selectedConversation && (
        <View style={styles.header}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            Messages
          </Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerAction}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Ionicons 
                name="search" 
                size={24} 
                color={isDark ? '#E5E7EB' : '#1F2937'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerAction}
              onPress={() => navigation.navigate('Contacts')}
            >
              <Ionicons 
                name="create-outline" 
                size={24} 
                color={isDark ? '#E5E7EB' : '#1F2937'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {selectedConversation ? renderChatView() : renderConversationsList()}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  conversationsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  groupIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeStamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreview: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  newChatIcon: {
    marginRight: 8,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAction: {
    padding: 8,
    marginLeft: 4,
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '100%',
  },
  ownMessageBubble: {
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  readStatus: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  attachButton: {
    padding: 8,
  },
  messageInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;