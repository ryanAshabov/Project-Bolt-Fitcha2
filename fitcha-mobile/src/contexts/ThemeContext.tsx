import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  primary: '#2563eb', // blue-600
  secondary: '#059669', // emerald-600
  background: '#ffffff',
  card: '#f8fafc', // slate-50
  text: '#1e293b', // slate-800
  border: '#e2e8f0', // slate-200
  notification: '#ef4444', // red-500
  success: '#22c55e', // green-500
  warning: '#eab308', // yellow-500
  info: '#3b82f6', // blue-500
  error: '#ef4444', // red-500
  disabled: '#94a3b8', // slate-400
  placeholder: '#94a3b8', // slate-400
  backdrop: 'rgba(0, 0, 0, 0.5)',
  card2: '#ffffff',
  textSecondary: '#64748b', // slate-500
  highlight: '#eff6ff', // blue-50
};

export const darkTheme = {
  primary: '#3b82f6', // blue-500
  secondary: '#10b981', // emerald-500
  background: '#0f172a', // slate-900
  card: '#1e293b', // slate-800
  text: '#f8fafc', // slate-50
  border: '#334155', // slate-700
  notification: '#ef4444', // red-500
  success: '#22c55e', // green-500
  warning: '#eab308', // yellow-500
  info: '#3b82f6', // blue-500
  error: '#ef4444', // red-500
  disabled: '#64748b', // slate-500
  placeholder: '#64748b', // slate-500
  backdrop: 'rgba(0, 0, 0, 0.7)',
  card2: '#334155', // slate-700
  textSecondary: '#94a3b8', // slate-400
  highlight: '#1e3a8a', // blue-900
};

type Theme = typeof lightTheme;
type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'system',
  setThemeType: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  
  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeType');
        if (savedTheme) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Save theme preference when it changes
  const updateThemeType = async (newThemeType: ThemeType) => {
    try {
      await AsyncStorage.setItem('themeType', newThemeType);
      setThemeType(newThemeType);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  // Determine if dark mode is active
  const isDark = 
    themeType === 'dark' || 
    (themeType === 'system' && colorScheme === 'dark');
  
  // Get the current theme object
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        themeType, 
        setThemeType: updateThemeType,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};