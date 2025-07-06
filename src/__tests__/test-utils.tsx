/**
 * Test utilities and setup for the Fitcha platform
 * 
 * This file contains common test utilities, mocks, and setup functions
 * used across all test files in the project.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom render function that includes necessary providers
 * This ensures all components are tested with proper context
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };

/**
 * Mock user data for testing
 */
export const mockTestUser = {
  id: 'test-user-1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  headline: 'Test User for Unit Testing',
  location: 'Test City',
  coordinates: { lat: 0, lng: 0 },
  connections: 0,
  isOnline: true,
  verified: false,
  isPro: false,
  sports: ['testing'],
  skillLevel: 'beginner',
  rating: 0,
  joinedAt: '2024-01-01',
  bio: 'This is a test user',
  achievements: [],
  preferences: {
    notifications: true,
    privacy: 'public',
    language: 'en',
  },
  statistics: {
    gamesPlayed: 0,
    wins: 0,
    totalHours: 0,
  },
  trustScore: 100,
  availability: [],
};

/**
 * Mock environment variables for testing
 */
export const mockEnvVars = {
  VITE_FIREBASE_API_KEY: 'test-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'test-project',
  VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  VITE_FIREBASE_APP_ID: 'test-app-id',
};
