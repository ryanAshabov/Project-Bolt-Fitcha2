/**
 * Error Reporting Utilities for Fitcha Mobile
 * 
 * This file contains utilities for capturing and reporting errors.
 */

import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error context interface
interface ErrorContext {
  screen?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

// Report error to Firestore
export const reportError = async (
  error: Error,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context?: ErrorContext
) => {
  try {
    // Check if error reporting is enabled
    const errorReportingEnabled = await AsyncStorage.getItem('errorReportingEnabled');
    if (errorReportingEnabled === 'false') return;
    
    // Get device info
    const deviceInfo = {
      brand: Device.brand,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      deviceYearClass: await Device.getDeviceYearClassAsync(),
      isDevice: Device.isDevice,
      appVersion: Platform.OS === 'ios' 
        ? Application.nativeApplicationVersion 
        : Application.nativeBuildVersion,
    };
    
    // Create error report
    const errorReport = {
      userId: auth.currentUser?.uid || 'anonymous',
      timestamp: serverTimestamp(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      severity,
      context: context || {},
      device: deviceInfo,
      platform: Platform.OS,
    };
    
    // Add to Firestore
    const errorsCollection = collection(db, 'errorReports');
    await addDoc(errorsCollection, errorReport);
    
    // Log to console in development
    if (__DEV__) {
      console.error('Error reported:', error, context);
    }
  } catch (reportingError) {
    // Fail silently in production, log in development
    if (__DEV__) {
      console.error('Error reporting failed:', reportingError);
    }
  }
};

// Global error handler
export const setGlobalErrorHandler = () => {
  // Save original error handler
  const originalErrorHandler = ErrorUtils.getGlobalHandler();
  
  // Set custom error handler
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Report error
    reportError(
      error, 
      isFatal ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH,
      { additionalData: { isFatal } }
    );
    
    // Call original handler
    originalErrorHandler(error, isFatal);
  });
};

// Report API error
export const reportApiError = (
  endpoint: string,
  statusCode: number,
  responseData: any,
  requestData?: any
) => {
  const apiError = new Error(`API Error: ${endpoint} returned ${statusCode}`);
  
  reportError(apiError, ErrorSeverity.MEDIUM, {
    action: 'api_request',
    additionalData: {
      endpoint,
      statusCode,
      responseData,
      requestData,
    },
  });
};

// Enable/disable error reporting
export const setErrorReportingEnabled = async (enabled: boolean) => {
  await AsyncStorage.setItem('errorReportingEnabled', enabled.toString());
};

// Check if error reporting is enabled
export const isErrorReportingEnabled = async (): Promise<boolean> => {
  const errorReportingEnabled = await AsyncStorage.getItem('errorReportingEnabled');
  return errorReportingEnabled !== 'false'; // Default to true if not set
};