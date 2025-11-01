# Number Recall Trainer PWA

A complete Progressive Web App (PWA) optimized for iPhone and iOS devices.

## Features

- ✅ Offline functionality with Service Worker
- ✅ iOS home screen support with proper meta tags
- ✅ Standalone app experience (no browser UI when installed)
- ✅ Bilingual support (English and Chinese)
- ✅ Number recall training with speech synthesis
- ✅ Settings persistence via localStorage

## Installation on iPhone

1. Open Safari on your iPhone
2. Navigate to the PWA URL (must be served over HTTPS or localhost)
3. Tap the Share button
4. Select "Add to Home Screen"
5. The app will appear on your home screen like a native app

## Files Structure

```
pwa3/
├── index.html              # Main app HTML with iOS PWA meta tags
├── manifest.webmanifest    # PWA manifest file
├── service-worker.js       # Service worker for offline support
├── icons/
│   ├── icon-180.png        # iOS home screen icon (180x180)
│   ├── icon-192.png        # Standard PWA icon (192x192)
│   └── icon-512.png        # High-res icon (512x512)
├── generate-icons.html     # Icon generator tool (optional)
└── README.md               # This file
```

## Icon Generation

If you need to regenerate icons, you can:
1. Open `generate-icons.html` in a browser
2. Click "Generate Icons" 
3. Download the icons and place them in the `icons/` folder

## iOS-Specific Features

- `apple-mobile-web-app-capable`: Enables fullscreen mode
- `apple-mobile-web-app-status-bar-style`: Controls status bar appearance
- `apple-touch-icon`: 180x180 icon for home screen
- Standalone display mode for native app feel

## Testing

1. Serve the files using a local server (required for service worker):
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

2. Open in Safari (on iPhone or macOS)
3. Test offline functionality by:
   - Installing the PWA
   - Disabling network connection
   - Verifying the app still works

## Requirements

- HTTPS (or localhost) - Service Workers require secure context
- Modern browser with Service Worker support
- iOS 11.3+ for PWA support

## Browser Support

- ✅ Safari (iOS 11.3+)
- ✅ Chrome (Android & Desktop)
- ✅ Edge (Chromium-based)
- ✅ Firefox (with limitations)

## Notes

- The app must be served over HTTPS in production (or localhost for development)
- Service Worker will cache the app for offline use
- Settings are stored in browser's localStorage
- Speech synthesis may vary by device and browser

