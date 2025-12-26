import { LimitReachedModal } from '@/components/LimitReachedModal';
import { getRandomPrompt } from '@/constants/prompts';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 1.2; // 1.2 aspect ratio

export default function PromptDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { 
    isPremium, 
    promptsUsedToday, 
    dailyLimit, 
    usePrompt, 
    watchAdForPrompt, 
    upgradeToPremium 
  } = useUser();
  
  // Parse params
  const imageUrl = params.imageUrl as string;
  const title = params.title as string;
  const subtitle = params.subtitle as string;
  
  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [grantedByAd, setGrantedByAd] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const promptFadeAnim = useRef(new Animated.Value(0)).current;
  const promptSlideAnim = useRef(new Animated.Value(30)).current;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!showPrompt || !generatedPrompt) return;

    let currentIndex = 0;
    const words = generatedPrompt.split(' ');
    
    // Fade in prompt card
    Animated.parallel([
      Animated.timing(promptFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(promptSlideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText((prev) => {
          const newText = prev + (prev ? ' ' : '') + words[currentIndex];
          return newText;
        });
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 80); // Word-by-word interval (80ms feels smooth)

    return () => clearInterval(interval);
  }, [showPrompt, generatedPrompt]);

  const handleGeneratePrompt = async () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if user can generate prompt
    // If they watched an ad, allow them to proceed
    if (!grantedByAd) {
      const canGenerate = await usePrompt();
      if (!canGenerate) {
        // Show limit reached modal
        setShowLimitModal(true);
        return;
      }
    } else {
      // Reset ad grant after use
      setGrantedByAd(false);
    }

    // Start generation
    setIsGenerating(true);
    setDisplayedText('');
    setShowPrompt(false);

    // Simulate AI processing delay
    setTimeout(() => {
      // Get a random prompt
      const randomPrompt = getRandomPrompt();
      setGeneratedPrompt(randomPrompt);
      setIsGenerating(false);
      setShowPrompt(true);
    }, 1500); // 1.5 second delay to simulate API call
  };

  const handleWatchAd = async () => {
    await watchAdForPrompt();
    // Grant user ability to generate one prompt
    setGrantedByAd(true);
    setShowLimitModal(false);
    // Auto-trigger generation after watching ad
    setTimeout(() => {
      handleGeneratePrompt();
    }, 300);
  };

  const handleUpgradePremium = async () => {
    await upgradeToPremium();
    setShowLimitModal(false);
  };

  const handleCopyPrompt = () => {
    // In production, you'd use Clipboard.setString(displayedText)
    console.log('Copied to clipboard:', displayedText);
    // Could show a toast notification here
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0a1628', '#0f2744', '#1a3a5c', '#0f2744', '#0a1628']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.backgroundGradient}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 16 }]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['rgba(20, 184, 166, 0.3)', 'rgba(20, 184, 166, 0.15)']}
            style={styles.backButtonGradient}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Image Card */}
        <Animated.View
          style={[
            styles.imageCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Image Overlay Info */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
            style={styles.imageOverlay}
          >
            <Text style={styles.imageTitle}>{title}</Text>
            {subtitle && <Text style={styles.imageSubtitle}>{subtitle}</Text>}
          </LinearGradient>
        </Animated.View>

        {/* Generate Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: buttonScaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleGeneratePrompt}
            disabled={isGenerating}
            style={{ width: '100%' }}
          >
            <LinearGradient
              colors={
                isGenerating
                  ? ['rgba(20, 184, 166, 0.5)', 'rgba(13, 148, 136, 0.5)']
                  : ['#14B8A6', '#0D9488', '#0F766E']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Generate Prompt</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Loading State */}
        {isGenerating && (
          <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
            <ActivityIndicator size="large" color="#14B8A6" />
            <Text style={styles.loadingText}>Analyzing image...</Text>
            <Text style={styles.loadingSubtext}>Creating the perfect prompt</Text>
          </Animated.View>
        )}

        {/* Generated Prompt Card */}
        {showPrompt && displayedText && (
          <Animated.View
            style={[
              styles.promptCard,
              {
                opacity: promptFadeAnim,
                transform: [{ translateY: promptSlideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(20, 184, 166, 0.15)', 'rgba(20, 184, 166, 0.05)']}
              style={styles.promptCardGradient}
            >
              <View style={styles.promptHeader}>
                <View style={styles.promptHeaderLeft}>
                  <Ionicons name="checkmark-circle" size={24} color="#14B8A6" />
                  <Text style={styles.promptHeaderText}>Generated Prompt</Text>
                </View>
                <TouchableOpacity
                  onPress={handleCopyPrompt}
                  activeOpacity={0.7}
                  style={styles.copyButton}
                >
                  <Ionicons name="copy-outline" size={20} color="#14B8A6" />
                </TouchableOpacity>
              </View>

              <View style={styles.promptTextContainer}>
                <Text style={styles.promptText}>{displayedText}</Text>
                {displayedText.split(' ').length < generatedPrompt.split(' ').length && (
                  <View style={styles.cursor} />
                )}
              </View>

              {displayedText === generatedPrompt && (
                <View style={styles.promptFooter}>
                  <Text style={styles.promptFooterText}>
                    Tap the copy icon to use this prompt
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        )}

        {/* Info Section */}
        <Animated.View
          style={[
            styles.infoSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Premium Status or Usage Counter */}
          {isPremium ? (
            <View style={[styles.infoCard, styles.premiumCard]}>
              <Ionicons name="diamond" size={20} color="#FFC107" />
              <Text style={[styles.infoText, styles.premiumText]}>
                Premium Active • Unlimited Prompts
              </Text>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={20} color="#14B8A6" />
              <Text style={styles.infoText}>
                {promptsUsedToday} of {dailyLimit} free prompts used today
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        visible={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onWatchAd={handleWatchAd}
        onUpgradePremium={handleUpgradePremium}
        promptsUsed={promptsUsedToday}
        dailyLimit={dailyLimit}
      />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageCard: {
    marginTop: 80,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  imageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  imageSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#14B8A6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
  },
  promptCard: {
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#14B8A6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  promptCardGradient: {
    padding: 20,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  promptHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promptHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  copyButton: {
    padding: 8,
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  promptTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: '#14B8A6',
    marginTop: 4,
    opacity: 0.8,
  },
  promptFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptFooterText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
    lineHeight: 20,
  },
  premiumCard: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  premiumText: {
    color: '#FFC107',
    fontWeight: '600',
  },
});

