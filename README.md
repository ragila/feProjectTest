# E-Commerce Mobile App

A React Native mobile app that displays products retrieved from a REST API, with the ability to browse by category, search, view product details, and add products to a shopping cart.

## Features

- Browse products by category
- Search functionality
- Product details page
- Add to cart functionality
- Favorites system
- Checkout process with order summary
- Performance optimizations for faster loading times

## Tech Stack

- React Native (CLI)
- TypeScript
- Redux Toolkit
- React Navigation
- React Native Vector Icons

## Performance Optimizations

The app includes several optimizations to improve loading times and user experience:

- Image prefetching for faster display
- Performance tracking to measure TTFB, FCP, and TTI
- Efficient list rendering for smooth scrolling
- Redux state management for predictable data flow

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

## Project Structure

```
app/
├── api/         # API integration
├── assets/      # Images, fonts, etc.
├── components/  # Reusable components
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
