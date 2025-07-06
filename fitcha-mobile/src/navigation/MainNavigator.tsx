import HomeScreen from '../screens/main/HomeScreen';
import CourtsScreen from '../screens/main/CourtsScreen';
import SmartFeaturesScreen from '../screens/main/SmartFeaturesScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import ContactsScreen from '../screens/messages/ContactsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ARPreviewScreen from '../screens/features/ARPreviewScreen';
import SmartBookingScreen from '../screens/features/SmartBookingScreen';

export type MainStackParamList = {
  Home: undefined;
  Courts: undefined;
  CourtDetails: { courtId: string };
  SmartFeatures: undefined;
  Messages: { conversationId?: string };
  Profile: { tab?: string };
  Settings: undefined;
  Notifications: undefined;
  OtherProfile: { userId: string };
  Friends: undefined;
  FindPartners: undefined;
  ChangePassword: undefined;
  PrivacySettings: undefined;
  HelpCenter: undefined;
  ContactUs: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  DataUsage: undefined;
  Contacts: undefined;
  ARPreview: undefined;
  SmartBooking: undefined;
  GameDetails: { gameId: string };
  GameDetails: { gameId: string };
};

const Stack = createStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Courts" component={CourtsScreen} />
      <Stack.Screen name="SmartFeatures" component={SmartFeaturesScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="ARPreview" component={ARPreviewScreen} />
      <Stack.Screen name="SmartBooking" component={SmartBookingScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;