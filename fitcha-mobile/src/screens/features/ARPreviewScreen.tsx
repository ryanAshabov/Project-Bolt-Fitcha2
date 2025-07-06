import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';

type ARPreviewScreenNavigationProp = StackNavigationProp<MainStackParamList, 'ARPreview'>;

// Mock court data for AR overlay
const mockARCourts = [
  {
    id: 'ar-court-1',
    name: 'Downtown Basketball Court',
    distance: 0.3,
    rating: 4.8,
    price: 25,
    sport: 'Basketball',
    available: true,
    position: { x: 30, y: 40 },
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
  {
    id: 'ar-court-2',
    name: 'Elite Tennis Center',
    distance: 0.8,
    rating: 4.9,
    price: 40,
    sport: 'Tennis',
    available: false,
    position: { x: 70, y: 30 },
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
  {
    id: 'ar-court-3',
    name: 'Community Soccer Field',
    distance: 1.2,
    rating: 4.5,
    price: 35,
    sport: 'Soccer',
    available: true,
    position: { x: 50, y: 60 },
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  },
];

const ARPreviewScreen: React.FC = () => {
  const navigation = useNavigation<ARPreviewScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [selectedCourt, setSelectedCourt] = useState<typeof mockARCourts[0] | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isARActive, setIsARActive] = useState(false);
  
  const cameraRef = useRef<Camera>(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  
  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'AR Court Preview requires camera access to show courts in augmented reality.',
          [
            { 
              text: 'Cancel', 
              onPress: () => navigation.goBack(),
              style: 'cancel'
            },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // This would open settings in a real app
                navigation.goBack();
              }
            }
          ]
        );
      }
    })();
  }, []);
  
  // Request location permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'AR Court Preview requires location access to show nearby courts.',
          [
            { 
              text: 'Continue Anyway', 
              style: 'cancel'
            },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // This would open settings in a real app
              }
            }
          ]
        );
      }
    })();
  }, []);
  
  // Scanning animation
  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnimation.stopAnimation();
    }
    
    return () => {
      scanAnimation.stopAnimation();
    };
  }, [isScanning]);
  
  // Simulate AR detection after a delay
  useEffect(() => {
    if (isScanning && !isARActive) {
      const timer = setTimeout(() => {
        setIsScanning(false);
        setIsARActive(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isScanning, isARActive]);
  
  const handleCourtPress = (court: typeof mockARCourts[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCourt(court);
  };
  
  const handleBookNow = () => {
    if (!selectedCourt) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CourtDetails', { courtId: selectedCourt.id });
  };
  
  const handleCloseDetails = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCourt(null);
  };
  
  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'Basketball': return '🏀';
      case 'Tennis': return '🎾';
      case 'Soccer': return '⚽';
      default: return '🏃';
    }
  };
  
  if (hasPermission === null) {
    return <View />;
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        ratio="16:9"
      >
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>AR Court Preview</Text>
          
          <TouchableOpacity 
            style={styles.cameraToggle}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>
        
        {/* Scanning Overlay */}
        {isScanning && (
          <View style={styles.scanningOverlay}>
            <View style={styles.scanFrame}>
              <Animated.View 
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 200],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <Text style={styles.scanningText}>Scanning for courts...</Text>
            <Text style={styles.scanningSubtext}>Point your camera at courts or sports facilities</Text>
          </View>
        )}
        
        {/* AR Overlays */}
        {isARActive && (
          <View style={styles.arOverlays}>
            {mockARCourts.map((court) => (
              <TouchableOpacity
                key={court.id}
                style={[
                  styles.arMarker,
                  {
                    left: `${court.position.x}%`,
                    top: `${court.position.y}%`,
                  },
                ]}
                onPress={() => handleCourtPress(court)}
              >
                <View style={[
                  styles.arMarkerInner,
                  {
                    backgroundColor: court.available ? '#10B981' : '#EF4444',
                  },
                ]}>
                  <Text style={styles.arMarkerIcon}>{getSportIcon(court.sport)}</Text>
                </View>
                <View style={styles.arMarkerLabel}>
                  <Text style={styles.arMarkerDistance}>{court.distance} km</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Court Details */}
        {selectedCourt && (
          <View style={styles.courtDetailsContainer}>
            <View style={styles.courtDetails}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseDetails}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <View style={styles.courtHeader}>
                <Image 
                  source={{ uri: selectedCourt.image }} 
                  style={styles.courtImage} 
                />
                
                <View style={styles.courtInfo}>
                  <Text style={styles.courtName}>{selectedCourt.name}</Text>
                  
                  <View style={styles.courtMeta}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.ratingText}>{selectedCourt.rating}</Text>
                    </View>
                    
                    <Text style={styles.courtDistance}>{selectedCourt.distance} km</Text>
                    
                    <Text style={styles.courtPrice}>${selectedCourt.price}/hr</Text>
                  </View>
                  
                  <View style={[
                    styles.availabilityBadge,
                    {
                      backgroundColor: selectedCourt.available ? '#D1FAE5' : '#FEE2E2',
                    },
                  ]}>
                    <Text style={[
                      styles.availabilityText,
                      {
                        color: selectedCourt.available ? '#065F46' : '#991B1B',
                      },
                    ]}>
                      {selectedCourt.available ? 'Available Now' : 'Not Available'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.courtActions}>
                <TouchableOpacity 
                  style={[
                    styles.bookButton,
                    {
                      backgroundColor: selectedCourt.available ? '#10B981' : '#9CA3AF',
                    },
                  ]}
                  onPress={handleBookNow}
                  disabled={!selectedCourt.available}
                >
                  <Text style={styles.bookButtonText}>
                    {selectedCourt.available ? 'Book Now' : 'Not Available'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.directionsButton}>
                  <Ionicons name="navigate" size={18} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        
        {/* AR Instructions */}
        {isARActive && !selectedCourt && (
          <View style={styles.arInstructions}>
            <Text style={styles.arInstructionsText}>
              Tap on a marker to see court details
            </Text>
          </View>
        )}
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cameraToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scanningSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 250,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  arOverlays: {
    ...StyleSheet.absoluteFillObject,
  },
  arMarker: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -25 }, { translateY: -50 }],
  },
  arMarkerInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  arMarkerIcon: {
    fontSize: 24,
  },
  arMarkerLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  arMarkerDistance: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  courtDetailsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  courtDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courtHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courtImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  courtInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  courtName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  courtMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#1F2937',
    marginLeft: 2,
  },
  courtDistance: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  courtPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  courtActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  directionsButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arInstructions: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  arInstructionsText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default ARPreviewScreen;