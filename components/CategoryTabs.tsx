import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const getResponsiveSizes = () => {
  const { width, height } = Dimensions.get('window');
  const isTablet = Math.min(width, height) >= 600;
  const isSmallDevice = width < 375;
  
  return {
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    paddingH: isTablet ? 28 : isSmallDevice ? 18 : 24,
    paddingV: isTablet ? 14 : isSmallDevice ? 10 : 12,
    containerPaddingH: isTablet ? 22 : isSmallDevice ? 14 : 18,
    containerPaddingV: isTablet ? 8 : isSmallDevice ? 6 : 6,
  };
};

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const [sizes, setSizes] = useState(getResponsiveSizes());
  const scaleAnims = useRef(
    categories.reduce((acc, category) => {
      acc[category] = new Animated.Value(category === activeCategory ? 1 : 0.95);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setSizes(getResponsiveSizes());
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    // Animate active tab
    categories.forEach(category => {
      Animated.spring(scaleAnims[category], {
        toValue: category === activeCategory ? 1 : 0.95,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  }, [activeCategory]);

  const dynamicContainerStyle = {
    paddingHorizontal: sizes.containerPaddingH,
    paddingVertical: sizes.containerPaddingV,
  };

  const dynamicTabStyle = {
    paddingHorizontal: sizes.paddingH,
    paddingVertical: sizes.paddingV,
  };

  const dynamicTextStyle = {
    fontSize: sizes.fontSize,
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, dynamicContainerStyle]}
      style={styles.scrollView}
    >
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <Animated.View
            key={category}
            style={{
              transform: [{ scale: scaleAnims[category] }],
            }}
          >
            <TouchableOpacity
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
            >
            {isActive ? (
              <LinearGradient
                colors={['#14B8A6', '#2DD4BF', '#14B8A6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
                style={[styles.activeTab, dynamicTabStyle]}
              >
                <Text style={[styles.activeTabText, dynamicTextStyle]}>{category}</Text>
              </LinearGradient>
              ) : (
                <View style={[styles.inactiveTab, dynamicTabStyle]}>
                  <Text style={[styles.inactiveTabText, dynamicTextStyle]}>{category}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  container: {
    gap: 14,
  },
  activeTab: {
    borderRadius: 24,
    shadowColor: '#14B8A6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  inactiveTab: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveTabText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

