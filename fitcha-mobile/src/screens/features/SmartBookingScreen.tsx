import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform
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

type SmartBookingScreenNavigationProp = StackNavigationProp<MainStackParamList, 'SmartBooking'>;

interface SmartBookingOptions {
  autoRebook: boolean;
  flexibleTime: boolean;
  groupScheduling: boolean;
  backupCourt: boolean;
  dynamicPricing: boolean;
  loyaltyPoints: boolean;
}

interface BookingPreference {
  sport: string;
  preferredTimes: string[];
  maxDistance: number;
  priceRange: { min: number; max: number };
  skillLevel: string;
  recurringPattern?: {
    frequency: 'weekly' | 'monthly';
    dayOfWeek: number;
    time: string;
  };
}

const SmartBookingScreen: React.FC = () => {
  const navigation = useNavigation<SmartBookingScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [smartOptions, setSmartOptions] = useState<SmartBookingOptions>({
    autoRebook: false,
    flexibleTime: false,
    groupScheduling: false,
    backupCourt: false,
    dynamicPricing: true,
    loyaltyPoints: true,
  });

  const [preferences, setPreferences] = useState<BookingPreference>({
    sport: 'Basketball',
    preferredTimes: ['18:00', '19:00', '20:00'],
    maxDistance: 10,
    priceRange: { min: 0, max: 100 },
    skillLevel: 'Intermediate',
    recurringPattern: {
      frequency: 'weekly',
      dayOfWeek: 5, // Friday
      time: '18:00',
    },
  });

  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Generate AI suggestions based on user preferences
  useEffect(() => {
    generateAISuggestions();
  }, [preferences]);
  
  const generateAISuggestions = () => {
    // Mock AI suggestions based on user preferences and behavior
    const suggestions = [
      {
        id: '1',
        type: 'optimal_time',
        title: 'Optimal Booking Time',
        description: 'Based on your data analysis, your best time is Friday at 6 PM',
        confidence: 92,
        action: 'Book Now',
        savings: 15,
      },
      {
        id: '2',
        type: 'price_alert',
        title: 'Price Alert',
        description: 'Elite Tennis Center will drop prices by 20% tomorrow',
        confidence: 87,
        action: 'Book Tomorrow',
        savings: 20,
      },
      {
        id: '3',
        type: 'group_opportunity',
        title: 'Group Opportunity',
        description: 'Join Ahmed\'s group to save 30% on court fees',
        confidence: 78,
        action: 'Join Group',
        savings: 30,
      },
    ];

    setAiSuggestions(suggestions);
  };
  
  const handleSmartBooking = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      Alert.alert(
        "Smart Booking Activated",
        "We'll notify you when we find the perfect booking based on your preferences.",
        [{ text: "OK" }]
      );
    }, 2000);
  };
  
  const toggleOption = (option: keyof SmartBookingOptions) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSmartOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return { bg: '#D1FAE5', text: '#065F46' };
    if (confidence >= 80) return { bg: '#EFF6FF', text: '#1E40AF' };
    if (confidence >= 70) return { bg: '#FEF3C7', text: '#92400E' };
    return { bg: '#FEE2E2', text: '#991B1B' };
  };
  
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
          Smart Booking
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Banner */}
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.bannerContent}>
            <Ionicons name="bulb" size={32} color="#FFFFFF" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>AI-Powered Booking</Text>
              <Text style={styles.bannerDescription}>
                Let our AI find the perfect court and time based on your preferences
              </Text>
            </View>
          </View>
        </LinearGradient>
        
        {/* AI Suggestions */}
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash" size={20} color="#3B82F6" />
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              Smart Suggestions
            </Text>
          </View>
          
          <View style={styles.suggestionsContainer}>
            {aiSuggestions.map((suggestion) => {
              const confidenceColor = getConfidenceColor(suggestion.confidence);
              
              return (
                <View 
                  key={suggestion.id}
                  style={[
                    styles.suggestionCard,
                    { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                  ]}
                >
                  <View style={styles.suggestionHeader}>
                    <Text style={[
                      styles.suggestionTitle,
                      { color: isDark ? '#E5E7EB' : '#1F2937' }
                    ]}>
                      {suggestion.title}
                    </Text>
                    <View style={[
                      styles.confidenceBadge,
                      { backgroundColor: confidenceColor.bg }
                    ]}>
                      <Text style={[
                        styles.confidenceText,
                        { color: confidenceColor.text }
                      ]}>
                        {suggestion.confidence}% confidence
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[
                    styles.suggestionDescription,
                    { color: isDark ? '#D1D5DB' : '#4B5563' }
                  ]}>
                    {suggestion.description}
                  </Text>
                  
                  <View style={styles.suggestionFooter}>
                    <Text style={styles.savingsText}>
                      💰 Save {suggestion.savings}%
                    </Text>
                    
                    <TouchableOpacity 
                      style={[
                        styles.actionButton,
                        { backgroundColor: '#3B82F6' }
                      ]}
                    >
                      <Text style={styles.actionButtonText}>{suggestion.action}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Smart Options */}
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options" size={20} color="#3B82F6" />
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? '#E5E7EB' : '#1F2937' }
            ]}>
              Smart Booking Options
            </Text>
          </View>
          
          <View style={styles.optionsContainer}>
            <View style={[
              styles.optionItem,
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
            ]}>
              <View style={styles.optionInfo}>
                <View style={[
                  styles.optionIconContainer,
                  { backgroundColor: '#EFF6FF' }
                ]}>
                  <Ionicons name="repeat" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={[
                    styles.optionTitle,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    Auto Rebook
                  </Text>
                  <Text style={styles.optionDescription}>
                    Automatically book the same time each week
                  </Text>
                </View>
              </View>
              <Switch
                value={smartOptions.autoRebook}
                onValueChange={() => toggleOption('autoRebook')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : smartOptions.autoRebook ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            
            <View style={[
              styles.optionItem,
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
            ]}>
              <View style={styles.optionInfo}>
                <View style={[
                  styles.optionIconContainer,
                  { backgroundColor: '#F0FDF4' }
                ]}>
                  <Ionicons name="time" size={20} color="#10B981" />
                </View>
                <View>
                  <Text style={[
                    styles.optionTitle,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    Flexible Time
                  </Text>
                  <Text style={styles.optionDescription}>
                    Search within a wider time range
                  </Text>
                </View>
              </View>
              <Switch
                value={smartOptions.flexibleTime}
                onValueChange={() => toggleOption('flexibleTime')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : smartOptions.flexibleTime ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            
            <View style={[
              styles.optionItem,
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
            ]}>
              <View style={styles.optionInfo}>
                <View style={[
                  styles.optionIconContainer,
                  { backgroundColor: '#EDE9FE' }
                ]}>
                  <Ionicons name="people" size={20} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={[
                    styles.optionTitle,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    Group Scheduling
                  </Text>
                  <Text style={styles.optionDescription}>
                    Coordinate with friends' schedules
                  </Text>
                </View>
              </View>
              <Switch
                value={smartOptions.groupScheduling}
                onValueChange={() => toggleOption('groupScheduling')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : smartOptions.groupScheduling ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            
            <View style={[
              styles.optionItem,
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
            ]}>
              <View style={styles.optionInfo}>
                <View style={[
                  styles.optionIconContainer,
                  { backgroundColor: '#FEF3C7' }
                ]}>
                  <Ionicons name="shield" size={20} color="#F59E0B" />
                </View>
                <View>
                  <Text style={[
                    styles.optionTitle,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    Backup Court
                  </Text>
                  <Text style={styles.optionDescription}>
                    Book a backup court for safety
                  </Text>
                </View>
              </View>
              <Switch
                value={smartOptions.backupCourt}
                onValueChange={() => toggleOption('backupCourt')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : smartOptions.backupCourt ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            
            <View style={[
              styles.optionItem,
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
            ]}>
              <View style={styles.optionInfo}>
                <View style={[
                  styles.optionIconContainer,
                  { backgroundColor: '#FEE2E2' }
                ]}>
                  <Ionicons name="card" size={20} color="#EF4444" />
                </View>
                <View>
                  <Text style={[
                    styles.optionTitle,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    Dynamic Pricing
                  </Text>
                  <Text style={styles.optionDescription}>
                    Take advantage of price fluctuations
                  </Text>
                </View>
              </View>
              <Switch
                value={smartOptions.dynamicPricing}
                onValueChange={() => toggleOption('dynamicPricing')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : smartOptions.dynamicPricing ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            
            <View style={[
              styles.optionItem,
              { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
            ]}>
              <View style={styles.optionInfo}>
                <View style={[
                  styles.optionIconContainer,
                  { backgroundColor: '#FEF3C7' }
                ]}>
                  <Ionicons name="flash" size={20} color="#F59E0B" />
                </View>
                <View>
                  <Text style={[
                    styles.optionTitle,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    Loyalty Points
                  </Text>
                  <Text style={styles.optionDescription}>
                    Use points for discounts
                  </Text>
                </View>
              </View>
              <Switch
                value={smartOptions.loyaltyPoints}
                onValueChange={() => toggleOption('loyaltyPoints')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : smartOptions.loyaltyPoints ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
          </View>
        </View>
        
        {/* Loyalty Points */}
        <LinearGradient
          colors={['#F59E0B', '#D97706']}
          style={styles.loyaltyCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.loyaltyCardContent}>
            <View>
              <Text style={styles.loyaltyCardTitle}>Loyalty Points</Text>
              <Text style={styles.loyaltyCardDescription}>
                Use your points for exclusive discounts
              </Text>
            </View>
            
            <View style={styles.loyaltyPointsContainer}>
              <Text style={styles.loyaltyPointsValue}>{loyaltyPoints.toLocaleString()}</Text>
              <Text style={styles.loyaltyPointsLabel}>points available</Text>
            </View>
          </View>
          
          <View style={styles.loyaltyTiers}>
            <View style={styles.loyaltyTier}>
              <Text style={styles.loyaltyTierValue}>500 pts</Text>
              <Text style={styles.loyaltyTierLabel}>10% off</Text>
            </View>
            
            <View style={styles.loyaltyTier}>
              <Text style={styles.loyaltyTierValue}>1000 pts</Text>
              <Text style={styles.loyaltyTierLabel}>20% off</Text>
            </View>
            
            <View style={styles.loyaltyTier}>
              <Text style={styles.loyaltyTierValue}>2000 pts</Text>
              <Text style={styles.loyaltyTierLabel}>Free booking</Text>
            </View>
          </View>
        </LinearGradient>
        
        {/* Activate Button */}
        <TouchableOpacity
          style={[
            styles.activateButton,
            isProcessing ? styles.activateButtonDisabled : null
          ]}
          onPress={handleSmartBooking}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="bulb" size={20} color="#FFFFFF" style={styles.activateButtonIcon} />
              <Text style={styles.activateButtonText}>Activate Smart Booking</Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.activateDescription}>
          We'll analyze your preferences and find the best available options automatically
        </Text>
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
  banner: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bannerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  suggestionsContainer: {
    gap: 12,
  },
  suggestionCard: {
    borderRadius: 12,
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  suggestionDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  suggestionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  loyaltyCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  loyaltyCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  loyaltyCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  loyaltyCardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: 200,
  },
  loyaltyPointsContainer: {
    alignItems: 'center',
  },
  loyaltyPointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loyaltyPointsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  loyaltyTiers: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  loyaltyTier: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
  loyaltyTierValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  loyaltyTierLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  activateButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  activateButtonIcon: {
    marginRight: 8,
  },
  activateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activateDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default SmartBookingScreen;