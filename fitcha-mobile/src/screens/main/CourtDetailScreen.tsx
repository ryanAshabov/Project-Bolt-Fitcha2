import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  ActivityIndicator,
  Share,
  Platform,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { Court } from '../../types';

// Mock data
import { mockCourts } from '../../data/mockData';

type CourtDetailScreenRouteProp = RouteProp<MainStackParamList, 'CourtDetail'>;
type CourtDetailScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const { width } = Dimensions.get('window');

const CourtDetailScreen: React.FC = () => {
  const route = useRoute<CourtDetailScreenRouteProp>();
  const navigation = useNavigation<CourtDetailScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  
  const { courtId } = route.params;
  const [court, setCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    const loadCourt = async () => {
      setLoading(true);
      // In a real app, you would fetch the court from Firebase
      // For now, we'll just use mock data
      const foundCourt = mockCourts.find(c => c.id === courtId);
      
      if (foundCourt) {
        setCourt(foundCourt);
      }
      
      // Get user location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
      
      setLoading(false);
    };
    
    loadCourt();
  }, [courtId]);

  const handleShare = async () => {
    if (!court) return;
    
    try {
      await Share.share({
        title: court.name,
        message: `Check out ${court.name} on Fitcha! ${court.sport.join(', ')} court for $${court.price}/hr at ${court.location}.`,
        url: 'https://fitcha.app/courts/' + court.id,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleGetDirections = () => {
    if (!court) return;
    
    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    const url = Platform.select({
      ios: `${scheme}?q=${court.name}&ll=${court.coordinates.lat},${court.coordinates.lng}`,
      android: `${scheme}0,0?q=${court.coordinates.lat},${court.coordinates.lng}(${court.name})`,
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleCall = () => {
    if (!court || !court.contactInfo?.phone) return;
    
    Linking.openURL(`tel:${court.contactInfo.phone}`);
  };

  const handleBooking = () => {
    navigation.navigate('Booking', { courtId });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!court) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.text }]}>Court not found</Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: theme.card }]}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? theme.error : theme.text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: theme.card }]}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Court Images */}
        <Image source={{ uri: court.image }} style={styles.courtImage} />
        
        {/* Court Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.courtName, { color: theme.text }]}>{court.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {court.rating} ({court.reviews})
              </Text>
            </View>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.locationText, { color: theme.textSecondary }]}>
              {court.location}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Price:</Text>
            <Text style={[styles.priceValue, { color: theme.text }]}>${court.price}/hr</Text>
          </View>
          
          {/* Sport Tags */}
          <View style={styles.tagsContainer}>
            {court.sport.map((sport, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: theme.primary + '20' }]}
              >
                <Text style={[styles.tagText, { color: theme.primary }]}>
                  {sport}
                </Text>
              </View>
            ))}
            
            <View 
              style={[
                styles.tag, 
                { backgroundColor: court.isIndoor ? theme.secondary + '20' : theme.info + '20' }
              ]}
            >
              <Text 
                style={[
                  styles.tagText, 
                  { color: court.isIndoor ? theme.secondary : theme.info }
                ]}
              >
                {court.isIndoor ? 'Indoor' : 'Outdoor'}
              </Text>
            </View>
          </View>
          
          {/* Amenities */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {court.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <View style={[styles.amenityIcon, { backgroundColor: theme.primary + '20' }]}>
                    <Ionicons 
                      name={getAmenityIcon(amenity)} 
                      size={16} 
                      color={theme.primary} 
                    />
                  </View>
                  <Text style={[styles.amenityText, { color: theme.text }]}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Hours */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Operating Hours</Text>
            <View style={styles.hoursContainer}>
              {Object.entries(court.operatingHours).map(([day, hours], index) => (
                <View key={index} style={styles.hourRow}>
                  <Text style={[styles.dayText, { color: theme.text }]}>
                    {capitalizeFirstLetter(day)}
                  </Text>
                  <Text style={[styles.hoursText, { color: theme.textSecondary }]}>
                    {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Map */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Location</Text>
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: court.coordinates.lat,
                  longitude: court.coordinates.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: court.coordinates.lat,
                    longitude: court.coordinates.lng,
                  }}
                  title={court.name}
                  description={court.location}
                />
              </MapView>
              
              <TouchableOpacity 
                style={[styles.directionsButton, { backgroundColor: theme.primary }]}
                onPress={handleGetDirections}
              >
                <Ionicons name="navigate" size={18} color="white" />
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Contact */}
          {court.contactInfo && (
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact</Text>
              <View style={styles.contactContainer}>
                {court.contactInfo.phone && (
                  <TouchableOpacity 
                    style={[styles.contactButton, { backgroundColor: theme.card }]}
                    onPress={handleCall}
                  >
                    <Ionicons name="call-outline" size={20} color={theme.primary} />
                    <Text style={[styles.contactButtonText, { color: theme.text }]}>Call</Text>
                  </TouchableOpacity>
                )}
                
                {court.contactInfo.email && (
                  <TouchableOpacity 
                    style={[styles.contactButton, { backgroundColor: theme.card }]}
                    onPress={() => Linking.openURL(`mailto:${court.contactInfo?.email}`)}
                  >
                    <Ionicons name="mail-outline" size={20} color={theme.primary} />
                    <Text style={[styles.contactButtonText, { color: theme.text }]}>Email</Text>
                  </TouchableOpacity>
                )}
                
                {court.contactInfo.website && (
                  <TouchableOpacity 
                    style={[styles.contactButton, { backgroundColor: theme.card }]}
                    onPress={() => Linking.openURL(court.contactInfo?.website || '')}
                  >
                    <Ionicons name="globe-outline" size={20} color={theme.primary} />
                    <Text style={[styles.contactButtonText, { color: theme.text }]}>Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Booking Button */}
      <View style={[styles.bookingContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: theme.textSecondary }]}>Price</Text>
          <Text style={[styles.priceAmount, { color: theme.text }]}>${court.price}/hr</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.bookingButton, { backgroundColor: theme.primary }]}
          onPress={handleBooking}
        >
          <Text style={styles.bookingButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Helper function to get icon for amenity
const getAmenityIcon = (amenity: string): string => {
  const amenityMap: Record<string, string> = {
    'Parking': 'car-outline',
    'Showers': 'water-outline',
    'Lockers': 'lock-closed-outline',
    'Water Fountain': 'water-outline',
    'Wifi': 'wifi-outline',
    'Pro Shop': 'cart-outline',
    'Coaching': 'person-outline',
    'Changing Rooms': 'shirt-outline',
    'Floodlights': 'flashlight-outline',
    'Seating': 'people-outline',
  };
  
  return amenityMap[amenity] || 'checkmark-circle-outline';
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  courtImage: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courtName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  amenityText: {
    fontSize: 14,
  },
  hoursContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 14,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  directionsButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  directionsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  contactButtonText: {
    fontSize: 14,
    marginTop: 4,
  },
  bookingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 14,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookingButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourtDetailScreen;