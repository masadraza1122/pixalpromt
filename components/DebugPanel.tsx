import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Debug Panel for testing premium features and prompt limits
 * Remove or disable this in production
 */
export const DebugPanel: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { isPremium, promptsUsedToday, dailyLimit, upgradeToPremium, resetForTesting } = useUser();

  return (
    <>
      {/* Floating Debug Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#14B8A6', '#0D9488']}
          style={styles.floatingButtonGradient}
        >
          <Ionicons name="bug" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Debug Modal */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setVisible(false)}
          />
          
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#0f2744', '#1a3a5c']}
              style={styles.modalContent}
            >
              <View style={styles.header}>
                <Ionicons name="bug" size={24} color="#14B8A6" />
                <Text style={styles.title}>Debug Panel</Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.sectionTitle}>Current Status</Text>
                
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Account Type:</Text>
                  <View style={[styles.badge, isPremium && styles.premiumBadge]}>
                    <Text style={[styles.badgeText, isPremium && styles.premiumBadgeText]}>
                      {isPremium ? 'PREMIUM' : 'FREE'}
                    </Text>
                  </View>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Prompts Used:</Text>
                  <Text style={styles.statusValue}>
                    {promptsUsedToday} / {dailyLimit}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Test Actions</Text>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={async () => {
                    await upgradeToPremium();
                    setVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 193, 7, 0.3)', 'rgba(255, 152, 0, 0.3)']}
                    style={styles.actionButtonGradient}
                  >
                    <Ionicons name="diamond" size={20} color="#FFC107" />
                    <Text style={styles.actionButtonText}>
                      {isPremium ? 'Already Premium' : 'Upgrade to Premium'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={async () => {
                    await resetForTesting();
                    setVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(239, 68, 68, 0.3)', 'rgba(220, 38, 38, 0.3)']}
                    style={styles.actionButtonGradient}
                  >
                    <Ionicons name="refresh" size={20} color="#EF4444" />
                    <Text style={styles.actionButtonText}>Reset All Data</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <Text style={styles.footerText}>
                This panel is for testing only. Remove in production.
              </Text>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
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
    width: '85%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  statusSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14B8A6',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#14B8A6',
  },
  premiumBadgeText: {
    color: '#FFC107',
  },
  actionsSection: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

