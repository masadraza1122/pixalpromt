import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const getCardWidth = () => {
  const { width, height } = Dimensions.get('window');
  const isTablet = Math.min(width, height) >= 600;
  const isLandscape = width > height;
  const isSmallDevice = width < 375;
  
  if (isTablet && isLandscape) {
    return (width - 80) / 4; // 4 columns for tablet landscape
  } else if (isTablet) {
    return (width - 64) / 3; // 3 columns for tablet portrait
  } else if (isSmallDevice) {
    return (width - 48) / 2; // 2 columns for small phone
  } else {
    return (width - 52) / 2; // 2 columns for phone
  }
};

const getResponsiveFontSizes = () => {
  const { width, height } = Dimensions.get('window');
  const isTablet = Math.min(width, height) >= 600;
  const isSmallDevice = width < 375;
  
  return {
    title: isTablet ? 15 : isSmallDevice ? 11 : 13,
    subtitle: isTablet ? 12 : isSmallDevice ? 9 : 10,
    rating: isTablet ? 13 : isSmallDevice ? 10 : 11,
    starSize: isTablet ? 14 : isSmallDevice ? 10 : 12,
    heartSize: isTablet ? 28 : isSmallDevice ? 22 : 24,
    buttonSize: isTablet ? 48 : isSmallDevice ? 40 : 44,
  };
};

export const getNumColumns = () => {
  const { width, height } = Dimensions.get('window');
  const isTablet = Math.min(width, height) >= 600;
  const isLandscape = width > height;
  
  if (isTablet && isLandscape) return 4;
  if (isTablet) return 3;
  return 2;
};

interface PromptCardProps {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  rating?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ 
  id, 
  imageUrl, 
  title, 
  subtitle, 
  rating,
  isFavorite = false,
  onToggleFavorite
}) => {
  const router = useRouter();
  const [cardWidth, setCardWidth] = useState(getCardWidth());
  const [fontSizes, setFontSizes] = useState(getResponsiveFontSizes());
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const heartScaleAnim = useRef(new Animated.Value(1)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in and scale up animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Heart animation when favorite changes
    Animated.sequence([
      Animated.timing(heartScaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(heartScaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFavorite]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setCardWidth(getCardWidth());
      setFontSizes(getResponsiveFontSizes());
    });

    return () => subscription?.remove();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const handleCardPress = () => {
    router.push({
      pathname: '/prompt-detail',
      params: {
        imageUrl,
        title,
        subtitle: subtitle || '',
        id,
      },
    });
  };

  const dynamicStyles = {
    cardContainer: {
      width: cardWidth,
      height: cardWidth * 1.35,
    },
  };

  return (
    <Animated.View 
      style={[
        styles.cardContainer, 
        dynamicStyles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: Animated.multiply(scaleAnim, pressAnim) }
          ],
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.cardBackground}
          imageStyle={styles.cardImage}
          resizeMode="cover"
          defaultSource={require('@/assets/images/icon.png')}
        >
        {/* Top info overlay */}
        {(title || subtitle || rating) && (
          <View style={styles.topInfo}>
             {title && <Text style={[styles.title, { fontSize: fontSizes.title }]} numberOfLines={2}>{title}</Text>}
             {subtitle && <Text style={[styles.subtitle, { fontSize: fontSizes.subtitle }]} numberOfLines={1}>{subtitle}</Text>}
             {rating && (
               <View style={styles.ratingContainer}>
                 <Ionicons name="star" size={fontSizes.starSize} color="#FFD700" />
                 <Text style={[styles.rating, { fontSize: fontSizes.rating }]}>{rating}</Text>
               </View>
             )}
           </View>
         )}
 
         {/* Favorite button */}
         <TouchableOpacity
           style={[styles.favoriteButton, { width: fontSizes.buttonSize, height: fontSizes.buttonSize }]}
           onPress={handleToggleFavorite}
           activeOpacity={0.7}
         >
           <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
             <Ionicons
               name={isFavorite ? "heart" : "heart-outline"}
               size={fontSizes.heartSize}
               color={isFavorite ? "#14B8A6" : "#FFFFFF"}
             />
           </Animated.View>
         </TouchableOpacity>
       </ImageBackground>
      </TouchableOpacity>
     </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 18,
  },
  cardImage: {
    borderRadius: 18,
  },
  topInfo: {
    padding: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#E5E5E5',
    fontSize: 10,
    marginBottom: 6,
    opacity: 0.9,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rating: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(20, 20, 30, 0.7)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#14B8A6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

