import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Application from 'expo-application';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types and hooks
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

type SettingsScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [gameInvitesEnabled, setGameInvitesEnabled] = useState(true);
  const [chatNotificationsEnabled, setChatNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Check biometric availability
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricAvailable(compatible);
      
      if (compatible) {
        const savedSetting = await AsyncStorage.getItem('biometricEnabled');
        setBiometricEnabled(savedSetting === 'true');
      }
    })();
  }, []);
  
  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const notificationsValue = await AsyncStorage.getItem('notificationsEnabled');
        const gameInvitesValue = await AsyncStorage.getItem('gameInvitesEnabled');
        const chatNotificationsValue = await AsyncStorage.getItem('chatNotificationsEnabled');
        const locationValue = await AsyncStorage.getItem('locationEnabled');
        const offlineModeValue = await AsyncStorage.getItem('offlineMode');
        
        if (notificationsValue !== null) setNotificationsEnabled(notificationsValue === 'true');
        if (gameInvitesValue !== null) setGameInvitesEnabled(gameInvitesValue === 'true');
        if (chatNotificationsValue !== null) setChatNotificationsEnabled(chatNotificationsValue === 'true');
        if (locationValue !== null) setLocationEnabled(locationValue === 'true');
        if (offlineModeValue !== null) setOfflineMode(offlineModeValue === 'true');
        
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading settings:', error);
        setDataLoaded(true);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              // Navigation will be handled by the auth state change
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert("Error", "Failed to logout. Please try again.");
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };
  
  const toggleBiometric = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (value) {
      // Verify biometric before enabling
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
        fallbackLabel: 'Use passcode',
      });
      
      if (result.success) {
        setBiometricEnabled(true);
        await AsyncStorage.setItem('biometricEnabled', 'true');
      }
    } else {
      setBiometricEnabled(false);
      await AsyncStorage.setItem('biometricEnabled', 'false');
    }
  };
  
  const toggleNotifications = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive updates.",
          [{ text: "OK" }]
        );
        return;
      }
    }
    
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', value.toString());
  };
  
  const toggleSetting = async (setting: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (setting) {
      case 'gameInvites':
        setGameInvitesEnabled(value);
        await AsyncStorage.setItem('gameInvitesEnabled', value.toString());
        break;
      case 'chatNotifications':
        setChatNotificationsEnabled(value);
        await AsyncStorage.setItem('chatNotificationsEnabled', value.toString());
        break;
      case 'location':
        setLocationEnabled(value);
        await AsyncStorage.setItem('locationEnabled', value.toString());
        break;
      case 'offlineMode':
        setOfflineMode(value);
        await AsyncStorage.setItem('offlineMode', value.toString());
        
        if (value) {
          Alert.alert(
            "Offline Mode Enabled",
            "The app will use cached data when offline. Some features may be limited.",
            [{ text: "OK" }]
          );
        }
        break;
    }
  };
  
  const clearCache = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Clear Cache",
      "This will clear all cached data. The app will restart.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            // Show loading indicator
            Alert.alert("Clearing cache...");
            
            // Simulate cache clearing
            setTimeout(() => {
              Alert.alert(
                "Cache Cleared",
                "All cached data has been cleared.",
                [{ text: "OK" }]
              );
            }, 1500);
          }
        }
      ]
    );
  };
  
  const deleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // Show confirmation dialog with password verification
            Alert.alert(
              "Confirm Deletion",
              "Please confirm that you want to permanently delete your account. All your data will be lost.",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Delete Permanently", 
                  style: "destructive",
                  onPress: () => {
                    // Implement account deletion logic
                    Alert.alert("Account deletion initiated");
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };
  
  if (!dataLoaded) {
    return (
      <SafeAreaView style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#F9FAFB' }
      ]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }
  
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
          Settings
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            Account
          </Text>
          
          <View style={[
            styles.settingsCard,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#EFF6FF' }
                ]}>
                  <Ionicons name="person" size={20} color="#3B82F6" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Edit Profile
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
            
            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
            ]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#FEF3C7' }
                ]}>
                  <Ionicons name="key" size={20} color="#F59E0B" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Change Password
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
            
            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
            ]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('PrivacySettings')}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#ECFDF5' }
                ]}>
                  <Ionicons name="shield" size={20} color="#10B981" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Privacy Settings
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            Preferences
          </Text>
          
          <View style={[
            styles.settingsCard,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#EDE9FE' }
                ]}>
                  <Ionicons name="moon" size={20} color="#8B5CF6" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDark ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            
            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
            ]} />
            
            {isBiometricAvailable && (
              <>
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[
                      styles.settingIconContainer,
                      { backgroundColor: '#FEF2F2' }
                    ]}>
                      <Ionicons name="finger-print" size={20} color="#EF4444" />
                    </View>
                    <View>
                      <Text style={[
                        styles.settingText,
                        { color: isDark ? '#E5E7EB' : '#1F2937' }
                      ]}>
                        Biometric Login
                      </Text>
                      <Text style={styles.settingDescription}>
                        Use Face ID or Touch ID to login
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={biometricEnabled}
                    onValueChange={toggleBiometric}
                    trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : biometricEnabled ? '#FFFFFF' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>
                
                <View style={[
                  styles.divider,
                  { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
                ]} />
              </>
            )}
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#F0FDF4' }
                ]}>
                  <Ionicons name="location" size={20} color="#22C55E" />
                </View>
                <View>
                  <Text style={[
                    styles.settingText,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    Location Services
                  </Text>
                  <Text style={styles.settingDescription}>
                    Enable for court finding and distance calculation
                  </Text>
                </View>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={(value) => toggleSetting('location', value)}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : locationEnabled ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            
            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
            ]} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#EFF6FF' }
                ]}>
                  <Ionicons name="cloud-offline" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={[
                    styles.settingText,
                    { color: isDark ? '#E5E7EB' : '#1F2937' }
                  ]}>
                    Offline Mode
                  </Text>
                  <Text style={styles.settingDescription}>
                    Save data for offline use
                  </Text>
                </View>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={(value) => toggleSetting('offlineMode', value)}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : offlineMode ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
          </View>
        </View>
        
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            Notifications
          </Text>
          
          <View style={[
            styles.settingsCard,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#FEF2F2' }
                ]}>
                  <Ionicons name="notifications" size={20} color="#EF4444" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Push Notifications
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : notificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>
            
            {notificationsEnabled && (
              <>
                <View style={[
                  styles.divider,
                  { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
                ]} />
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[
                      styles.settingIconContainer,
                      { backgroundColor: '#FEF3C7' }
                    ]}>
                      <Ionicons name="game-controller" size={20} color="#F59E0B" />
                    </View>
                    <Text style={[
                      styles.settingText,
                      { color: isDark ? '#E5E7EB' : '#1F2937' }
                    ]}>
                      Game Invites
                    </Text>
                  </View>
                  <Switch
                    value={gameInvitesEnabled}
                    onValueChange={(value) => toggleSetting('gameInvites', value)}
                    trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : gameInvitesEnabled ? '#FFFFFF' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>
                
                <View style={[
                  styles.divider,
                  { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
                ]} />
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={[
                      styles.settingIconContainer,
                      { backgroundColor: '#E0E7FF' }
                    ]}>
                      <Ionicons name="chatbubble" size={20} color="#6366F1" />
                    </View>
                    <Text style={[
                      styles.settingText,
                      { color: isDark ? '#E5E7EB' : '#1F2937' }
                    ]}>
                      Chat Messages
                    </Text>
                  </View>
                  <Switch
                    value={chatNotificationsEnabled}
                    onValueChange={(value) => toggleSetting('chatNotifications', value)}
                    trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : chatNotificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>
              </>
            )}
          </View>
        </View>
        
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            Support
          </Text>
          
          <View style={[
            styles.settingsCard,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('HelpCenter')}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#F0FDF4' }
                ]}>
                  <Ionicons name="help-circle" size={20} color="#22C55E" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Help Center
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
            
            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
            ]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('ContactUs')}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#EFF6FF' }
                ]}>
                  <Ionicons name="mail" size={20} color="#3B82F6" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Contact Us
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
            
            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
            ]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#FEF2F2' }
                ]}>
                  <Ionicons name="document-text" size={20} color="#EF4444" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Privacy Policy
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
            
            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
            ]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('TermsOfService')}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#FEF3C7' }
                ]}>
                  <Ionicons name="document" size={20} color="#F59E0B" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Terms of Service
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            Data & Storage
          </Text>
          
          <View style={[
            styles.settingsCard,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={clearCache}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#E0E7FF' }
                ]}>
                  <Ionicons name="trash" size={20} color="#6366F1" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Clear Cache
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
            
            <View style={[
              styles.divider,
              { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
            ]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('DataUsage')}
            >
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#F0FDF4' }
                ]}>
                  <Ionicons name="analytics" size={20} color="#22C55E" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Data Usage
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* About */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#E5E7EB' : '#1F2937' }
          ]}>
            About
          </Text>
          
          <View style={[
            styles.settingsCard,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[
                  styles.settingIconContainer,
                  { backgroundColor: '#EFF6FF' }
                ]}>
                  <Ionicons name="information-circle" size={20} color="#3B82F6" />
                </View>
                <Text style={[
                  styles.settingText,
                  { color: isDark ? '#E5E7EB' : '#1F2937' }
                ]}>
                  Version
                </Text>
              </View>
              <Text style={styles.versionText}>
                {Platform.OS === 'ios' 
                  ? Application.nativeApplicationVersion || '1.0.0'
                  : Application.nativeBuildVersion || '1.0.0'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Logout & Delete Account */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[
              styles.logoutButton,
              { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
            ]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <Ionicons name="log-out" size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={deleteAccount}
          >
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  deleteAccountButton: {
    alignItems: 'center',
    padding: 16,
  },
  deleteAccountText: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;