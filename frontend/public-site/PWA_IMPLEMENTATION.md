# PWA Implementation Guide

## Overview
This document outlines the Progressive Web App (PWA) implementation for Calvary Mission HPC. The PWA provides a native app-like experience with offline functionality, home screen installation, and enhanced mobile performance.

## Features Implemented

### 1. Web App Manifest (`/public/manifest.json`)
- **App Name**: Calvary Mission HPC
- **Short Name**: Calvary HPC
- **Description**: Connect with your faith community
- **Display Mode**: Standalone (runs in its own window)
- **Theme Color**: #1f2937 (dark blue)
- **Background Color**: #ffffff (white)
- **Orientation**: Portrait-primary (optimized for mobile)

#### Icons
- Multiple sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Maskable icons for better Android integration
- Feature-specific icons for shortcuts

#### Shortcuts
- **Live Stream**: Quick access to live services
- **Sermons**: Access to sermon library
- **Give**: Donation and giving portal

### 2. Service Worker (`/public/sw.js`)
- **Offline Caching**: Caches essential pages and resources
- **Background Sync**: Handles offline actions when connection returns
- **Push Notifications**: Support for church announcements and updates
- **Cache Management**: Automatic cleanup of old caches

#### Cached Routes
- Home page and main navigation
- About, Contact, Convention pages
- Live stream and media pages
- Dashboard sections
- Authentication pages
- Static assets (CSS, images, logos)

### 3. PWA Installer Component (`/src/components/PWAInstaller.tsx`)
- **Install Prompt**: Appears when PWA can be installed
- **User Experience**: Clear call-to-action with benefits explanation
- **Dismissible**: Users can choose to install later
- **Auto-hide**: Disappears after installation

### 4. Offline Page (`/src/components/OfflinePage.tsx`)
- **Offline Detection**: Automatically shows when connection is lost
- **User Guidance**: Clear instructions for offline users
- **Available Content**: Lists what's accessible offline
- **Reconnection**: Easy way to retry when back online

### 5. Installation Guide (`/src/components/PWAInstallGuide.tsx`)
- **Device-Specific Instructions**: Different steps for mobile, tablet, and desktop
- **Browser Support**: Chrome, Edge, Firefox, Safari instructions
- **Visual Aids**: Icons and clear step-by-step guidance
- **Benefits Explanation**: Why users should install the app

### 6. Navbar Integration
- **Install Button**: Appears in navigation when PWA can be installed
- **Mobile Support**: Available in both desktop and mobile menus
- **Visual Feedback**: Clear button styling with download icon

## Technical Implementation

### Next.js Configuration (`next.config.ts`)
- **PWA Plugin**: Uses `next-pwa` for automatic service worker generation
- **Runtime Caching**: Optimized caching strategies for different file types
- **Development Mode**: PWA features disabled during development
- **Build Optimization**: Excludes middleware manifest from PWA build

### Caching Strategies
- **Cache First**: For fonts, images, and static assets
- **Stale While Revalidate**: For CSS, JS, and HTML files
- **Network First**: For API calls with fallback to cache
- **Range Requests**: For audio and video files

### Icon Generation
- **Automated Script**: `scripts/generate-pwa-icons.js`
- **Sharp Integration**: High-quality PNG generation
- **Fallback Icons**: Placeholder icons if logo is unavailable
- **Feature Icons**: Special icons for app shortcuts

## Installation Instructions

### For Users

#### Mobile (iOS)
1. Open Safari and navigate to the website
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

#### Mobile (Android)
1. Open Chrome and navigate to the website
2. Tap the three dots menu (⋮)
3. Select "Add to Home screen" or "Install app"
4. Tap "Add" or "Install" to confirm

#### Desktop (Chrome/Edge)
1. Click the three dots menu (⋮)
2. Hover over "More tools" (Chrome) or click "Apps" (Edge)
3. Click "Create shortcut..." (Chrome) or "Install this site as an app" (Edge)
4. Check "Open as window" and click "Create" or "Install"

### For Developers

#### Prerequisites
```bash
npm install next-pwa sharp --legacy-peer-deps
```

#### Icon Generation
```bash
node scripts/generate-pwa-icons.js
```

#### Building for Production
```bash
npm run build
npm start
```

## Testing PWA Features

### 1. Installation
- Use Chrome DevTools > Application > Manifest
- Check if install prompt appears
- Verify app installs correctly

### 2. Offline Functionality
- Use Chrome DevTools > Network > Offline
- Navigate between cached pages
- Test offline page appearance

### 3. Service Worker
- Use Chrome DevTools > Application > Service Workers
- Check registration status
- Monitor cache storage

### 4. Performance
- Use Lighthouse PWA audit
- Check Core Web Vitals
- Verify caching strategies

## Browser Support

### Full PWA Support
- Chrome 67+
- Edge 79+
- Firefox 58+
- Safari 11.1+ (iOS 11.3+)

### Partial Support
- Older versions may support basic features
- Graceful degradation for unsupported browsers

## Best Practices

### 1. Performance
- Optimize images and assets
- Use efficient caching strategies
- Minimize service worker complexity

### 2. User Experience
- Clear installation prompts
- Helpful offline messaging
- Consistent app-like behavior

### 3. Maintenance
- Regular cache updates
- Monitor service worker performance
- Update icons and manifest as needed

## Troubleshooting

### Common Issues

#### Install Prompt Not Appearing
- Check if app is already installed
- Verify HTTPS is enabled
- Ensure manifest.json is accessible

#### Offline Functionality Not Working
- Check service worker registration
- Verify cache strategies
- Test with different network conditions

#### Icons Not Displaying
- Check icon file paths
- Verify icon sizes in manifest
- Test with different devices

### Debug Commands
```bash
# Check service worker status
navigator.serviceWorker.getRegistrations()

# Clear all caches
caches.keys().then(names => names.forEach(name => caches.delete(name)))

# Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log)
```

## Future Enhancements

### Planned Features
- **Push Notifications**: Church announcements and updates
- **Background Sync**: Offline donations and prayer requests
- **Advanced Caching**: Intelligent content prefetching
- **Analytics**: PWA usage and performance metrics

### Performance Optimizations
- **Image Optimization**: WebP format and responsive images
- **Code Splitting**: Lazy loading for better performance
- **Preloading**: Critical resource prioritization

## Resources

### Documentation
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Next.js PWA](https://github.com/shadowwalker/next-pwa)

### Tools
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web App Manifest Validator](https://manifest-validator.appspot.com/)

---

*This PWA implementation provides a modern, app-like experience for church members while maintaining excellent performance and offline functionality.*
