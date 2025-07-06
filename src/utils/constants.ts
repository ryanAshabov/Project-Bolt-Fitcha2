/**
 * Application constants and configuration values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.fitcha.app',
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  TIMEOUT: 10000, // 10 seconds
} as const;

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} as const;

// Application Settings
export const APP_CONFIG = {
  NAME: 'Fitcha',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 240,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  POSTS_PER_PAGE: 20,
  COURTS_PER_PAGE: 12,
  MESSAGES_PER_PAGE: 50,
} as const;

// File Upload
const FILE_SIZE_MB = 5;
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;

export const FILE_UPLOAD = {
  MAX_SIZE: FILE_SIZE_MB * KB_PER_MB * BYTES_PER_KB, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
} as const;

// Sports Categories
export const SPORTS_CATEGORIES = [
  'football',
  'basketball',
  'tennis',
  'volleyball',
  'badminton',
  'swimming',
  'running',
  'cycling',
  'gym',
  'yoga',
  'martial-arts',
  'other',
] as const;

// Activity Types
export const ACTIVITY_TYPES = {
  SPORTS: 'sports',
  WELLNESS: 'wellness',
  GAMING: 'gaming',
  OUTDOOR: 'outdoor',
  SOCIAL: 'social',
  FITNESS: 'fitness',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ATHLETE: 'athlete',
  CELEBRITY: 'celebrity',
  COACH: 'coach',
  ADMIN: 'admin',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MESSAGE: 'message',
  BOOKING: 'booking',
  ACHIEVEMENT: 'achievement',
  SYSTEM: 'system',
} as const;

// Achievement Categories
export const ACHIEVEMENT_CATEGORIES = {
  SOCIAL: 'social',
  SPORTS: 'sports',
  CONSISTENCY: 'consistency',
  MILESTONES: 'milestones',
  COMMUNITY: 'community',
} as const;

// Time Constants
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;

export const TIME_CONSTANTS = {
  SECOND: MS_PER_SECOND,
  MINUTE: SECONDS_PER_MINUTE * MS_PER_SECOND,
  HOUR: MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND,
  DAY: HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND,
  WEEK: DAYS_PER_WEEK * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND,
  MONTH: DAYS_PER_MONTH * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND,
} as const;

// Cache Settings
const USER_PROFILE_CACHE_MINUTES = 5;
const COURTS_LIST_CACHE_MINUTES = 10;
const POSTS_FEED_CACHE_MINUTES = 2;

export const CACHE_SETTINGS = {
  USER_PROFILE: USER_PROFILE_CACHE_MINUTES * TIME_CONSTANTS.MINUTE,
  COURTS_LIST: COURTS_LIST_CACHE_MINUTES * TIME_CONSTANTS.MINUTE,
  POSTS_FEED: POSTS_FEED_CACHE_MINUTES * TIME_CONSTANTS.MINUTE,
  STATIC_DATA: TIME_CONSTANTS.HOUR,
} as const;

// Animation Durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
  VERY_SLOW: 600,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size exceeds ${FILE_SIZE_MB}MB limit.`,
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file format.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  POST_CREATED: 'Post created successfully!',
  BOOKING_CONFIRMED: 'Booking confirmed successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fitcha_auth_token',
  USER_PREFERENCES: 'fitcha_user_preferences',
  THEME: 'fitcha_theme',
  LANGUAGE: 'fitcha_language',
  RECENT_SEARCHES: 'fitcha_recent_searches',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  AR_FEATURES: import.meta.env.VITE_ENABLE_AR_FEATURES === 'true',
  IOT_INTEGRATION: import.meta.env.VITE_ENABLE_IOT_INTEGRATION === 'true',
  VOICE_COMMANDS: import.meta.env.VITE_ENABLE_VOICE_COMMANDS === 'true',
  PAYMENT_SYSTEM: import.meta.env.VITE_ENABLE_PAYMENT_SYSTEM === 'true',
  BETA_FEATURES: import.meta.env.VITE_ENABLE_BETA_FEATURES === 'true',
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/fitcha',
  TWITTER: 'https://twitter.com/fitcha',
  INSTAGRAM: 'https://instagram.com/fitcha',
  LINKEDIN: 'https://linkedin.com/company/fitcha',
  YOUTUBE: 'https://youtube.com/fitcha',
} as const;

// Contact Information
export const CONTACT_INFO = {
  EMAIL: 'support@fitcha.app',
  PHONE: '+1-800-FITCHA',
  ADDRESS: '123 Sports Avenue, Athletic City, AC 12345',
  SUPPORT_HOURS: 'Monday - Friday, 9 AM - 6 PM EST',
} as const;

// Type exports for better TypeScript support
export type SportsCategory = typeof SPORTS_CATEGORIES[number];
export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
export type AchievementCategory = 
  typeof ACHIEVEMENT_CATEGORIES[keyof typeof ACHIEVEMENT_CATEGORIES];
