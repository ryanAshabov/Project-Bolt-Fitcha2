/**
 * Theme Context for Fitcha Mobile
 * 
 * This context provides theme management functionality including:
 * - Light/dark mode toggle
 * - System theme detection
 * - Theme persistence
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme context type
type ThemeContextType = {
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as 'light' | 'dark' | 'system');
          
          if (savedTheme === 'system') {
            setIsDark(systemColorScheme === 'dark');
          } else {
            setIsDark(savedTheme === 'dark');
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, [systemColorScheme]);

  // Update isDark when system color scheme changes
  useEffect(() => {
    if (theme === 'system') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, theme]);

  // Toggle between light and dark mode
  const toggleTheme = async () => {
    try {
      const newTheme = isDark ? 'light' : 'dark';
      setTheme(newTheme);
      setIsDark(newTheme === 'dark');
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Set specific theme mode
  const setThemeMode = async (mode: 'light' | 'dark' | 'system') => {
    try {
      setTheme(mode);
      
      if (mode === 'system') {
        setIsDark(systemColorScheme === 'dark');
      } else {
        setIsDark(mode === 'dark');
      }
      
      await AsyncStorage.setItem('theme', mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);