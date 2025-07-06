/**
 * Validation Utilities
 * 
 * This file contains validation functions for forms and user input.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

/**
 * Validate email format
 * 
 * @param email - Email to validate
 * @returns boolean
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * 
 * @param password - Password to validate
 * @returns {isValid: boolean, errors: string[]}
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number format
 * 
 * @param phone - Phone number to validate
 * @returns boolean
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate required field
 * 
 * @param value - Value to validate
 * @param fieldName - Field name for error message
 * @returns string | null - Error message or null if valid
 */
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate string length
 * 
 * @param value - Value to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @param fieldName - Field name for error message
 * @returns string | null - Error message or null if valid
 */
export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string,
): string | null => {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (value.length > max) {
    return `${fieldName} must be less than ${max} characters`;
  }
  return null;
};

/**
 * Validate numeric value
 * 
 * @param value - Value to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Field name for error message
 * @returns string | null - Error message or null if valid
 */
export const validateNumber = (
  value: number,
  min: number,
  max: number,
  fieldName: string,
): string | null => {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  if (value < min) {
    return `${fieldName} must be at least ${min}`;
  }
  if (value > max) {
    return `${fieldName} must be less than or equal to ${max}`;
  }
  return null;
};

/**
 * Validate date format and range
 * 
 * @param dateString - Date string to validate
 * @param minDate - Minimum allowed date
 * @param maxDate - Maximum allowed date
 * @returns string | null - Error message or null if valid
 */
export const validateDate = (
  dateString: string,
  minDate?: Date,
  maxDate?: Date,
): string | null => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }

  if (minDate && date < minDate) {
    return `Date must be after ${minDate.toLocaleDateString()}`;
  }

  if (maxDate && date > maxDate) {
    return `Date must be before ${maxDate.toLocaleDateString()}`;
  }

  return null;
};

/**
 * Validate time format (HH:MM)
 * 
 * @param timeString - Time string to validate
 * @returns boolean
 */
export const isValidTime = (timeString: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

/**
 * Validate URL format
 * 
 * @param url - URL to validate
 * @returns boolean
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize HTML content
 * 
 * @param html - HTML content to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '');
};

/**
 * Validate file type
 * 
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns boolean
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * 
 * @param file - File to validate
 * @param maxSizeBytes - Maximum file size in bytes
 * @returns boolean
 */
export const isValidFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

/**
 * Validate coordinates
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns boolean
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Validate sport name
 * 
 * @param sport - Sport name to validate
 * @returns boolean
 */
export const isValidSport = (sport: string): boolean => {
  const validSports = [
    'Basketball',
    'Tennis',
    'Soccer',
    'Football',
    'Volleyball',
    'Swimming',
    'Running',
    'Cycling',
    'Yoga',
    'Fitness',
    'Boxing',
    'Martial Arts',
    'Golf',
    'Baseball',
    'Badminton',
    'Table Tennis',
    'Squash',
    'Hockey',
    'Cricket',
    'Rugby',
  ];
  
  return validSports.includes(sport);
};

/**
 * Validate skill level
 * 
 * @param level - Skill level to validate
 * @returns boolean
 */
export const isValidSkillLevel = (level: string): boolean => {
  const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  return validLevels.includes(level);
};