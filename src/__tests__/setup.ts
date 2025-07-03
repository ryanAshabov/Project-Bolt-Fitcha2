/**
 * Vitest setup file for testing environment
 * 
 * This file configures the testing environment and imports
 * necessary testing utilities and matchers.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('../services/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
  functions: {},
}));

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
