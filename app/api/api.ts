import { Product } from '../types';

const API_URL = 'https://dummyjson.com';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products?limit=100`);
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};

export interface CategoryResponse {
  slug: string;
  name: string;
  url: string;
}

export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  try {
    // The API now directly returns an array of category objects
    const response = await fetch(`${API_URL}/products/categories`);
    const categories = await response.json();
    
    console.log("Raw categories response:", categories);
    
    if (!Array.isArray(categories)) {
      console.error('Invalid categories response:', categories);
      return [];
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchProductDetails = async (id: number): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product details for ID ${id}:`, error);
    return null;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}; 