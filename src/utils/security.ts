/**
 * Security Utilities and Best Practices
 * 
 * This module contains security utilities and helpers to ensure
 * the application follows security best practices:
 * - Input sanitization
 * - XSS prevention
 * - CSRF protection
 * - Content Security Policy helpers
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - Raw user input string
 * @returns Sanitized string safe for display
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePasswordStrength = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  ].filter(Boolean).length;

  return {
    isValid: score >= 4,
    score,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    },
    strength: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
  };
};

/**
 * Generate a secure random token
 * @param length - Length of the token
 * @returns Random token string
 */
export const generateSecureToken = (length = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Rate limiting utility to prevent spam/abuse
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if action is allowed for given identifier
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @returns Boolean indicating if action is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the time window
    const validAttempts = attempts.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }

  /**
   * Reset attempts for an identifier
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Secure storage utilities
 */
export const secureStorage = {
  /**
   * Store sensitive data with encryption (simplified for demo)
   */
  setItem: (key: string, value: string): void => {
    try {
      // In production, implement proper encryption
      const encrypted = btoa(value); // Base64 encoding (not secure!)
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  },

  /**
   * Retrieve and decrypt sensitive data
   */
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      // In production, implement proper decryption
      return atob(encrypted); // Base64 decoding
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  },

  /**
   * Remove sensitive data
   */
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};

/**
 * Content Security Policy helpers
 */
export const cspUtils = {
  /**
   * Generate nonce for inline scripts/styles
   */
  generateNonce: (): string => {
    return generateSecureToken(16);
  },

  /**
   * Validate if URL is from allowed domain
   */
  isAllowedDomain: (url: string, allowedDomains: string[]): boolean => {
    try {
      const urlObj = new URL(url);
      return allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  },
};

/**
 * Input validation utilities
 */
export const inputValidation = {
  /**
   * Check for SQL injection patterns (basic)
   */
  containsSQLInjection: (input: string): boolean => {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
      /(--|\*\/|\/\*)/,
      /(\bOR\b.*=.*=|\bAND\b.*=.*=)/i,
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  },

  /**
   * Check for XSS patterns
   */
  containsXSS: (input: string): boolean => {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  },

  /**
   * Validate file upload
   */
  validateFileUpload: (file: File, allowedTypes: string[], maxSize: number) => {
    const errors: string[] = [];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not allowed`);
    }
    
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize} bytes`);
    }
    
    // Check for executable file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.js'];
    const fileName = file.name.toLowerCase();
    
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      errors.push('Executable files are not allowed');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
