import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, StyleProp, ViewStyle, DimensionValue } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
}

// Basic skeleton item with shimmer effect
export const SkeletonItem: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4 
}) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      })
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const shimmerTranslate = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  // Create a style object that TypeScript understands
  const itemStyle: StyleProp<ViewStyle> = {
    ...styles.skeletonBase,
    width,
    height,
    borderRadius,
  };

  return (
    <View style={itemStyle}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      />
    </View>
  );
};

// Skeleton for a single product card
export const ProductSkeletonItem: React.FC = () => {
  return (
    <View style={styles.productItem}>
      <SkeletonItem height={120} borderRadius={8} />
      <View style={styles.productInfo}>
        <SkeletonItem height={20} width="80%" />
        <View style={styles.gap} />
        <SkeletonItem height={15} width="95%" />
        <SkeletonItem height={15} width="70%" />
        <View style={styles.gap} />
        <View style={styles.priceRow}>
          <SkeletonItem height={20} width={60} />
          <SkeletonItem height={20} width={20} borderRadius={10} />
        </View>
      </View>
    </View>
  );
};

// Grid of skeleton product items
export const ProductSkeletonGrid: React.FC = () => {
  // Create an array of placeholders
  const placeholders = Array(6).fill(null);
  
  return (
    <View style={styles.gridContainer}>
      {placeholders.map((_, index) => (
        <ProductSkeletonItem key={`skeleton-${index}`} />
      ))}
    </View>
  );
};

// Skeleton for category tabs
export const CategorySkeletonList: React.FC = () => {
  // Create an array of placeholders
  const placeholders = Array(5).fill(null);
  
  return (
    <View style={styles.categoryContainer}>
      {placeholders.map((_, index) => (
        <SkeletonItem 
          key={`category-skeleton-${index}`} 
          width={80} 
          height={40} 
          borderRadius={20} 
        />
      ))}
    </View>
  );
};

// Skeleton for the product detail screen
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <View style={styles.detailContainer}>
      {/* Product image skeleton */}
      <SkeletonItem height={300} borderRadius={0} />
      
      {/* Thumbnail list */}
      <View style={styles.thumbnailRow}>
        {[1, 2, 3, 4].map(index => (
          <SkeletonItem 
            key={`thumbnail-${index}`} 
            width={70} 
            height={70} 
            borderRadius={8} 
          />
        ))}
      </View>
      
      {/* Product details */}
      <View style={styles.detailsSection}>
        <SkeletonItem height={24} width="90%" />
        <View style={styles.gap} />
        
        <View style={styles.priceRow}>
          <SkeletonItem height={22} width={80} />
          <SkeletonItem height={18} width={60} />
        </View>
        <View style={styles.gap} />
        
        <View style={styles.ratingRow}>
          <SkeletonItem height={20} width={120} />
        </View>
        <View style={styles.gap} />
        
        <SkeletonItem height={80} borderRadius={8} />
        <View style={styles.gap} />
        
        <SkeletonItem height={22} width={150} />
        <View style={styles.gap} />
        
        <SkeletonItem height={18} />
        <View style={styles.smallGap} />
        <SkeletonItem height={18} />
        <View style={styles.smallGap} />
        <SkeletonItem height={18} width="80%" />
      </View>
      
      {/* Bottom button */}
      <View style={styles.bottom}>
        <SkeletonItem height={50} borderRadius={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    width: 200,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    top: 0,
    opacity: 0.5,
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
  productInfo: {
    padding: 10,
  },
  gap: {
    height: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    gap: 10,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  thumbnailRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    gap: 10,
  },
  detailsSection: {
    padding: 15,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  smallGap: {
    height: 5,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default ProductSkeletonGrid; 