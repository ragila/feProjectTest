import { CategoryResponse } from '../api/api';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RootState {
  products: ProductsState;
  cart: CartState;
}

export interface ProductsState {
  products: Product[];
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  favorites: number[];
}

export interface CartState {
  items: CartItem[];
}

export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { productId: number };
  Cart: undefined;
};