@@ .. @@
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { Ionicons } from '@expo/vector-icons';
 import { useTheme } from '../contexts/ThemeContext';
+import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
 
 // Screens
 import MainNavigator from './MainNavigator';
@@ .. @@
 
 const BottomTabNavigator: React.FC = () => {
   const { isDark } = useTheme();
+  
+  // Hide tab bar on specific screens
+  const getTabBarVisibility = (route: any) => {
+    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
+    const hideOnScreens = [
+      'Messages', 
+      'Profile', 
+      'Settings', 
+      'Notifications',
+      'CourtDetails',
+      'GameDetails',
+      'ARPreview',
+      'SmartBooking'
+    ];
+    
+    return hideOnScreens.includes(routeName) ? false : true;
+  };
 
   return (
     <Tab.Navigator
@@ .. @@
         name="MainTab"
         component={MainNavigator}
         options={({ route }) => ({
+          tabBarVisible: getTabBarVisibility(route),
+          tabBarStyle: {
+            display: getTabBarVisibility(route) ? 'flex' : 'none'
+          },
           tabBarIcon: ({ color, size }) => (
             <Ionicons name="home" color={color} size={size} />
           ),
@@ .. @@
         name="MessagesTab"
         component={MainNavigator}
         options={{
+          tabBarLabel: 'Messages',
           tabBarIcon: ({ color, size }) => (
-            <Ionicons name="chatbubbles" color={color} size={size} />
+            <Ionicons name="chatbubbles-outline" color={color} size={size} />
           ),
+          tabBarListener: ({ navigation }) => ({
+            tabPress: (e) => {
+              // Prevent default action
+              e.preventDefault();
+              // Navigate to the Messages screen
+              navigation.navigate('Messages');
+            },
+          }),
         }}
       />
       <Tab.Screen
@@ .. @@
         name="ProfileTab"
         component={MainNavigator}
         options={{
+          tabBarLabel: 'Profile',
           tabBarIcon: ({ color, size }) => (
-            <Ionicons name="person" color={color} size={size} />
+            <Ionicons name="person-outline" color={color} size={size} />
           ),
+          tabBarListener: ({ navigation }) => ({
+            tabPress: (e) => {
+              // Prevent default action
+              e.preventDefault();
+              // Navigate to the Profile screen
+              navigation.navigate('Profile');
+            },
+          }),
         }}
       />
     </Tab.Navigator>