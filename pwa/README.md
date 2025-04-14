# Rider Delivery PWA

# Link: https://zuvees-riders.vercel.app/

A Progressive Web App (PWA) for delivery riders managing orders from our Fans & ACs E-Commerce platform. Built with React, Tailwind CSS, and optimized for mobile devices with offline capabilities.

## Features

- **Progressive Web App**: Installable on mobile devices with offline support
- **Order Management**: View, track, and update assigned orders
- **Delivery Updates**: Mark orders as delivered or undelivered with notes
- **Navigation**: Integration with mapping services for delivery routes
- **Offline Functionality**: Core features work without an internet connection
- **Push Notifications**: Alerts for new order assignments
- **Rider Dashboard**: Performance metrics and daily delivery stats
- **Mobile-First Design**: Optimized UI for smartphone usage

## Tech Stack

- **React 18**: Modern functional components with hooks
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Aceternity UI**: Motion components and UI effects
- **Recoil**: State management
- **React Query**: Data fetching with offline support
- **Workbox**: Service worker for PWA functionality
- **Firebase**: Push notifications
- **React Router**: Navigation and routing
- **Google OAuth**: Rider authentication
- **Geolocation API**: Location-based features

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── layout/              # Layout components (Header, BottomNav)
│   ├── orders/              # Order-related components
│   ├── offline/             # Offline state components
│   ├── location/            # Location and map components
│   └── ui/                  # UI elements (buttons, cards, etc.)
├── pages/                   # Page components
│   ├── Login.jsx            # Login page
│   ├── Dashboard.jsx        # Rider dashboard page
│   ├── Orders.jsx           # Orders list page
│   ├── OrderDetail.jsx      # Single order detail page
│   ├── Profile.jsx          # Rider profile page
│   └── OfflinePage.jsx      # Offline fallback page
├── hooks/                   # Custom React hooks
├── store/                   # Recoil atoms and selectors
├── services/                # API and offline service calls
├── utils/                   # Utility functions
├── contexts/                # React contexts
├── sw/                      # Service worker configuration
├── assets/                  # Static assets (images, icons)
├── styles/                  # Global styles
├── App.jsx                  # Main App component
└── index.jsx                # Entry point
```

## Progressive Web App Features

### Offline Functionality

The app uses a service worker to provide offline capabilities:

- **Caching Strategy**: Cache-first for static assets, network-first for API requests
- **Background Sync**: Queue status updates when offline for later synchronization
- **Persistent Storage**: IndexedDB for storing orders and user data
- **Offline UI**: Clear indicators when working in offline mode
- **Automatic Reconnection**: Seamlessly reconnect when connection is restored

### Installation

The PWA can be installed on mobile devices directly from the browser:

- **App Manifest**: Configures home screen appearance and behavior
- **Installation Prompt**: Smart prompting for installation at appropriate times
- **Standalone Mode**: Runs in fullscreen mode without browser chrome
- **Splash Screen**: Branded loading experience

### Push Notifications

Stay updated with important alerts:

- **New Orders**: Notifications when new deliveries are assigned
- **Status Updates**: Alerts about order status changes
- **System Messages**: Important announcements from management
- **Custom Notification Preferences**: Fine-grained control over notification types

## Installation and Setup

### Prerequisites

- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VikramAditya144/zuvees-ecommerce.git
   cd zuvees-ecommerce
   cd pwa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:4000/api
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Production Build

To create a production build:

```bash
npm run build
```

The build folder can be deployed to any static hosting service.

## Key Features in Detail

### Order Management

- **Order List**: View all assigned orders with filtering by status
- **Order Details**: Comprehensive order information screen
- **Status Updates**: Update delivery status with comments
- **Proof of Delivery**: Option to upload photos for delivery confirmation
- **Customer Information**: Access customer contact details for communication

### Dashboard

- **Daily Summary**: Overview of today's deliveries
- **Performance Metrics**: Track delivery stats and efficiency
- **Earnings**: View delivery commission information
- **Activity Log**: Timeline of recent actions

### Navigation & Location

- **Maps Integration**: Open navigation apps from order details
- **Geolocation**: Track current position for delivery optimization
- **Address Recognition**: Automatic parsing of delivery addresses
- **Route Optimization**: Suggestions for efficient delivery routes

### Offline Capabilities

- **Queued Actions**: Actions taken offline are queued for synchronization
- **Local Data Storage**: Critical data is stored locally for offline access
- **Network Status Indicator**: Clear visual indication of connectivity status
- **Graceful Degradation**: Core features work regardless of connection status

## API Integration

The Rider PWA communicates with the backend through a dedicated API:

- **Authentication**: `/api/auth/google`, `/api/auth/me`
- **Orders**: `/api/rider/orders`, `/api/rider/orders/:id`
- **Status Updates**: `/api/rider/orders/:id/status`
- **Dashboard**: `/api/rider/dashboard`

## Mobile-First Design

The application is designed specifically for mobile use:

- **Thumb-Friendly UI**: Important actions within easy reach
- **Bottom Navigation**: Quick access to essential features
- **Simplified Views**: Focused screens with minimal distractions
- **Touch Optimized**: Large touch targets and swipe gestures
- **Offline Indicators**: Clear visual feedback for network status

## Performance Considerations

- **Light Payload**: Minimal bundle size for fast loading on mobile networks
- **Lazy Loading**: Components and routes loaded on demand
- **Image Optimization**: Properly sized images for different devices
- **Battery Efficiency**: Optimized location usage to preserve battery life
- **Data Conservation**: Minimal network requests to reduce data usage

## Development Guidelines

### Testing Offline Functionality

Use Chrome DevTools to test offline capabilities:

1. Open Developer Tools (F12)
2. Go to Application tab > Service Workers
3. Check "Offline" to simulate offline mode

### Service Worker Development

When modifying the service worker:

1. Always increment the cache version
2. Test thoroughly in incognito mode
3. Remember service workers update on page refresh

### Security Considerations

- Store sensitive data in secure storage
- Implement proper token rotation
- Do not cache sensitive customer information

## Debugging

To view logs from the PWA when installed:

1. Connect device to computer
2. Enable USB debugging
3. Use `chrome://inspect` to debug the installed PWA

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For rider support, please contact [vikramaditya1533@gmail.com](mailto:vikramaditya1533@gmail.com)
