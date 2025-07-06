import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  TextInput,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

type ProfileScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Profile'>;

// Mock user data
const mockUserProfile = {
  id: '1',
  name: 'Ahmed Mohammed',
  email: 'ahmed.mohammed@fitcha.app',
  phone: '+966501234567',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face',
  coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop',
  location: 'Riyadh, Saudi Arabia',
  bio: 'Passionate football player, love playing in different courts and making new friends. My goal is to improve my skills and reach professional level.',
  joinDate: '2023-01-15',
  verified: true,
  level: 'Advanced',
  rating: 4.8,
  totalGames: 145,
  wins: 98,
  favoritePosition: 'Midfielder',
  preferredGameType: 'Football',
  
  // Stats
  stats: {
    totalMatches: 145,
    winRate: 67.6,
    averageRating: 4.8,
    totalHours: 289,
    bestStreak: 12,
    monthlyGames: 18,
    goals: 67,
    assists: 34,
    cleanSheets: 23,
  },

  // Achievements
  achievements: [
    { id: 1, title: 'First Goal', description: 'Score your first goal', icon: 'football-outline', earned: true, date: '2023-02-01' },
    { id: 2, title: 'Player of the Month', description: 'Best player of the month', icon: 'trophy-outline', earned: true, date: '2023-06-15' },
    { id: 3, title: 'Game Organizer', description: 'Organize 10 games', icon: 'people-outline', earned: true, date: '2023-08-20' },
    { id: 4, title: 'Rising Star', description: 'Get 5-star rating 5 times in a row', icon: 'star-outline', earned: true, date: '2023-09-10' },
    { id: 5, title: 'Warrior', description: 'Win 100 matches', icon: 'trophy-outline', earned: false, progress: 67 },
    { id: 6, title: 'Marathoner', description: 'Play 500 hours', icon: 'time-outline', earned: false, progress: 57.8 },
  ],

  // Recent Activity
  recentActivity: [
    { id: 1, type: 'game', title: 'Match at King Fahd Stadium', date: '2024-01-15', result: 'Won 3-2' },
    { id: 2, type: 'achievement', title: 'Earned "Game Organizer" achievement', date: '2024-01-14' },
    { id: 3, type: 'rating', title: 'Received 5-star rating', date: '2024-01-13' },
    { id: 4, type: 'game', title: 'Match at Al-Ahli Club', date: '2024-01-12', result: 'Draw 1-1' },
    { id: 5, type: 'friend', title: 'Added new friend - Salem Al-Ahmad', date: '2024-01-11' },
  ],

  // Social Links
  socialLinks: {
    instagram: '@ahmed_fitcha',
    twitter: '@ahmed_football',
    website: 'ahmedfootball.com',
  },

  // Friends
  friends: [
    { id: 1, name: 'Salem Al-Ahmad', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', status: 'online' },
    { id: 2, name: 'Mohammed Al-Ali', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', status: 'offline' },
    { id: 3, name: 'Faisal Al-Khalid', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', status: 'playing' },
    { id: 4, name: 'Abdullah Al-Saad', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face', status: 'online' },
  ],
};

const initialLayout = { width: Dimensions.get('window').width };

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();
  
  const [userProfile, setUserProfile] = useState(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(mockUserProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Tab view state
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'overview', title: 'Overview' },
    { key: 'stats', title: 'Stats' },
    { key: 'achievements', title: 'Achievements' },
    { key: 'activity', title: 'Activity' },
  ]);
  
  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsEditing(true);
  };
  
  const handleSaveProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setUserProfile(editedProfile);
      setIsEditing(false);
      setIsSaving(false);
      
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully.",
        [{ text: "OK" }]
      );
    }, 1500);
  };
  
  const handleCancelEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditedProfile(userProfile);
    setIsEditing(false);
  };
  
  const pickImage = async (type: 'avatar' | 'cover') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to change your photo.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [3, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (type === 'avatar') {
        setEditedProfile(prev => ({ ...prev, avatar: result.assets[0].uri }));
      } else {
        setEditedProfile(prev => ({ ...prev, coverImage: result.assets[0].uri }));
      }
    }
  };
  
  const takePicture = async (type: 'avatar' | 'cover') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take a photo.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [3, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (type === 'avatar') {
        setEditedProfile(prev => ({ ...prev, avatar: result.assets[0].uri }));
      } else {
        setEditedProfile(prev => ({ ...prev, coverImage: result.assets[0].uri }));
      }
    }
  };
  
  const showImageOptions = (type: 'avatar' | 'cover') => {
    Alert.alert(
      type === 'avatar' ? "Change Profile Picture" : "Change Cover Photo",
      "Choose an option",
      [
        { text: "Take Photo", onPress: () => takePicture(type) },
        { text: "Choose from Library", onPress: () => pickImage(type) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'playing': return '#3B82F6';
      case 'offline': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };
  
  // Tab view scenes
  const OverviewTab = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Bio Section */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          Bio
        </Text>
        
        {isEditing ? (
          <TextInput
            style={[
              styles.bioInput,
              { 
                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                color: isDark ? '#E5E7EB' : '#1F2937'
              }
            ]}
            value={editedProfile.bio}
            onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
            multiline
            numberOfLines={4}
            placeholder="Tell us about yourself..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          />
        ) : (
          <Text style={[
            styles.bioText,
            { color: isDark ? '#D1D5DB' : '#4B5563' }
          ]}>
            {userProfile.bio}
          </Text>
        )}
      </View>
      
      {/* Stats Overview */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          Stats Overview
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={[
            styles.statCard,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.totalMatches}
            </Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          
          <View style={[
            styles.statCard,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.winRate}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
          
          <View style={[
            styles.statCard,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.goals}
            </Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
          
          <View style={[
            styles.statCard,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.totalHours}
            </Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>
      </View>
      
      {/* Recent Achievements */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <View style={styles.sectionHeader}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            Recent Achievements
          </Text>
          
          <TouchableOpacity onPress={() => setIndex(2)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.achievementsContainer}>
          {userProfile.achievements
            .filter(a => a.earned)
            .slice(0, 3)
            .map(achievement => (
              <View 
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                ]}
              >
                <View style={styles.achievementIconContainer}>
                  <Ionicons 
                    name={achievement.icon as any} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </View>
                
                <View style={styles.achievementDetails}>
                  <Text style={[
                    styles.achievementTitle,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    {achievement.title}
                  </Text>
                  
                  <Text style={styles.achievementDate}>
                    {new Date(achievement.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          }
        </View>
      </View>
      
      {/* Friends */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <View style={styles.sectionHeader}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            Friends
          </Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.friendsContainer}
        >
          {userProfile.friends.map(friend => (
            <TouchableOpacity 
              key={friend.id}
              style={styles.friendCard}
              onPress={() => navigation.navigate('OtherProfile', { userId: friend.id })}
            >
              <View style={styles.friendAvatarContainer}>
                <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                <View style={[
                  styles.friendStatus,
                  { backgroundColor: getStatusColor(friend.status) }
                ]} />
              </View>
              
              <Text style={[
                styles.friendName,
                { color: isDark ? '#E5E7EB' : '#1F2937' }
              ]}
              numberOfLines={1}>
                {friend.name}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={[
              styles.addFriendCard,
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
            ]}
            onPress={() => navigation.navigate('FindPartners')}
          >
            <View style={styles.addFriendIcon}>
              <Ionicons name="add" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.addFriendText}>Find More</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
  
  const StatsTab = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Performance Stats */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          Performance Stats
        </Text>
        
        <View style={styles.statsList}>
          <View style={styles.statItem}>
            <Text style={[
              styles.statItemLabel,
              { color: isDark ? '#D1D5DB' : '#4B5563' }
            ]}>
              Goals
            </Text>
            <Text style={[
              styles.statItemValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.goals}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[
              styles.statItemLabel,
              { color: isDark ? '#D1D5DB' : '#4B5563' }
            ]}>
              Assists
            </Text>
            <Text style={[
              styles.statItemValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.assists}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[
              styles.statItemLabel,
              { color: isDark ? '#D1D5DB' : '#4B5563' }
            ]}>
              Clean Sheets
            </Text>
            <Text style={[
              styles.statItemValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.cleanSheets}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[
              styles.statItemLabel,
              { color: isDark ? '#D1D5DB' : '#4B5563' }
            ]}>
              Win Rate
            </Text>
            <Text style={[
              styles.statItemValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.winRate}%
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[
              styles.statItemLabel,
              { color: isDark ? '#D1D5DB' : '#4B5563' }
            ]}>
              Total Hours
            </Text>
            <Text style={[
              styles.statItemValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.totalHours}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[
              styles.statItemLabel,
              { color: isDark ? '#D1D5DB' : '#4B5563' }
            ]}>
              Best Streak
            </Text>
            <Text style={[
              styles.statItemValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.stats.bestStreak} wins
            </Text>
          </View>
        </View>
      </View>
      
      {/* Game Preferences */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          Game Preferences
        </Text>
        
        <View style={styles.preferencesContainer}>
          <View style={[
            styles.preferenceCard,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Ionicons 
              name="football-outline" 
              size={28} 
              color="#3B82F6" 
              style={styles.preferenceIcon}
            />
            <Text style={[
              styles.preferenceLabel,
              { color: isDark ? '#9CA3AF' : '#6B7280' }
            ]}>
              Favorite Sport
            </Text>
            <Text style={[
              styles.preferenceValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.preferredGameType}
            </Text>
          </View>
          
          <View style={[
            styles.preferenceCard,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Ionicons 
              name="location-outline" 
              size={28} 
              color="#10B981" 
              style={styles.preferenceIcon}
            />
            <Text style={[
              styles.preferenceLabel,
              { color: isDark ? '#9CA3AF' : '#6B7280' }
            ]}>
              Position
            </Text>
            <Text style={[
              styles.preferenceValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.favoritePosition}
            </Text>
          </View>
          
          <View style={[
            styles.preferenceCard,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Ionicons 
              name="star-outline" 
              size={28} 
              color="#F59E0B" 
              style={styles.preferenceIcon}
            />
            <Text style={[
              styles.preferenceLabel,
              { color: isDark ? '#9CA3AF' : '#6B7280' }
            ]}>
              Skill Level
            </Text>
            <Text style={[
              styles.preferenceValue,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.level}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Performance Chart Placeholder */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          Performance Trend
        </Text>
        
        <View style={[
          styles.chartPlaceholder,
          { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
        ]}>
          <Ionicons 
            name="bar-chart-outline" 
            size={48} 
            color={isDark ? '#4B5563' : '#9CA3AF'} 
          />
          <Text style={[
            styles.chartPlaceholderText,
            { color: isDark ? '#9CA3AF' : '#6B7280' }
          ]}>
            Performance chart coming soon
          </Text>
        </View>
      </View>
    </ScrollView>
  );
  
  const AchievementsTab = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Earned Achievements */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          Earned Achievements
        </Text>
        
        <View style={styles.achievementsGrid}>
          {userProfile.achievements
            .filter(a => a.earned)
            .map(achievement => (
              <View 
                key={achievement.id}
                style={[
                  styles.achievementGridCard,
                  { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                ]}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.achievementGridIcon}
                >
                  <Ionicons 
                    name={achievement.icon as any} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
                
                <Text style={[
                  styles.achievementGridTitle,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  {achievement.title}
                </Text>
                
                <Text style={[
                  styles.achievementGridDesc,
                  { color: isDark ? '#9CA3AF' : '#6B7280' }
                ]}>
                  {achievement.description}
                </Text>
                
                <Text style={styles.achievementGridDate}>
                  {new Date(achievement.date).toLocaleDateString()}
                </Text>
              </View>
            ))
          }
        </View>
      </View>
      
      {/* In Progress Achievements */}
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          In Progress
        </Text>
        
        <View style={styles.inProgressContainer}>
          {userProfile.achievements
            .filter(a => !a.earned)
            .map(achievement => (
              <View 
                key={achievement.id}
                style={[
                  styles.inProgressCard,
                  { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                ]}
              >
                <View style={styles.inProgressHeader}>
                  <View style={styles.inProgressIconContainer}>
                    <Ionicons 
                      name={achievement.icon as any} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </View>
                  
                  <View style={styles.inProgressInfo}>
                    <Text style={[
                      styles.inProgressTitle,
                      { color: isDark ? '#E5E7EB' : '#1F2937' }
                    ]}>
                      {achievement.title}
                    </Text>
                    
                    <Text style={[
                      styles.inProgressDesc,
                      { color: isDark ? '#9CA3AF' : '#6B7280' }
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar,
                        { width: `${achievement.progress}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{achievement.progress}%</Text>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    </ScrollView>
  );
  
  const ActivityTab = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[
        styles.sectionContainer,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#E5E7EB' : '#1F2937' }
        ]}>
          Recent Activity
        </Text>
        
        <View style={styles.activityList}>
          {userProfile.recentActivity.map(activity => (
            <View 
              key={activity.id}
              style={[
                styles.activityItem,
                { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
              ]}
            >
              <View style={styles.activityIconContainer}>
                <Ionicons 
                  name={
                    activity.type === 'game' ? 'football-outline' :
                    activity.type === 'achievement' ? 'trophy-outline' :
                    activity.type === 'rating' ? 'star-outline' :
                    'person-add-outline'
                  } 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
              
              <View style={styles.activityDetails}>
                <Text style={[
                  styles.activityTitle,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  {activity.title}
                </Text>
                
                <Text style={styles.activityDate}>
                  {new Date(activity.date).toLocaleDateString()}
                </Text>
                
                {'result' in activity && activity.result && (
                  <Text style={[
                    styles.activityResult,
                    { color: activity.result.includes('Won') ? '#10B981' : '#6B7280' }
                  ]}>
                    {activity.result}
                  </Text>
                )}
              </View>
              
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
  
  const renderScene = SceneMap({
    overview: OverviewTab,
    stats: StatsTab,
    achievements: AchievementsTab,
    activity: ActivityTab,
  });
  
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#3B82F6' }}
      style={{ 
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#374151' : '#E5E7EB',
      }}
      labelStyle={{ 
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'none',
      }}
      activeColor="#3B82F6"
      inactiveColor={isDark ? '#9CA3AF' : '#6B7280'}
    />
  );
  
  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? '#111827' : '#F9FAFB' }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <Image 
          source={{ uri: isEditing ? editedProfile.coverImage : userProfile.coverImage }}
          style={styles.coverImage}
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          style={styles.coverGradient}
        />
        
        {isEditing && (
          <TouchableOpacity 
            style={styles.changeCoverButton}
            onPress={() => showImageOptions('cover')}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.changeCoverText}>Change Cover</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={[styles.editActionButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.editActionButton, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      {/* Profile Info */}
      <View style={styles.profileInfoContainer}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: isEditing ? editedProfile.avatar : userProfile.avatar }}
            style={styles.avatar}
          />
          
          {userProfile.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          )}
          
          {isEditing && (
            <TouchableOpacity 
              style={styles.changeAvatarButton}
              onPress={() => showImageOptions('avatar')}
            >
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.nameContainer}>
          {isEditing ? (
            <TextInput
              style={[
                styles.nameInput,
                { color: isDark ? '#E5E7EB' : '#1F2937' }
              ]}
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
              placeholder="Your name"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          ) : (
            <Text style={[
              styles.userName,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.name}
            </Text>
          )}
          
          <View style={styles.userInfoRow}>
            <Ionicons 
              name="location-outline" 
              size={16} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
              style={styles.infoIcon}
            />
            
            {isEditing ? (
              <TextInput
                style={[
                  styles.locationInput,
                  { color: isDark ? '#D1D5DB' : '#4B5563' }
                ]}
                value={editedProfile.location}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, location: text }))}
                placeholder="Your location"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              />
            ) : (
              <Text style={[
                styles.userLocation,
                { color: isDark ? '#D1D5DB' : '#4B5563' }
              ]}>
                {userProfile.location}
              </Text>
            )}
          </View>
          
          <View style={styles.userInfoRow}>
            <Ionicons 
              name="calendar-outline" 
              size={16} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
              style={styles.infoIcon}
            />
            <Text style={[
              styles.joinDate,
              { color: isDark ? '#D1D5DB' : '#4B5563' }
            ]}>
              Joined {new Date(userProfile.joinDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={[
            styles.statBadge,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={[
              styles.statBadgeText,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.rating}
            </Text>
          </View>
          
          <View style={[
            styles.statBadge,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statBadgeText,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.level}
            </Text>
          </View>
          
          <View style={[
            styles.statBadge,
            { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statBadgeText,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              {userProfile.totalGames} games
            </Text>
          </View>
        </View>
      </View>
      
      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    height: 150,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  changeCoverButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeCoverText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  profileHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
  },
  editActions: {
    flexDirection: 'row',
  },
  editActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfoContainer: {
    marginTop: -40,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changeAvatarButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    marginTop: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    padding: 4,
    borderRadius: 4,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoIcon: {
    marginRight: 4,
  },
  userLocation: {
    fontSize: 14,
  },
  locationInput: {
    fontSize: 14,
    flex: 1,
    padding: 4,
    borderRadius: 4,
  },
  joinDate: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  tabContentContainer: {
    padding: 16,
  },
  sectionContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bioInput: {
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  friendsContainer: {
    paddingVertical: 8,
  },
  friendCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  friendAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  friendStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  friendName: {
    fontSize: 12,
    textAlign: 'center',
  },
  addFriendCard: {
    alignItems: 'center',
    width: 70,
  },
  addFriendIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addFriendText: {
    fontSize: 12,
    color: '#3B82F6',
  },
  statsList: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItemLabel: {
    fontSize: 14,
  },
  statItemValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  preferencesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preferenceCard: {
    width: '31%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  preferenceIcon: {
    marginBottom: 8,
  },
  preferenceLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 14,
    marginTop: 8,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementGridCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  achievementGridIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementGridTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementGridDesc: {
    fontSize: 12,
    marginBottom: 8,
  },
  achievementGridDate: {
    fontSize: 10,
    color: '#6B7280',
  },
  inProgressContainer: {
    gap: 12,
  },
  inProgressCard: {
    borderRadius: 12,
    padding: 12,
  },
  inProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inProgressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inProgressInfo: {
    flex: 1,
  },
  inProgressTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  inProgressDesc: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    width: 40,
    textAlign: 'right',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityResult: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default ProfileScreen;