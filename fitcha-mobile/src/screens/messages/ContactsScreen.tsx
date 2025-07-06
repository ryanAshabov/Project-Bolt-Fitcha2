import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

type ContactsScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Contacts'>;

// Mock contacts data
const mockContacts = [
  {
    id: 'user-1',
    name: 'Ahmed Hassan',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'online',
    lastActive: 'Now',
    sports: ['Basketball', 'Tennis'],
    mutualFriends: 3,
  },
  {
    id: 'user-2',
    name: 'Sarah Mohamed',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'online',
    lastActive: 'Now',
    sports: ['Yoga', 'Running'],
    mutualFriends: 2,
  },
  {
    id: 'user-3',
    name: 'Omar Ali',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'offline',
    lastActive: '2h ago',
    sports: ['Football', 'Boxing'],
    mutualFriends: 5,
  },
  {
    id: 'user-4',
    name: 'Nadia Farouk',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'online',
    lastActive: 'Now',
    sports: ['Tennis', 'Badminton'],
    mutualFriends: 1,
  },
  {
    id: 'user-5',
    name: 'Khaled Mahmoud',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'offline',
    lastActive: '1d ago',
    sports: ['Video Games', 'Chess'],
    mutualFriends: 0,
  },
];

const ContactsScreen: React.FC = () => {
  const navigation = useNavigation<ContactsScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState(mockContacts);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleContactSelect = (contactId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // For single selection, navigate to messages with this contact
    navigation.navigate('Messages', { conversationId: `conv-${contactId}` });
  };
  
  const handleCreateGroup = () => {
    if (selectedContacts.length < 2) {
      // Need at least 2 contacts to create a group
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navigate to group creation screen or directly create a group chat
    // For now, just navigate back to messages
    navigation.navigate('Messages');
  };
  
  const renderContactItem = ({ item }: { item: typeof mockContacts[0] }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}
      onPress={() => handleContactSelect(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.contactInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.status === 'online' && (
            <View style={styles.onlineIndicator} />
          )}
        </View>
        
        <View style={styles.contactDetails}>
          <Text style={[
            styles.contactName,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            {item.name}
          </Text>
          
          <View style={styles.contactMeta}>
            <Text style={styles.lastActive}>
              {item.status === 'online' ? 'Online' : item.lastActive}
            </Text>
            
            {item.mutualFriends > 0 && (
              <Text style={styles.mutualFriends}>
                {item.mutualFriends} mutual {item.mutualFriends === 1 ? 'friend' : 'friends'}
              </Text>
            )}
          </View>
          
          <View style={styles.sportTags}>
            {item.sports.map((sport, index) => (
              <View key={index} style={styles.sportTag}>
                <Text style={styles.sportTagText}>{sport}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDark ? '#9CA3AF' : '#6B7280'} 
      />
    </TouchableOpacity>
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
          New Message
        </Text>
      </View>
      
      <View style={[
        styles.searchContainer,
        { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }
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
          placeholder="Search contacts..."
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
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contactsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="people" 
                size={64} 
                color={isDark ? '#4B5563' : '#D1D5DB'} 
              />
              <Text style={[
                styles.emptyTitle,
                { color: isDark ? '#E5E7EB' : '#1F2937' }
              ]}>
                No contacts found
              </Text>
              <Text style={[
                styles.emptyMessage,
                { color: isDark ? '#9CA3AF' : '#6B7280' }
              ]}>
                Try a different search term or add new contacts
              </Text>
            </View>
          }
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  lastActive: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  mutualFriends: {
    fontSize: 12,
    color: '#6B7280',
  },
  sportTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sportTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  sportTagText: {
    fontSize: 10,
    color: '#3B82F6',
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

export default ContactsScreen;