import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, RootState, Product } from '../types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CategoryResponse } from '../api/api';
import ProductSkeletonGrid from '../components/SkeletonLoader';
import ProductItem from '../components/ProductItem';

import { getProducts, getCategories, setSelectedCategory, getProductsByCategory, toggleFavorite } from '../redux/slices/productsSlice';
import { searchProducts } from '../api/api';
import { AppDispatch } from '../redux/store';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, categories, loading, selectedCategory, favorites } = useSelector(
    (state: RootState) => state.products
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  console.log(categories);
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    // Add detailed logging for categories
    console.log('HomeScreen categories received:', JSON.stringify(categories));
  }, [categories]);

  const handleCategoryPress = (category: CategoryResponse) => {
    // We know it's a CategoryResponse object
    dispatch(setSelectedCategory(category.slug));
    dispatch(getProductsByCategory(category.slug));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    // Set new timeout for search (300ms throttle)
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchProducts(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleFavorite = (productId: number) => {
    dispatch(toggleFavorite(productId));
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductItem
      item={item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      isFavorite={favorites.includes(item.id)}
    />
  );

  const displayProducts = searchQuery.trim() !== '' ? searchResults : products;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={[styles.searchIcon, {fontSize: 24}]}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="always"
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryTab,
            !selectedCategory && styles.selectedCategoryTab,
          ]}
          onPress={() => {
            dispatch(setSelectedCategory(null));
            dispatch(getProducts() as any);
          }}
        >
          <Text style={[
            styles.categoryText,
            !selectedCategory && styles.selectedCategoryText,
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={`category-${category.slug}`}
            style={[
              styles.categoryTab,
              selectedCategory === category.slug && styles.selectedCategoryTab,
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text numberOfLines={1} style={[
              styles.categoryText,
              selectedCategory === category.slug && styles.selectedCategoryText,
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading || isSearching ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ProductSkeletonGrid />
        </View>
      ) : displayProducts.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={{fontSize: 48, color: '#777'}}>⚠️</Text>
          <Text style={styles.noResultsText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={displayProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 30,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryTab: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 10,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  favoriteButton: {
    padding: 5,
  },
  searchingText: {
    marginTop: 10,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen; 