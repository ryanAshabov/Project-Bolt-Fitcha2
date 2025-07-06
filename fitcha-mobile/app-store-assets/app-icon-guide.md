# App Icon Design Guide

## Required Icon Sizes

### iOS
- App Store: 1024 x 1024 pixels
- iPhone: 180 x 180 pixels (60pt @3x)
- iPhone: 120 x 120 pixels (60pt @2x)
- iPad: 167 x 167 pixels (83.5pt @2x)
- iPad: 152 x 152 pixels (76pt @2x)
- iOS Settings: 87 x 87 pixels (29pt @3x)
- iOS Settings: 58 x 58 pixels (29pt @2x)
- iOS Spotlight: 120 x 120 pixels (40pt @3x)
- iOS Spotlight: 80 x 80 pixels (40pt @2x)
- App Store: 1024 x 1024 pixels

### Android
- Play Store: 512 x 512 pixels
- Adaptive Icon Foreground: 432 x 432 pixels
- Adaptive Icon Background: 432 x 432 pixels
- Legacy Icon: 192 x 192 pixels
- Legacy Icon: 144 x 144 pixels
- Legacy Icon: 96 x 96 pixels
- Legacy Icon: 72 x 72 pixels
- Legacy Icon: 48 x 48 pixels

## Design Guidelines

### Style
- Use a bold, modern design that represents sports and social connectivity
- Implement a gradient background from blue to green (brand colors)
- Use a simple, recognizable symbol that represents the app's purpose
- Ensure the icon is recognizable at small sizes
- Avoid text in the icon

### Colors
- Primary Blue: #2563EB
- Secondary Green: #059669
- Background Gradient: Linear gradient from #2563EB to #059669
- White: #FFFFFF for foreground elements

### Symbol Ideas
- Stylized "F" for Fitcha
- Sports ball with social connection elements
- Court outline with player silhouettes
- Activity graph or heartbeat line

### Technical Requirements
- PNG format with transparency
- No alpha channel for App Store icon
- Rounded corners will be added automatically by iOS
- For Android, provide separate foreground and background layers for adaptive icons

## Icon Creation Process

1. Design the master icon at 1024 x 1024 pixels
2. Test the icon at various sizes to ensure legibility
3. Export in all required sizes
4. Test on actual devices if possible
5. Verify that the icon stands out on different wallpapers and in folders

## File Naming Convention

- iOS: `icon-{size}@{scale}x.png` (e.g., `icon-60@3x.png`)
- Android: `ic_launcher_{size}.png` (e.g., `ic_launcher_48.png`)
- Adaptive Icons: `ic_launcher_foreground.png` and `ic_launcher_background.png`

## Tools Recommended

- Adobe Illustrator or Figma for vector design
- Sketch for iOS-specific design
- Icon generation tools like Icon Set Creator or Android Asset Studio
- App Icon Maker websites for quick generation of all required sizes