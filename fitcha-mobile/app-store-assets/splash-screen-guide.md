# Splash Screen Design Guide

## Required Splash Screen Sizes

### iOS
- iPhone Portrait @3x: 1125 x 2436 pixels
- iPhone Portrait @2x: 750 x 1334 pixels
- iPhone Landscape @3x: 2436 x 1125 pixels
- iPhone Landscape @2x: 1334 x 750 pixels
- iPad Portrait @2x: 1536 x 2048 pixels
- iPad Landscape @2x: 2048 x 1536 pixels
- iPad Pro Portrait @2x: 1668 x 2224 pixels
- iPad Pro Landscape @2x: 2224 x 1668 pixels

### Android
- LDPI: 200 x 320 pixels
- MDPI: 320 x 480 pixels
- HDPI: 480 x 800 pixels
- XHDPI: 720 x 1280 pixels
- XXHDPI: 960 x 1600 pixels
- XXXHDPI: 1280 x 1920 pixels

## Design Guidelines

### Style
- Keep the design simple and clean
- Use the app's primary colors
- Include the app logo prominently
- Avoid cluttering with too many elements
- Ensure the design works well on both light and dark backgrounds

### Elements to Include
- App logo (centered)
- App name "Fitcha"
- Tagline "Connect. Play. Grow." (optional)
- Subtle background gradient or pattern
- Loading indicator (optional)

### Colors
- Primary Blue: #2563EB
- Secondary Green: #059669
- Background Gradient: Linear gradient from #2563EB to #059669
- White: #FFFFFF for text and logo on dark backgrounds
- Dark: #1F2937 for text and logo on light backgrounds

### Technical Requirements
- PNG format
- No transparency for iOS splash screens
- For Android, provide a 9-patch PNG for adaptive scaling
- Keep file sizes optimized

## Implementation with Expo

In Expo, splash screens are configured in the `app.json` file:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

For dark mode support:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff",
      "dark": {
        "image": "./assets/splash-dark.png",
        "backgroundColor": "#1F2937"
      }
    }
  }
}
```

## Best Practices

1. **Keep it Simple**: The splash screen should be simple and load quickly
2. **Brand Consistency**: Maintain consistency with your app's branding
3. **Test on Multiple Devices**: Ensure your splash screen looks good on various screen sizes
4. **Optimize File Size**: Keep the image file size small for faster loading
5. **Consider Dark Mode**: Provide both light and dark versions if your app supports dark mode

## Splash Screen Duration

The splash screen should be displayed for a minimal amount of time, just long enough to load essential app resources. In Expo, you can control this with:

```javascript
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// When resources are loaded, hide the splash screen
SplashScreen.hideAsync();
```