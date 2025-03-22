import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './app/redux/store';
import AppNavigator from './app/navigation/AppNavigator';
import { initPerformanceTracking, markStart, markEnd } from './app/utils/performance';
import { loadCartItems, loadFavorites } from './app/utils/storage';
import { initializeCart } from './app/redux/slices/cartSlice';
import { initializeFavorites } from './app/redux/slices/productsSlice';

const App = () => {
  useEffect(() => {
    // Initialize performance tracking
    initPerformanceTracking();
    
    // Mark the app start time
    markStart('app_initialization');
    
    // Load saved data from AsyncStorage
    const loadSavedData = async () => {
      try {
        // Load cart items
        const cartItems = await loadCartItems();
        store.dispatch(initializeCart(cartItems));
        
        // Load favorites
        const favorites = await loadFavorites();
        store.dispatch(initializeFavorites(favorites));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };
    
    loadSavedData();
    
    // Cleanup when component unmounts
    return () => {
      markEnd('app_usage_duration');
    };
  }, []);

  useEffect(() => {
    markEnd('app_initialization');
    markStart('app_usage_duration');
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigator />
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
