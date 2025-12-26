import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface UserContextType {
  isPremium: boolean;
  promptsUsedToday: number;
  dailyLimit: number;
  canGeneratePrompt: boolean;
  usePrompt: () => Promise<boolean>;
  watchAdForPrompt: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  resetForTesting: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEYS = {
  IS_PREMIUM: '@pixalprompt_is_premium',
  PROMPTS_USED: '@pixalprompt_prompts_used',
  LAST_RESET_DATE: '@pixalprompt_last_reset_date',
};

const DAILY_LIMIT = 3;

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [promptsUsedToday, setPromptsUsedToday] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user data from storage
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [premiumStatus, promptsUsed, lastResetDate] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.IS_PREMIUM),
        AsyncStorage.getItem(STORAGE_KEYS.PROMPTS_USED),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE),
      ]);

      // Check if we need to reset daily limit
      const today = new Date().toDateString();
      const shouldReset = !lastResetDate || lastResetDate !== today;

      if (shouldReset) {
        // Reset for new day
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, today);
        await AsyncStorage.setItem(STORAGE_KEYS.PROMPTS_USED, '0');
        setPromptsUsedToday(0);
      } else {
        // Use stored value
        setPromptsUsedToday(parseInt(promptsUsed || '0', 10));
      }

      setIsPremium(premiumStatus === 'true');
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsInitialized(true);
    }
  };

  const canGeneratePrompt = isPremium || promptsUsedToday < DAILY_LIMIT;

  const usePrompt = useCallback(async (): Promise<boolean> => {
    if (isPremium) {
      // Premium users have unlimited prompts
      return true;
    }

    if (promptsUsedToday >= DAILY_LIMIT) {
      // Limit reached
      return false;
    }

    // Increment prompt count
    const newCount = promptsUsedToday + 1;
    setPromptsUsedToday(newCount);
    await AsyncStorage.setItem(STORAGE_KEYS.PROMPTS_USED, newCount.toString());
    return true;
  }, [isPremium, promptsUsedToday]);

  const watchAdForPrompt = useCallback(async () => {
    // Mock ad watching - in production, integrate with Google AdMob or similar
    // This would trigger a rewarded ad and wait for completion
    
    // Simulate ad watching delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Grant one extra prompt (doesn't count against daily limit)
    // We don't increment promptsUsedToday here - this is a bonus
    console.log('Ad watched successfully! Bonus prompt granted.');
  }, []);

  const upgradeToPremium = useCallback(async () => {
    // Mock premium upgrade - in production, integrate with in-app purchases
    setIsPremium(true);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, 'true');
    console.log('Upgraded to Premium!');
  }, []);

  const resetForTesting = useCallback(async () => {
    // Helper function for testing - reset everything
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.IS_PREMIUM,
      STORAGE_KEYS.PROMPTS_USED,
      STORAGE_KEYS.LAST_RESET_DATE,
    ]);
    setIsPremium(false);
    setPromptsUsedToday(0);
    console.log('User data reset for testing');
  }, []);

  if (!isInitialized) {
    // Could show a splash screen here
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        isPremium,
        promptsUsedToday,
        dailyLimit: DAILY_LIMIT,
        canGeneratePrompt,
        usePrompt,
        watchAdForPrompt,
        upgradeToPremium,
        resetForTesting,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

