import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../types/index';

/**
 * Load saved cart items from AsyncStorage
 */
export const loadCartItems = async (): Promise<CartItem[]> => {
  try {
    const cartItemsJson = await AsyncStorage.getItem('cartItems');
    return cartItemsJson ? JSON.parse(cartItemsJson) : [];
  } catch (error) {
    console.error('Error loading cart items from storage:', error);
    return [];
  }
};

/**
 * Load saved favorites from AsyncStorage
 */
export const loadFavorites = async (): Promise<number[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error loading favorites from storage:', error);
    return [];
  }
}; 