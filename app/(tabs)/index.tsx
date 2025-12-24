import { CategoryTabs } from '@/components/CategoryTabs';
import { PromptCard, getNumColumns } from '@/components/PromptCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Dummy data for prompts - organized by category
const PROMPTS_BY_CATEGORY = {
  New: [
    {
      id: 'new1',
      imageUrl: 'https://images.unsplash.com/photo-1635241161466-541f065683ba?w=400&h=500&fit=crop',
      title: 'AI Future Vision',
      subtitle: 'Latest Tech',
      rating: 4.8,
    },
    {
      id: 'new2',
      imageUrl: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=500&fit=crop',
      title: 'Neon Dreams',
      subtitle: 'Cyberpunk Style',
      rating: 4.7,
    },
    {
      id: 'new3',
      imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=500&fit=crop',
      title: 'Digital Art',
      subtitle: 'Abstract AI',
      rating: 4.5,
    },
    {
      id: 'new4',
      imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=500&fit=crop',
      title: '3D Render',
      subtitle: 'Modern Design',
    },
    {
      id: 'new5',
      imageUrl: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=500&fit=crop',
      title: 'Space Explorer',
      subtitle: 'Sci-Fi',
      rating: 4.9,
    },
    {
      id: 'new6',
      imageUrl: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&h=500&fit=crop',
      title: 'AI Generated',
      subtitle: 'Unique Art',
    },
  ],
  Trending: [
    {
      id: 'trend1',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop',
      title: 'PixalPrompt: AI Photo',
      subtitle: 'Most Popular',
      rating: 4.9,
    },
    {
      id: 'trend2',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
      title: 'Beauty Portrait',
      subtitle: 'Trending Now',
      rating: 4.8,
    },
    {
      id: 'trend3',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      title: 'Professional Look',
      subtitle: 'Hot Today',
      rating: 4.7,
    },
    {
      id: 'trend4',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop',
      title: 'Fashion Style',
      subtitle: 'Top Rated',
      rating: 4.8,
    },
    {
      id: 'trend5',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
      title: 'Natural Beauty',
      subtitle: 'Viral',
      rating: 4.9,
    },
    {
      id: 'trend6',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=500&fit=crop',
      title: 'Dream Scene',
      subtitle: 'Trending',
      rating: 4.6,
    },
  ],
  Portrait: [
    {
      id: 'port1',
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
      title: 'Classic Portrait',
      subtitle: 'Professional',
      rating: 4.7,
    },
    {
      id: 'port2',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
      title: 'Studio Shot',
      subtitle: 'High Quality',
      rating: 4.8,
    },
    {
      id: 'port3',
      imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop',
      title: 'Natural Light',
      subtitle: 'Outdoor',
      rating: 4.6,
    },
    {
      id: 'port4',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
      title: 'Male Portrait',
      subtitle: 'Modern Style',
      rating: 4.5,
    },
    {
      id: 'port5',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
      title: 'Business Portrait',
      subtitle: 'Corporate',
      rating: 4.7,
    },
    {
      id: 'port6',
      imageUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=500&fit=crop',
      title: 'Artistic Portrait',
      subtitle: 'Creative',
      rating: 4.8,
    },
  ],
  Cinematic: [
    {
      id: 'cine1',
      imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=500&fit=crop',
      title: 'Movie Scene',
      subtitle: 'Dramatic',
      rating: 4.9,
    },
    {
      id: 'cine2',
      imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=500&fit=crop',
      title: 'Film Noir',
      subtitle: 'Classic Cinema',
      rating: 4.8,
    },
    {
      id: 'cine3',
      imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=500&fit=crop',
      title: 'Action Shot',
      subtitle: 'Dynamic',
      rating: 4.7,
    },
    {
      id: 'cine4',
      imageUrl: 'https://images.unsplash.com/photo-1574267432644-f610f4ac0b19?w=400&h=500&fit=crop',
      title: 'Epic Moment',
      subtitle: 'Blockbuster',
      rating: 4.9,
    },
    {
      id: 'cine5',
      imageUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=500&fit=crop',
      title: 'Wide Angle',
      subtitle: 'Cinematic View',
      rating: 4.6,
    },
    {
      id: 'cine6',
      imageUrl: 'https://images.unsplash.com/photo-1509319117456-e0d96a4f28c9?w=400&h=500&fit=crop',
      title: 'Atmospheric',
      subtitle: 'Mood Lighting',
      rating: 4.8,
    },
  ],
};

const CATEGORIES = ['New', 'Trending', 'Portrait', 'Cinematic'];

const BOTTOM_TABS = [
  { id: 'home', label: 'Home', icon: 'home' as const },
  { id: 'favorite', label: 'Favorite', icon: 'heart' as const },
  { id: 'more', label: 'More', icon: 'ellipsis-horizontal' as const },
];

const MORE_MENU_ITEMS = [
  { id: 'profile', title: 'My Profile', icon: 'person-outline', description: 'View and edit your profile' },
  { id: 'settings', title: 'Settings', icon: 'settings-outline', description: 'App preferences and options' },
  { id: 'contact', title: 'Contact Us', icon: 'mail-outline', description: 'Get in touch with support' },
  { id: 'terms', title: 'Terms & Conditions', icon: 'document-text-outline', description: 'Read our terms of service' },
  { id: 'privacy', title: 'Privacy Policy', icon: 'shield-checkmark-outline', description: 'How we protect your data' },
  { id: 'about', title: 'About Us', icon: 'information-circle-outline', description: 'Learn more about PixalPrompt' },
  { id: 'rate', title: 'Rate App', icon: 'star-outline', description: 'Share your feedback' },
  { id: 'share', title: 'Share App', icon: 'share-social-outline', description: 'Tell your friends' },
];

const getResponsiveSizes = () => {
  const { width, height } = Dimensions.get('window');
  const isSmallDevice = width < 375;
  const isTablet = Math.min(width, height) >= 600;
  
  return {
    appNameSize: isTablet ? 26 : isSmallDevice ? 18 : 22,
    subtitleSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    iconSize: isTablet ? 28 : 24,
    headerPaddingH: isTablet ? 24 : isSmallDevice ? 16 : 20,
    headerPaddingV: isTablet ? 16 : isSmallDevice ? 8 : 12,
  };
};

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('New');
  const [activeBottomTab, setActiveBottomTab] = useState('home');
  const [numColumns, setNumColumns] = useState(getNumColumns());
  const [key, setKey] = useState('grid-2');
  const [responsiveSizes, setResponsiveSizes] = useState(getResponsiveSizes());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const insets = useSafeAreaInsets();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabIconScales = useRef(
    BOTTOM_TABS.reduce((acc, tab) => {
      acc[tab.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      const newNumColumns = getNumColumns();
      if (newNumColumns !== numColumns) {
        setNumColumns(newNumColumns);
        setKey(`grid-${newNumColumns}`); // Force FlatList re-render
      }
      setResponsiveSizes(getResponsiveSizes());
    });

    return () => subscription?.remove();
  }, [numColumns]);

  const animateTabSwitch = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    callback();
  };

  const handleTabPress = (tabId: string) => {
    // Animate icon press
    Animated.sequence([
      Animated.timing(tabIconScales[tabId], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(tabIconScales[tabId], {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Switch tab with fade animation
    animateTabSwitch(() => setActiveBottomTab(tabId));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const getFilteredPrompts = () => {
    if (activeBottomTab === 'favorite') {
      // Get all prompts from all categories and filter favorites
      const allPrompts = Object.values(PROMPTS_BY_CATEGORY).flat();
      return allPrompts.filter(prompt => favorites.has(prompt.id));
    }
    // Return prompts based on active category
    return PROMPTS_BY_CATEGORY[activeCategory as keyof typeof PROMPTS_BY_CATEGORY] || [];
  };

  const renderPromptCard = ({ item }: { item: typeof PROMPTS_BY_CATEGORY.New[0] }) => (
    <PromptCard
      id={item.id}
      imageUrl={item.imageUrl}
      title={item.title}
      subtitle={item.subtitle}
      rating={item.rating}
      isFavorite={favorites.has(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  );

  const renderMoreMenuItem = ({ item }: { item: typeof MORE_MENU_ITEMS[0] }) => (
    <TouchableOpacity 
      style={styles.moreMenuItem}
      activeOpacity={0.7}
      onPress={() => {
        // Handle menu item press
        console.log('Pressed:', item.id);
      }}
    >
      <View style={styles.moreMenuIconContainer}>
        <Ionicons name={item.icon as any} size={24} color="#14B8A6" />
      </View>
      <View style={styles.moreMenuTextContainer}>
        <Text style={styles.moreMenuTitle}>{item.title}</Text>
        <Text style={styles.moreMenuDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.4)" />
    </TouchableOpacity>
  );


  const dynamicStyles = {
    safeArea: {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || insets.top : insets.top,
    },
    gridContent: {
      paddingBottom: 100 + insets.bottom,
    },
    bottomNav: {
      paddingBottom: Math.max(insets.bottom, 12),
    },
    headerContent: {
      paddingHorizontal: responsiveSizes.headerPaddingH,
    },
    header: {
      paddingTop: responsiveSizes.headerPaddingV,
    },
    appName: {
      fontSize: responsiveSizes.appNameSize,
    },
    subtitle: {
      fontSize: responsiveSizes.subtitleSize,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        translucent 
        backgroundColor="transparent" 
      />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0a1628', '#0f2744', '#1a3a5c', '#0f2744', '#0a1628']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.backgroundGradient}
      />

      <View style={[styles.safeArea, dynamicStyles.safeArea]}>
        {/* Header */}
        <LinearGradient
          colors={[
            'rgba(20, 184, 166, 0.4)', 
            'rgba(20, 184, 166, 0.25)', 
            'rgba(13, 148, 136, 0.15)', 
            'transparent'
          ]}
          locations={[0, 0.3, 0.6, 1]}
          style={[styles.header, dynamicStyles.header]}
        >
          <View style={[styles.headerContent, dynamicStyles.headerContent]}>
            <Ionicons name="arrow-back" size={responsiveSizes.iconSize} color="#FFFFFF" />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.appName, dynamicStyles.appName]}>PixalPrompt</Text>
              <Text style={[styles.subtitle, dynamicStyles.subtitle]}>(Most Trending AI Prompts)</Text>
            </View>
            <View style={{ width: responsiveSizes.iconSize }} />
          </View>
        </LinearGradient>

        {/* Category Tabs - Hidden on More screen */}
        {activeBottomTab !== 'more' && (
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        )}

        {/* Prompt Grid or More Menu */}
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {activeBottomTab === 'more' ? (
            <FlatList
              data={MORE_MENU_ITEMS}
              renderItem={renderMoreMenuItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[styles.moreMenuContent, dynamicStyles.gridContent]}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              key={`${key}-${activeBottomTab}-${activeCategory}`}
              data={getFilteredPrompts()}
              renderItem={renderPromptCard}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
              contentContainerStyle={[styles.gridContent, dynamicStyles.gridContent]}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={Platform.OS === 'android'}
              maxToRenderPerBatch={6}
              updateCellsBatchingPeriod={50}
              initialNumToRender={8}
              windowSize={5}
              ListEmptyComponent={
                activeBottomTab === 'favorite' ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="heart-outline" size={64} color="rgba(255, 255, 255, 0.3)" />
                    <Text style={styles.emptyStateText}>No favorites yet</Text>
                    <Text style={styles.emptyStateSubtext}>
                      Tap the heart icon on any prompt to add it to your favorites
                    </Text>
                  </View>
                ) : null
              }
            />
          )}
        </Animated.View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavContainer}>
          <LinearGradient
            colors={[
              'rgba(10, 22, 40, 0.85)', 
              'rgba(15, 39, 68, 0.95)', 
              'rgba(10, 22, 40, 1)'
            ]}
            locations={[0, 0.5, 1]}
            style={[styles.bottomNav, dynamicStyles.bottomNav]}
          >
            {BOTTOM_TABS.map((tab) => {
              const isActive = tab.id === activeBottomTab;
              const showBadge = tab.id === 'favorite' && favorites.size > 0;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.bottomTab}
                  onPress={() => handleTabPress(tab.id)}
                  activeOpacity={0.7}
                >
                  <Animated.View style={{ transform: [{ scale: tabIconScales[tab.id] }] }}>
                    <View>
                      <Ionicons
                        name={isActive ? tab.icon : `${tab.icon}-outline`}
                        size={24}
                        color={isActive ? '#14B8A6' : '#999999'}
                      />
                      {showBadge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{favorites.size}</Text>
                        </View>
                      )}
                    </View>
                  </Animated.View>
                  <Text style={[styles.bottomTabText, isActive && styles.activeBottomTabText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: '#14B8A6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(20, 184, 166, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    gap: 8,
  },
  gridContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  bottomTabText: {
    fontSize: 11,
    color: '#888888',
    marginTop: 6,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activeBottomTabText: {
    color: '#14B8A6',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    minHeight: 300,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#14B8A6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    shadowColor: '#14B8A6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  moreMenuContent: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  moreMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  moreMenuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moreMenuTextContainer: {
    flex: 1,
  },
  moreMenuTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  moreMenuDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },
});
