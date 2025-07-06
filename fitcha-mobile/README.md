# Fitcha Mobile App

## Overview

Fitcha is a sports social platform that connects athletes, helps them find courts, and organize games. This mobile app is built with React Native and Expo, providing a native experience on both iOS and Android platforms.

## Features

- **Authentication**: Email/password login, biometric authentication
- **Court Discovery**: Find and book courts with advanced filters
- **Social Networking**: Connect with other athletes, chat, and organize games
- **Game Management**: Create, join, and manage sports activities
- **Smart Features**: AI-powered recommendations, AR court previews, voice commands
- **Profile Management**: Track stats, achievements, and activity history
- **Offline Support**: Use the app even without an internet connection
- **Push Notifications**: Stay updated with game invites and messages

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native
- **Firebase**: Backend services (Auth, Firestore, Storage, Functions)
- **React Navigation**: Navigation library
- **Expo Notifications**: Push notifications
- **Expo Camera**: Camera integration for photos and AR
- **Expo Location**: GPS location services
- **Expo LocalAuthentication**: Biometric authentication
- **AsyncStorage**: Local data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Emulator
- Expo Go app on your physical device (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/fitcha-mobile.git
   cd fitcha-mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npx expo start
   ```

4. Run on a simulator/emulator or scan the QR code with the Expo Go app on your device.

## Project Structure

```
fitcha-mobile/
├── assets/                # App icons, splash screens, and other static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── config/            # Configuration files
│   ├── contexts/          # React contexts (auth, theme, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # App screens
│   │   ├── auth/          # Authentication screens
│   │   ├── main/          # Main app screens
│   │   ├── messages/      # Messaging screens
│   │   ├── profile/       # Profile screens
│   │   └── settings/      # Settings screens
│   ├── services/          # API and service functions
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── app.json               # Expo configuration
├── App.tsx                # Root component
├── babel.config.js        # Babel configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Building for Production

### Expo Build

```
eas build --platform ios
eas build --platform android
```

### Submitting to App Stores

```
eas submit --platform ios
eas submit --platform android
```

## Testing

```
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/)
- [React Navigation](https://reactnavigation.org/)