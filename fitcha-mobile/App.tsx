import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

// Contexts
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';

// Navigation
import AuthNavigator from './src/navigation/AuthNavigator';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

// Utilities
import { setGlobalErrorHandler } from './src/utils/errorReporting';
import { initializeOfflineSync } from './src/utils/offlineSync';
import { addNotificationResponseHandler } from './src/utils/pushNotifications';

// Keep splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    // Set up global error handler
    setGlobalErrorHandler();
    
    // Initialize offline sync
    initializeOfflineSync();
    
    // Set up notification response handler
    const subscription = addNotificationResponseHandler(response => {
      const data = response.notification.request.content.data;
      
      // Handle notification response based on data
      // This would typically navigate to the relevant screen
      console.log('Notification response:', data);
    });
    
    // Hide splash screen after initialization
    SplashScreen.hideAsync();
    
    return () => {
      // Clean up notification subscription
      Notifications.removeNotificationSubscription(subscription);
    };
  }, []);

  if (isLoading) {
    // We could show a loading screen here, but the splash screen is already visible
    return null;
  }

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Navigation themes
const DefaultTheme = {
  dark: false,
  colors: {
    primary: '#3B82F6',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
    notification: '#EF4444',
  },
};

const DarkTheme = {
  dark: true,
  colors: {
    primary: '#3B82F6',
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    border: '#374151',
    notification: '#EF4444',
  },
};