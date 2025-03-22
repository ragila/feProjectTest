import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootState, Product } from '../types';
import { addToCart } from '../redux/slices/cartSlice';
import { fetchProductDetails } from '../api/api';
import { toggleFavorite } from '../redux/slices/productsSlice';
import { ProductDetailSkeleton } from '../components/SkeletonLoader';

type ProductDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;

interface ProductDetailScreenProps {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;
}

const { width } = Dimensions.get('window');

// Separate component for thumbnail items
const ThumbnailItem = ({ item, index, activeIndex, onPress }: { 
  item: string; 
  index: number;
  activeIndex: number;
  onPress: () => void;
}) => {
  const [thumbLoading, setThumbLoading] = useState(true);
  
  return (
    <TouchableOpacity 
      style={[
        styles.thumbnailContainer, 
        activeIndex === index && styles.activeThumbnail
      ]}
      onPress={onPress}
    >
      {thumbLoading && (
        <View style={styles.thumbnailLoader}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
      <Image 
        source={{ uri: item }} 
        style={styles.thumbnailImage} 
        onLoadStart={() => setThumbLoading(true)}
        onLoadEnd={() => setThumbLoading(false)}
      />
    </TouchableOpacity>
  );
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const favorites = useSelector((state: RootState) => state.products.favorites);
  const isFavorite = favorites.includes(productId);
  
  // Animation values
  const cartAnimation = useRef(new Animated.Value(0)).current;
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [mainImageLoading, setMainImageLoading] = useState(true);

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      const productData = await fetchProductDetails(productId);
      setProduct(productData);
      setLoading(false);
    };

    loadProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      // Show add to cart animation instead of navigation
      setShowAddedToCart(true);
      
      // Animate the notification
      Animated.sequence([
        Animated.timing(cartAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.delay(1000),
        Animated.timing(cartAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowAddedToCart(false);
      });
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(productId));
  };

  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <ThumbnailItem 
      item={item} 
      index={index} 
      activeIndex={activeImageIndex}
      onPress={() => setActiveImageIndex(index)}
    />
  );

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ fontSize: 48, color: "#FF3B30" }}>⚠️</Text>
        <Text style={styles.errorText}>Failed to load product details</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {mainImageLoading && (
            <View style={styles.mainImageLoader}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
          <Image
            source={{ uri: product.images[activeImageIndex] }}
            style={styles.mainImage}
            resizeMode="contain"
            onLoadStart={() => setMainImageLoading(true)}
            onLoadEnd={() => setMainImageLoading(false)}
          />
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Text style={{ fontSize: 28, color: isFavorite ? '#FF3B30' : '#fff' }}>
              {isFavorite ? '❤️' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
        <FlatList
          horizontal
          data={product.images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailList}
        />
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${product.price}</Text>
              {product.discountPercentage > 0 && (
                <Text style={styles.discount}>
                  {product.discountPercentage.toFixed(0)}% OFF
                </Text>
              )}
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={{ fontSize: 18, color: '#FFC107' }}>⭐</Text>
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.stock}>
              {product.stock > 0 
                ? `In Stock (${product.stock})` 
                : 'Out of Stock'}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Brand:</Text>
              <Text style={styles.infoValue}>{product.brand}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>
                {product.category}
              </Text>
            </View>
          </View>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
        <View style={{height: 50}} />
      </ScrollView>

      {/* Cart animation overlay */}
      {showAddedToCart && (
        <Animated.View 
          style={[
            styles.addedToCartNotification,
            {
              opacity: cartAnimation,
              transform: [
                {
                  translateY: cartAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.cartEmoji}>🛒</Text>
          <Text style={styles.addedToCartText}>Added to cart!</Text>
        </Animated.View>
      )}

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.cartEmoji}>🛒</Text>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#C2C2C2',
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailList: {
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  thumbnailContainer: {
    width: 70,
    height: 70,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  discount: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rating: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
    marginRight: 15,
  },
  stock: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 60,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addedToCartNotification: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addedToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cartEmoji: {
    fontSize: 20,
    color: '#FFF',
  },
  mainImageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: '#f0f0f0',
  },
  thumbnailLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default ProductDetailScreen; 