import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsState } from '../../types';
import { fetchProducts, fetchProductsByCategory, fetchCategories } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: ProductsState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null,
  favorites: [],
};

// Save favorites to AsyncStorage
const saveFavoritesToStorage = async (favorites: number[]) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to storage:', error);
  }
};

export const getProducts = createAsyncThunk('products/getProducts', async () => {
  const products = await fetchProducts();
  return products;
});

export const getCategories = createAsyncThunk('products/getCategories', async () => {
  const categories = await fetchCategories();
  return categories;
});

export const getProductsByCategory = createAsyncThunk(
  'products/getProductsByCategory',
  async (category: string) => {
    const products = await fetchProductsByCategory(category);
    return products;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    initializeFavorites: (state, action: PayloadAction<number[]>) => {
      state.favorites = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (state.favorites.includes(productId)) {
        state.favorites = state.favorites.filter(id => id !== productId);
      } else {
        state.favorites.push(productId);
      }
      // Save to AsyncStorage whenever favorites are updated
      saveFavoritesToStorage(state.favorites);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products by category';
      });
  },
});

export const { initializeFavorites, setSelectedCategory, toggleFavorite } = productsSlice.actions;
export default productsSlice.reducer; 