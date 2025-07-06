import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Camera from 'expo-camera';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

type SmartFeaturesScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const SmartFeaturesScreen: React.FC = () => {
  const navigation = useNavigation<SmartFeaturesScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check location permission
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    setHasLocationPermission(locationStatus === 'granted');
    
    // Check camera permission
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus === 'granted');
    
    // Check notification permission
    const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
    setHasNotificationPermission(notificationStatus === 'granted');
  };

  const features = [
    {
      id: 'voice-commands',
      title: 'Voice Commands',
      description: 'Control the app using your voice',
      icon: 'mic-outline',
      color: '#F43F5E', // rose-500
      gradientStart: '#F43F5E',
      gradientEnd: '#E11D48',
      requiresPermission: false,
    },
    {
      id: 'ar-preview',
      title: 'AR Court Preview',
      description: 'See courts in augmented reality',
      icon: 'scan-outline',
      color: '#8B5CF6', // violet-500
      gradientStart: '#8B5CF6',
      gradientEnd: '#7C3AED',
      requiresPermission: true,
      permission: hasCameraPermission ? 'granted' : 'denied',
      permissionType: 'camera',
    },
    {
      id: 'ai-concierge',
      title: 'AI Court Concierge',
      description: 'Get personalized court recommendations',
      icon: 'bulb-outline',
      color: '#3B82F6', // blue-500
      gradientStart: '#3B82F6',
      gradientEnd: '#2563EB',
      requiresPermission: false,
    },
    {
      id: 'real-time-rating',
      title: 'Real-time Ratings',
      description: 'Live court conditions and crowd levels',
      icon: 'star-outline',
      color: '#F59E0B', // amber-500
      gradientStart: '#F59E0B',
      gradientEnd: '#D97706',
      requiresPermission: true,
      permission: hasLocationPermission ? 'granted' : 'denied',
      permissionType: 'location',
    },
    {
      id: 'smart-booking',
      title: 'Smart Booking',
      description: 'AI-powered booking recommendations',
      icon: 'calendar-outline',
      color: '#10B981', // emerald-500
      gradientStart: '#10B981',
      gradientEnd: '#059669',
      requiresPermission: false,
    },
    {
      id: 'push-notifications',
      title: 'Smart Notifications',
      description: 'Context-aware notifications',
      icon: 'notifications-outline',
      color: '#6366F1', // indigo-500
      gradientStart: '#6366F1',
      gradientEnd: '#4F46E5',
      requiresPermission: true,
      permission: hasNotificationPermission ? 'granted' : 'denied',
      permissionType: 'notifications',
    },
  ];

  const handleFeaturePress = (featureId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const feature = features.find(f => f.id === featureId);
    
    if (feature?.requiresPermission && feature.permission === 'denied') {
      requestPermission(feature.permissionType);
      return;
    }
    
    setActiveFeature(featureId);
    
    // Handle feature-specific actions
    switch (featureId) {
      case 'voice-commands':
        startVoiceRecognition();
        break;
      case 'ar-preview':
        navigation.navigate('ARPreview');
        break;
      case 'ai-concierge':
        // Show AI concierge UI
        break;
      case 'real-time-rating':
        // Show real-time ratings
        break;
      case 'smart-booking':
        navigation.navigate('SmartBooking');
        break;
      case 'push-notifications':
        // Show notification settings
        break;
    }
  };

  const requestPermission = async (permissionType: string) => {
    switch (permissionType) {
      case 'camera':
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus === 'granted');
        if (cameraStatus !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'AR Court Preview requires camera access to show courts in augmented reality.',
            [{ text: 'OK' }]
          );
        }
        break;
      case 'location':
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(locationStatus === 'granted');
        if (locationStatus !== 'granted') {
          Alert.alert(
            'Location Permission Required',
            'Real-time Ratings requires location access to show nearby courts.',
            [{ text: 'OK' }]
          );
        }
        break;
      case 'notifications':
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        setHasNotificationPermission(notificationStatus === 'granted');
        if (notificationStatus !== 'granted') {
          Alert.alert(
            'Notification Permission Required',
            'Smart Notifications require permission to send you timely alerts.',
            [{ text: 'OK' }]
          );
        }
        break;
    }
  };

  const startVoiceRecognition = async () => {
    try {
      setIsListening(true);
      setVoiceInput('Listening...');
      
      // This is a mock implementation since React Native doesn't have built-in speech recognition
      // In a real app, you would use a library like react-native-voice
      setTimeout(() => {
        setVoiceInput('Show me basketball courts nearby');
        processVoiceCommand('Show me basketball courts nearby');
        setIsListening(false);
      }, 2000);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      Alert.alert('Error', 'Could not start voice recognition');
    }
  };

  const processVoiceCommand = (command: string) => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Speak response
      speakResponse(`I found 5 basketball courts near you. Would you like to see them?`);
      
      // Navigate or perform action based on command
      if (command.toLowerCase().includes('basketball') && command.toLowerCase().includes('court')) {
        // In a real app, you would set filters and navigate
        setTimeout(() => {
          navigation.navigate('Search', { sport: 'basketball' });
        }, 3000);
      }
    }, 1500);
  };

  const speakResponse = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const renderVoiceCommandsUI = () => (
    <View style={styles.featureContent}>
      <View style={[styles.voiceContainer, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}>
        <View style={[styles.voiceIndicator, { 
          backgroundColor: isListening ? '#F43F5E' : '#D1D5DB',
          transform: [{ scale: isListening ? 1.2 : 1 }]
        }]} />
        
        <Text style={[styles.voiceText, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
          {voiceInput || 'Tap the microphone to start speaking'}
        </Text>
        
        {isProcessing && (
          <ActivityIndicator size="small" color="#3B82F6" style={styles.processingIndicator} />
        )}
      </View>
      
      <TouchableOpacity
        style={[styles.micButton, { backgroundColor: isListening ? '#F43F5E' : '#3B82F6' }]}
        onPress={startVoiceRecognition}
        disabled={isListening || isProcessing}
      >
        <Ionicons 
          name={isListening ? "mic" : "mic-outline"} 
          size={32} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
      
      <View style={styles.commandsContainer}>
        <Text style={[styles.commandsTitle, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
          Try saying:
        </Text>
        
        <View style={styles.commandsList}>
          {[
            "Show me basketball courts nearby",
            "Find tennis courts in downtown",
            "Book a court for tomorrow evening",
            "What's the weather for outdoor courts?",
            "Show my upcoming bookings"
          ].map((command, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.commandItem, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}
              onPress={() => {
                setVoiceInput(command);
                processVoiceCommand(command);
              }}
            >
              <Text style={[styles.commandText, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
                "{command}"
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
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
        
        <Text style={[styles.headerTitle, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
          Smart Features
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
          AI-Powered Features
        </Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[
                styles.featureCard,
                { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
                activeFeature === feature.id && styles.activeFeatureCard
              ]}
              onPress={() => handleFeaturePress(feature.id)}
            >
              <LinearGradient
                colors={[feature.gradientStart, feature.gradientEnd]}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={feature.icon as any} size={24} color="#FFFFFF" />
              </LinearGradient>
              
              <Text style={[styles.featureTitle, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
                {feature.title}
              </Text>
              
              <Text style={[styles.featureDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {feature.description}
              </Text>
              
              {feature.requiresPermission && feature.permission === 'denied' && (
                <View style={styles.permissionBadge}>
                  <Text style={styles.permissionText}>Requires Permission</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {activeFeature === 'voice-commands' && renderVoiceCommandsUI()}
        
        <View style={styles.comingSoonContainer}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.comingSoonBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="rocket-outline" size={24} color="#FFFFFF" />
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          </LinearGradient>
          
          <View style={[styles.comingSoonContent, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Text style={[styles.comingSoonFeature, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
              🧠 AI Performance Analysis
            </Text>
            <Text style={[styles.comingSoonFeature, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
              🥽 VR Training Sessions
            </Text>
            <Text style={[styles.comingSoonFeature, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
              🌐 Global Matchmaking
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeFeatureCard: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  permissionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '500',
  },
  featureContent: {
    marginTop: 16,
    marginBottom: 24,
  },
  voiceContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  voiceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  voiceText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  processingIndicator: {
    marginTop: 8,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  commandsContainer: {
    marginTop: 16,
  },
  commandsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  commandsList: {
    gap: 8,
  },
  commandItem: {
    padding: 12,
    borderRadius: 12,
  },
  commandText: {
    fontSize: 14,
  },
  comingSoonContainer: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  comingSoonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  comingSoonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoonContent: {
    padding: 16,
  },
  comingSoonFeature: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
});

export default SmartFeaturesScreen;