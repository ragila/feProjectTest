// Add or update Category interface
export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  rating: number;
  stock: number;
  category: string;
  brand: string;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductsState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  favorites: number[];
}

export interface CartState {
  items: CartItem[];
}

export interface RootState {
  products: ProductsState;
  cart: CartState;
}

export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { productId: number };
  Cart: undefined;
}; 