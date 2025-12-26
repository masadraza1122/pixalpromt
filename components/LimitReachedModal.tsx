import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface LimitReachedModalProps {
  visible: boolean;
  onClose: () => void;
  onWatchAd: () => Promise<void>;
  onUpgradePremium: () => Promise<void>;
  promptsUsed: number;
  dailyLimit: number;
}

export const LimitReachedModal: React.FC<LimitReachedModalProps> = ({
  visible,
  onClose,
  onWatchAd,
  onUpgradePremium,
  promptsUsed,
  dailyLimit,
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Reset ad watched state when modal opens
      setAdWatched(false);
      
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animation
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

  const handleWatchAd = async () => {
    setIsWatchingAd(true);
    try {
      await onWatchAd();
      setAdWatched(true);
      
      // Auto close after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error watching ad:', error);
    } finally {
      setIsWatchingAd(false);
    }
  };

  const handleUpgradePremium = async () => {
    try {
      await onUpgradePremium();
      onClose();
    } catch (error) {
      console.error('Error upgrading to premium:', error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#0f2744', '#1a3a5c', '#0f2744']}
            style={styles.modalContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['rgba(255, 193, 7, 0.3)', 'rgba(255, 152, 0, 0.3)']}
                  style={styles.iconGradient}
                >
                  <Ionicons name="lock-closed" size={32} color="#FFC107" />
                </LinearGradient>
              </View>
              
              <Text style={styles.title}>Daily Limit Reached</Text>
              <Text style={styles.subtitle}>
                You've used {promptsUsed} of {dailyLimit} free prompts today
              </Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {/* Watch Ad Option */}
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleWatchAd}
                disabled={isWatchingAd || adWatched}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    adWatched
                      ? ['rgba(76, 175, 80, 0.3)', 'rgba(56, 142, 60, 0.3)']
                      : ['rgba(20, 184, 166, 0.2)', 'rgba(13, 148, 136, 0.2)']
                  }
                  style={styles.optionGradient}
                >
                  <View style={styles.optionIcon}>
                    {isWatchingAd ? (
                      <ActivityIndicator size="small" color="#14B8A6" />
                    ) : adWatched ? (
                      <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                    ) : (
                      <Ionicons name="videocam" size={28} color="#14B8A6" />
                    )}
                  </View>
                  
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>
                      {adWatched ? 'Ad Watched!' : isWatchingAd ? 'Loading Ad...' : 'Watch Ad'}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {adWatched ? 'You can now generate a prompt' : 'Unlock 1 prompt instantly'}
                    </Text>
                  </View>
                  
                  <View style={styles.optionArrow}>
                    {!isWatchingAd && !adWatched && (
                      <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Premium Option */}
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleUpgradePremium}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 193, 7, 0.25)', 'rgba(255, 152, 0, 0.25)']}
                  style={styles.optionGradient}
                >
                  <View style={[styles.optionIcon, styles.premiumIcon]}>
                    <Ionicons name="diamond" size={28} color="#FFC107" />
                  </View>
                  
                  <View style={styles.optionTextContainer}>
                    <View style={styles.premiumTitleRow}>
                      <Text style={styles.optionTitle}>Go Premium</Text>
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumBadgeText}>BEST VALUE</Text>
                      </View>
                    </View>
                    <Text style={styles.optionDescription}>
                      Unlimited prompts • No ads • Priority support
                    </Text>
                  </View>
                  
                  <View style={styles.optionArrow}>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer Info */}
            <View style={styles.footer}>
              <Ionicons name="time-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
              <Text style={styles.footerText}>
                Your free prompts reset daily at midnight
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 24,
  },
  modalContent: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  premiumIcon: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFC107',
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  optionArrow: {
    width: 20,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

