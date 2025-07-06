import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import CourtsScreen from '../screens/main/CourtsScreen';
import CreateGameScreen from '../screens/main/CreateGameScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CourtDetailScreen from '../screens/main/CourtDetailScreen';
import BookingScreen from '../screens/main/BookingScreen';
import GameDetailScreen from '../screens/main/GameDetailScreen';
import ChatScreen from '../screens/main/ChatScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import FindPartnersScreen from '../screens/main/FindPartnersScreen';
import SmartFeaturesScreen from '../screens/main/SmartFeaturesScreen';

// Hooks
import { useTheme } from '../contexts/ThemeContext';

// Types
export type MainStackParamList = {
  MainTabs: undefined;
  CourtDetail: { courtId: string };
  Booking: { courtId?: string };
  GameDetail: { gameId: string };
  Chat: { chatId: string };
  Notifications: undefined;
  Settings: undefined;
  FindPartners: undefined;
  SmartFeatures: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Courts: undefined;
  CreateGame: undefined;
  Messages: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Bottom Tab Navigator
const MainTabs: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Courts') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'CreateGame') {
            iconName = 'add-circle';
            size = 40;
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courts" component={CourtsScreen} />
      <Tab.Screen 
        name="CreateGame" 
        component={CreateGameScreen} 
        options={{
          tabBarLabel: "Let's Play",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainNavigator: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CourtDetail" 
        component={CourtDetailScreen} 
        options={{ title: 'Court Details' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ title: 'Book Court' }}
      />
      <Stack.Screen 
        name="GameDetail" 
        component={GameDetailScreen} 
        options={{ title: 'Game Details' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={({ route }) => ({ 
          title: route.params?.chatId || 'Chat',
          headerShown: true,
        })}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="FindPartners" 
        component={FindPartnersScreen} 
        options={{ title: 'Find Partners' }}
      />
      <Stack.Screen 
        name="SmartFeatures" 
        component={SmartFeaturesScreen} 
        options={{ title: 'Smart Features' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;