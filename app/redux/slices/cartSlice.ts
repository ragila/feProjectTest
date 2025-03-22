import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState, Product } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: CartState = {
  items: [],
};

// Save cart items to AsyncStorage
const saveCartToStorage = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem('cartItems', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart items to storage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
      
      // Save to AsyncStorage whenever cart is updated
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === productId);
      
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      
      // Save to AsyncStorage whenever cart is updated
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
      
      // Save to AsyncStorage whenever cart is updated
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      
      // Save to AsyncStorage whenever cart is updated
      saveCartToStorage([]);
    },
  },
});

export const { initializeCart, addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 