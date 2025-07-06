import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { Court } from '../../types';

// Mock data
import { mockCourts } from '../../data/mockData';

type CourtsScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const { width } = Dimensions.get('window');

const CourtsScreen: React.FC = () => {
  const navigation = useNavigation<CourtsScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  
  const [courts, setCourts] = useState<Court[]>(mockCourts);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>(mockCourts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  // Request location permission and get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, []);

  // Filter courts based on search query and selected sport
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = courts;
      
      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(court => 
          court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          court.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filter by sport
      if (selectedSport !== 'All') {
        filtered = filtered.filter(court => 
          court.sport.includes(selectedSport)
        );
      }
      
      setFilteredCourts(filtered);
      setLoading(false);
    }, 500);
  }, [searchQuery, selectedSport, courts]);

  const sportCategories = [
    { id: 'All', name: 'All' },
    { id: 'Basketball', name: 'Basketball' },
    { id: 'Tennis', name: 'Tennis' },
    { id: 'Football', name: 'Football' },
    { id: 'Soccer', name: 'Soccer' },
    { id: 'Volleyball', name: 'Volleyball' },
  ];

  const renderCourtItem = ({ item }: { item: Court }) => (
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
        
        <View style={styles.sportTags}>
          {item.sport.map((sport, index) => (
            <View 
              key={index} 
              style={[styles.sportTag, { backgroundColor: theme.primary + '20' }]}
            >
              <Text style={[styles.sportTagText, { color: theme.primary }]}>
                {sport}
              </Text>
            </View>
          ))}
          
          <View 
            style={[
              styles.sportTag, 
              { backgroundColor: item.isIndoor ? theme.secondary + '20' : theme.info + '20' }
            ]}
          >
            <Text 
              style={[
                styles.sportTagText, 
                { color: item.isIndoor ? theme.secondary : theme.info }
              ]}
            >
              {item.isIndoor ? 'Indoor' : 'Outdoor'}
            </Text>
          </View>
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
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Find Courts</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.mapToggle, { backgroundColor: theme.card }]}
            onPress={() => setShowMap(!showMap)}
          >
            <Ionicons 
              name={showMap ? 'list-outline' : 'map-outline'} 
              size={20} 
              color={theme.text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: theme.card }]}
            onPress={() => {/* Open filter modal */}}
          >
            <Ionicons name="options-outline" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search courts by name or location..."
            placeholderTextColor={theme.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Sport Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={sportCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedSport === item.id && { backgroundColor: theme.primary },
              ]}
              onPress={() => setSelectedSport(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedSport === item.id ? 'white' : theme.text },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {/* Map View */}
      {showMap ? (
        <View style={styles.mapContainer}>
          {locationPermission ? (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: userLocation?.coords.latitude || 24.7136,
                longitude: userLocation?.coords.longitude || 46.6753,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {filteredCourts.map((court) => (
                <Marker
                  key={court.id}
                  coordinate={{
                    latitude: court.coordinates.lat,
                    longitude: court.coordinates.lng,
                  }}
                  title={court.name}
                  description={`${court.sport.join(', ')} - $${court.price}/hr`}
                  onPress={() => navigation.navigate('CourtDetail', { courtId: court.id })}
                />
              ))}
            </MapView>
          ) : (
            <View style={[styles.permissionContainer, { backgroundColor: theme.card }]}>
              <Ionicons name="location-off" size={48} color={theme.textSecondary} />
              <Text style={[styles.permissionText, { color: theme.text }]}>
                Location permission is required to show the map
              </Text>
              <TouchableOpacity 
                style={[styles.permissionButton, { backgroundColor: theme.primary }]}
                onPress={async () => {
                  const { status } = await Location.requestForegroundPermissionsAsync();
                  setLocationPermission(status === 'granted');
                }}
              >
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        // List View
        <>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : filteredCourts.length > 0 ? (
            <FlatList
              data={filteredCourts}
              renderItem={renderCourtItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.courtsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
              <Ionicons name="search" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.text }]}>
                No courts found
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#E5E7EB',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  courtsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  courtCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  courtImage: {
    width: '100%',
    height: 160,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courtLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courtLocationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  sportTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  sportTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  sportTagText: {
    fontSize: 12,
    fontWeight: '500',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 20,
    borderRadius: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CourtsScreen;