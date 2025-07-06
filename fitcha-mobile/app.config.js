export default {
  name: 'Fitcha',
  slug: 'fitcha-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.fitcha.mobile',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'Fitcha uses the camera to take profile photos and upload court images.',
      NSLocationWhenInUseUsageDescription: 'Fitcha uses your location to find nearby courts and activities.',
      NSPhotoLibraryUsageDescription: 'Fitcha needs access to your photo library to upload profile and court images.',
      NSFaceIDUsageDescription: 'Fitcha uses Face ID for secure authentication.',
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.fitcha.mobile',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'USE_BIOMETRIC',
      'USE_FINGERPRINT',
      'VIBRATE',
      'RECEIVE_BOOT_COMPLETED'
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'expo-camera',
      {
        cameraPermission: 'Fitcha needs access to your camera to take profile photos and upload court images.'
      }
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Fitcha needs access to your location to find nearby courts and activities.'
      }
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#ffffff',
        sounds: ['./assets/notification.wav']
      }
    ],
    'expo-image-picker',
    'expo-file-system',
    'expo-secure-store',
    'expo-local-authentication'
  ],
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    eas: {
      projectId: "your-eas-project-id"
    }
  }
};