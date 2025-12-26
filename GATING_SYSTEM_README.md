# Prompt Gating System Documentation

## Overview
A complete prompt gating system with ad support and premium features for the PixalPrompt AI app.

## Features

### ✅ Free Users
- **3 prompts per day** limit
- Daily limit resets automatically at midnight
- Option to watch rewarded ads for bonus prompts
- Upgrade to premium option

### ✅ Premium Users
- **Unlimited prompts**
- No ads
- Premium badge display
- One-time upgrade (mocked for now)

### ✅ Rewarded Ads
- Watch ad → unlock 1 bonus prompt
- Doesn't count against daily limit
- 2-second mock ad experience
- Auto-generates prompt after ad completion

### ✅ Daily Reset Logic
- Automatic reset at midnight
- Uses AsyncStorage for persistence
- Tracks last reset date
- No manual intervention needed

## Architecture

### Files Created

```
contexts/
  └── UserContext.tsx          # Global state management for user data

components/
  ├── LimitReachedModal.tsx   # Modal shown when limit is reached
  └── DebugPanel.tsx           # Testing utility (remove in production)

app/
  ├── _layout.tsx              # Updated with UserProvider
  └── prompt-detail.tsx        # Updated with gating logic
```

## Usage

### 1. UserContext Hook

```typescript
import { useUser } from '@/contexts/UserContext';

const {
  isPremium,              // boolean: Premium status
  promptsUsedToday,       // number: Prompts used today
  dailyLimit,             // number: Daily limit (3)
  canGeneratePrompt,      // boolean: Can user generate?
  usePrompt,              // () => Promise<boolean>
  watchAdForPrompt,       // () => Promise<void>
  upgradeToPremium,       // () => Promise<void>
  resetForTesting,        // () => Promise<void>
} = useUser();
```

### 2. Checking Prompt Availability

```typescript
const handleGeneratePrompt = async () => {
  const canGenerate = await usePrompt();
  
  if (!canGenerate) {
    // Show limit modal
    setShowLimitModal(true);
    return;
  }
  
  // Generate prompt...
};
```

### 3. Watching Ads

```typescript
const handleWatchAd = async () => {
  await watchAdForPrompt();
  // Grant bonus prompt
  setGrantedByAd(true);
  // Auto-generate
  handleGeneratePrompt();
};
```

## Storage Keys

```typescript
@pixalprompt_is_premium      // boolean: Premium status
@pixalprompt_prompts_used    // number: Prompts used today
@pixalprompt_last_reset_date // string: Last reset date
```

## Testing

### Debug Panel
A floating debug button appears on the home screen (bottom right).

**Features:**
- View current status (Free/Premium)
- View prompts used (X / 3)
- Upgrade to Premium
- Reset all data

**To remove in production:**
```typescript
// In app/(tabs)/index.tsx
// Remove this line:
<DebugPanel />
```

### Manual Testing Flow

1. **Test Free User Limit:**
   - Generate 3 prompts
   - 4th attempt shows limit modal

2. **Test Ad Watching:**
   - Click "Watch Ad"
   - Wait 2 seconds (mock ad)
   - Prompt generates automatically

3. **Test Premium Upgrade:**
   - Click "Go Premium"
   - All limits removed
   - Premium badge shows

4. **Test Daily Reset:**
   - Use AsyncStorage debugger
   - Change `@pixalprompt_last_reset_date` to yesterday
   - Restart app
   - Counter resets to 0

## Integration with Real Services

### Google AdMob (Rewarded Ads)

Replace the mock in `UserContext.tsx`:

```typescript
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

const watchAdForPrompt = async () => {
  const rewarded = RewardedAd.createForAdRequest('ca-app-pub-xxxxx');
  
  return new Promise((resolve, reject) => {
    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewarded.show();
    });
    
    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      resolve();
    });
    
    rewarded.load();
  });
};
```

### In-App Purchases (Premium)

Replace the mock in `UserContext.tsx`:

```typescript
import * as InAppPurchases from 'expo-in-app-purchases';

const upgradeToPremium = async () => {
  await InAppPurchases.connectAsync();
  const { responseCode } = await InAppPurchases.purchaseItemAsync('premium_monthly');
  
  if (responseCode === InAppPurchases.IAPResponseCode.OK) {
    setIsPremium(true);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, 'true');
  }
};
```

## UI Components

### LimitReachedModal
- **Trigger:** When `promptsUsedToday >= dailyLimit`
- **Options:** Watch Ad | Go Premium
- **Design:** Dark gradient with teal/gold accents
- **Animations:** Fade + scale entrance

### Prompt Detail Screen Updates
- Shows usage counter: "X of 3 free prompts used today"
- Shows premium badge: "Premium Active • Unlimited Prompts"
- Integrates gating before generation

## Best Practices

### 1. Error Handling
```typescript
try {
  const canGenerate = await usePrompt();
  // ...
} catch (error) {
  console.error('Error checking prompt limit:', error);
  // Show error toast
}
```

### 2. Loading States
- Show loader while checking limits
- Disable button during ad playback
- Show success state after ad completion

### 3. User Feedback
- Clear messaging about limits
- Visual countdown (X of 3)
- Premium benefits highlighted

## Performance

- **AsyncStorage:** Async operations, non-blocking
- **Daily Reset:** O(1) date comparison
- **Context:** Single provider, minimal re-renders
- **Modals:** Lazy loaded, animated efficiently

## Security Considerations

⚠️ **Important:** This is client-side only!

For production:
1. Verify premium status on backend
2. Track prompt usage server-side
3. Validate ad completion with AdMob callbacks
4. Use receipt validation for IAP

## Customization

### Change Daily Limit
```typescript
// In UserContext.tsx
const DAILY_LIMIT = 5; // Change from 3 to 5
```

### Change Reset Time
Currently resets at midnight. To change:
```typescript
// In UserContext.tsx, modify loadUserData()
const today = new Date();
today.setHours(6, 0, 0, 0); // Reset at 6 AM
const resetKey = today.toISOString();
```

### Styling
All components use your existing theme:
- Dark blue gradients (#0a1628 → #1a3a5c)
- Teal accent (#14B8A6)
- Gold premium (#FFC107)

## Troubleshooting

### Issue: Limit not resetting
**Solution:** Check AsyncStorage for `@pixalprompt_last_reset_date`

### Issue: Premium not persisting
**Solution:** Verify AsyncStorage write permissions

### Issue: Modal not showing
**Solution:** Check `showLimitModal` state and `canGeneratePrompt` logic

## Future Enhancements

- [ ] Analytics tracking (prompt usage, ad views)
- [ ] Multiple premium tiers
- [ ] Referral system for bonus prompts
- [ ] Social sharing for bonus prompts
- [ ] Subscription management UI
- [ ] Ad frequency capping
- [ ] A/B testing for limit values

## License & Credits

Built for PixalPrompt AI App
React Native + Expo + AsyncStorage
No external UI libraries used

