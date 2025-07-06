import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data for development
import { mockCourts, mockActivities } from '../../data/mockData';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingGames, setUpcomingGames] = useState(mockActivities);
  const [nearbyCourts, setNearbyCourts] = useState(mockCourts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // In a real app, you would fetch data from Firebase here
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: theme.text }]}>
          Hello, {user?.firstName || 'there'}! 👋
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Ready to play today?
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.notificationButton, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Ionicons name="notifications-outline" size={24} color={theme.text} />
        <View style={[styles.notificationBadge, { backgroundColor: theme.notification }]}>
          <Text style={styles.notificationCount}>3</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity 
        style={[styles.mainAction, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('CreateGame')}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.mainActionText}>Let's Play!</Text>
      </TouchableOpacity>
      
      <View style={styles.secondaryActions}>
        <TouchableOpacity 
          style={[styles.secondaryAction, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('FindPartners')}
        >
          <Ionicons name="people-outline" size={20} color={theme.primary} />
          <Text style={[styles.secondaryActionText, { color: theme.text }]}>Find Partners</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.secondaryAction, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('SmartFeatures')}
        >
          <Ionicons name="flash-outline" size={20} color={theme.primary} />
          <Text style={[styles.secondaryActionText, { color: theme.text }]}>Smart Features</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUpcomingGames = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Games</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      ) : upcomingGames.length > 0 ? (
        <FlatList
          data={upcomingGames}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.gameCard, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
            >
              <View style={styles.gameCardHeader}>
                <View style={[styles.gameTypeTag, { backgroundColor: theme.primary + '20' }]}>
                  <Text style={[styles.gameTypeText, { color: theme.primary }]}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Text>
                </View>
                <Text style={[styles.gameTime, { color: theme.textSecondary }]}>
                  {new Date(item.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <Text style={[styles.gameTitle, { color: theme.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              
              <View style={styles.gameLocation}>
                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.gameLocationText, { color: theme.textSecondary }]} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
              
              <View style={styles.gameFooter}>
                <View style={styles.participantsContainer}>
                  <Text style={[styles.participantsText, { color: theme.text }]}>
                    {item.currentParticipants.length}/{item.maxParticipants}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.joinButton, { backgroundColor: theme.primary }]}
                >
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
          <Ionicons name="calendar-outline" size={40} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No upcoming games</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Create a game or join one to get started
          </Text>
        </View>
      )}
    </View>
  );

  const renderNearbyCourts = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Nearby Courts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Courts')}>
          <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      ) : nearbyCourts.length > 0 ? (
        <FlatList
          data={nearbyCourts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.courtCard, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate('CourtDetail', { courtId: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.courtImage} />
              <View style={styles.courtPriceTag}>
                <Text style={styles.courtPrice}>${item.price}/hr</Text>
              </View>
              
              <View style={styles.courtCardContent}>
                <Text style={[styles.courtName, { color: theme.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                
                <View style={styles.courtLocation}>
                  <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                  <Text style={[styles.courtLocationText, { color: theme.textSecondary }]} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
                
                <View style={styles.courtFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={[styles.ratingText, { color: theme.text }]}>
                      {item.rating} ({item.reviews})
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.bookButton, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('Booking', { courtId: item.id })}
                  >
                    <Text style={styles.bookButtonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
          <Ionicons name="map-outline" size={40} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No courts found nearby</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Try expanding your search area
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderQuickActions()}
            {renderUpcomingGames()}
            {renderNearbyCourts()}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  mainAction: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    flexDirection: 'row',
    width: '48%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  gameCard: {
    width: 250,
    borderRadius: 16,
    padding: 16,
    marginLeft: 20,
    marginBottom: 8,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gameTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  gameTime: {
    fontSize: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gameLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameLocationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  courtCard: {
    width: 250,
    borderRadius: 16,
    marginLeft: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },
  courtImage: {
    width: '100%',
    height: 120,
  },
  courtPriceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  courtPrice: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  courtCardContent: {
    padding: 16,
  },
  courtName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courtLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courtLocationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  courtFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  bookButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  loader: {
    marginVertical: 20,
  },
});

export default HomeScreen;