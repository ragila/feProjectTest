import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../redux/slices/productsSlice';
import { Product, RootState } from '../types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ProductItemProps {
  item: Product;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 20;

const ProductItem: React.FC<ProductItemProps> = ({
  item,
  onPress,
  onToggleFavorite,
  isFavorite
}) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.products.favorites);
  const [imageLoading, setImageLoading] = useState(true);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(item.id));
  };

  return (
    <TouchableOpacity
      style={styles.productItem}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
        <Image 
          source={{ uri: item.thumbnail }}
          style={styles.productImage}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={onToggleFavorite}
          >
            <Text style={{fontSize: 20, color: isFavorite ? '#FF3B30' : '#777'}}>
              {isFavorite ? '❤️' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  imageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
});

export default ProductItem; 