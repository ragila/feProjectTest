# E-Commerce Mobile App

A React Native mobile app that displays products retrieved from a REST API, with the ability to browse by category, search, view product details, and add products to a shopping cart.

## Features

- Browse products by category with tab navigation
- Advanced search functionality with debouncing
- Product details page with image galleries
- Add to cart with animated confirmation
- Favorites system with persistent storage
- Skeleton loading for improved perceived performance
- Image loading states with loading indicators
- Responsive layouts for different screen sizes
- Cart management with quantity controls and animations
- Fallback components for graceful error handling

## Tech Stack

- React Native (CLI)
- TypeScript
- Redux Toolkit with persistent storage
- React Navigation
- React Native Vector Icons
- Animated API for smooth transitions

## Performance Optimizations

The app includes several optimizations to improve loading times and user experience:

- Skeleton loaders that mimic the final UI during data loading
- Image loading indicators to prevent layout shifts
- Debounced search to reduce API calls
- Loading state management for smooth transitions
- Animation-based feedback for user interactions
- Efficient list rendering for smooth scrolling
- Redux state management for predictable data flow

## User Experience Enhancements

- Animated "Added to Cart" notifications
- Smooth fade animations for adding/removing cart items
- Image loading states that prevent UI jumps
- Skeleton loaders that match the final UI layout
- Comprehensive error handling with user-friendly messages
- Pull-to-refresh functionality for product listings

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app
```

2. Install dependencies:
```bash
yarn install
```

3. Install CocoaPods (iOS):
```bash
cd ios && pod install && cd ..
```

## Running the App

### iOS
```bash
yarn ios
```

### Android
```bash
yarn android
```

### Metro Bundler
```bash
yarn start
```

## Building Release Versions

### Android APK
```bash
cd android && ./gradlew assembleRelease
```
The APK will be available at `android/app/build/outputs/apk/release/app-release.apk`

### iOS IPA
Build the release version using Xcode by selecting "Product" > "Archive".

## Project Structure

```
app/
├── api/         # API integration
├── assets/      # Images, fonts, etc.
├── components/  # Reusable components
│   ├── ProductItem.tsx        # Product card component
│   └── SkeletonLoader.tsx     # Skeleton loading components
├── navigation/  # App navigation
├── redux/       # State management
│   ├── slices/  # Redux slices
│   └── store.ts # Redux store
├── screens/     # App screens
├── types/       # TypeScript types
└── utils/       # Utility functions
```

## API Reference

The app uses the DummyJSON API for product data:
- Base URL: `https://dummyjson.com`
- API Documentation: [https://dummyjson.com/docs/products](https://dummyjson.com/docs/products)

## License

MIT
