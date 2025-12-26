# 🚀 Quick Start Guide - Prompt Gating System

## ⚡ TL;DR

Your app now has a complete prompt gating system! Here's everything you need to know in 2 minutes.

---

## 🎮 How to Test (Right Now)

### 1. Start Your App
```bash
npm start
# or
npx expo start
```

### 2. Look for the Debug Button
- Bottom right corner
- Bug icon (🐛)
- Floating button

### 3. Test the Flow
```
Tap any card → Generate Prompt → Works (1/3)
Generate again → Works (2/3)
Generate again → Works (3/3)
Generate again → 🔒 LIMIT MODAL APPEARS!
```

### 4. Test Ad Watching
```
In modal → Tap "Watch Ad"
Wait 2 seconds (mock ad)
See "Ad Watched!" ✅
Prompt auto-generates
```

### 5. Test Premium
```
Open debug panel (🐛)
Tap "Upgrade to Premium"
Generate unlimited prompts!
No more limits 💎
```

---

## 📁 What Was Added

```
NEW FILES:
├── contexts/UserContext.tsx          ← Core logic
├── components/LimitReachedModal.tsx  ← Limit UI
├── components/DebugPanel.tsx         ← Testing tool
└── constants/prompts.ts              ← Already existed

MODIFIED FILES:
├── app/_layout.tsx                   ← Added UserProvider
├── app/prompt-detail.tsx             ← Added gating logic
└── app/(tabs)/index.tsx              ← Added debug panel

DOCUMENTATION:
├── GATING_SYSTEM_README.md           ← Full API docs
├── IMPLEMENTATION_SUMMARY.md         ← Visual guide
└── QUICK_START.md                    ← This file
```

---

## 🎯 Key Concepts

### Free Users
- 3 prompts per day
- Resets at midnight
- Can watch ads for bonus

### Premium Users
- Unlimited prompts
- No ads
- Premium badge

### Rewarded Ads
- Watch ad = 1 bonus prompt
- Doesn't count against daily limit
- Auto-generates after ad

---

## 🔧 Common Tasks

### Change Daily Limit
```typescript
// contexts/UserContext.tsx, line 18
const DAILY_LIMIT = 5; // Change from 3
```

### Remove Debug Panel (Production)
```typescript
// app/(tabs)/index.tsx
// Remove this line:
<DebugPanel />
```

### Test Daily Reset
```typescript
// Open debug panel
// Tap "Reset All Data"
// Counter resets to 0/3
```

### Check Storage
```typescript
// React Native Debugger → AsyncStorage
@pixalprompt_is_premium       // Premium status
@pixalprompt_prompts_used     // Counter
@pixalprompt_last_reset_date  // Last reset
```

---

## 🐛 Debug Panel Features

### Current Status
- Account type (FREE/PREMIUM)
- Prompts used (X/3)

### Actions
- **Upgrade to Premium** - Test premium features
- **Reset All Data** - Start fresh

### Location
- Bottom right corner
- Floating button
- Always accessible

---

## 🎨 UI Elements

### Detail Screen Footer
```typescript
// Free user sees:
ℹ️  2 of 3 free prompts used today

// Premium user sees:
💎 Premium Active • Unlimited Prompts
```

### Limit Modal
```typescript
// Appears when:
promptsUsedToday >= dailyLimit && !isPremium

// Options:
1. Watch Ad → Unlock 1 prompt
2. Go Premium → Unlimited forever
```

---

## 📊 Data Flow

```
User taps "Generate"
    ↓
Check: isPremium?
    ↓ No
Check: promptsUsedToday < 3?
    ↓ No
Show limit modal
    ↓
User watches ad
    ↓
Grant bonus prompt
    ↓
Generate prompt
    ↓
Increment counter (if not premium)
```

---

## 🔄 Daily Reset Logic

```typescript
// Automatic - no action needed!

App starts
    ↓
Load last reset date
    ↓
Compare with today
    ↓
If different day → Reset counter to 0
    ↓
Save today's date
```

---

## 🚀 Integration Checklist

### For Production:

- [ ] Test all flows thoroughly
- [ ] Integrate Google AdMob
- [ ] Add in-app purchases
- [ ] Remove debug panel
- [ ] Add backend verification
- [ ] Set up analytics
- [ ] Test on real devices
- [ ] Submit for review

---

## 💡 Pro Tips

### Testing
- Use debug panel extensively
- Test both free and premium flows
- Test ad watching multiple times
- Test daily reset logic

### Development
- Mock ad is 2 seconds (adjust as needed)
- Premium status is client-side only
- Daily reset happens at midnight
- All data persists across restarts

### Production
- Move premium verification to backend
- Track usage server-side
- Validate ad completion
- Use real ad network

---

## 🆘 Troubleshooting

### Limit not resetting?
```typescript
// Open debug panel → Reset All Data
// Or clear AsyncStorage manually
```

### Modal not showing?
```typescript
// Check console for errors
// Verify UserProvider is wrapping app
// Check promptsUsedToday value
```

### Premium not working?
```typescript
// Open debug panel
// Check status shows "PREMIUM"
// Try "Reset All Data" then upgrade again
```

### Debug panel not visible?
```typescript
// Check app/(tabs)/index.tsx
// Ensure <DebugPanel /> is present
// Check z-index (should be 1000)
```

---

## 📞 Quick Reference

### Hook Usage
```typescript
import { useUser } from '@/contexts/UserContext';

const {
  isPremium,           // boolean
  promptsUsedToday,    // number (0-3)
  dailyLimit,          // number (3)
  canGeneratePrompt,   // boolean
  usePrompt,           // async function
  watchAdForPrompt,    // async function
  upgradeToPremium,    // async function
  resetForTesting,     // async function
} = useUser();
```

### Modal Usage
```typescript
import { LimitReachedModal } from '@/components/LimitReachedModal';

<LimitReachedModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onWatchAd={handleWatchAd}
  onUpgradePremium={handleUpgrade}
  promptsUsed={promptsUsedToday}
  dailyLimit={dailyLimit}
/>
```

---

## ✅ Verification Checklist

Test these scenarios:

- [ ] Generate 3 prompts as free user
- [ ] See limit modal on 4th attempt
- [ ] Watch ad and generate bonus prompt
- [ ] Upgrade to premium
- [ ] Generate unlimited prompts
- [ ] Check premium badge shows
- [ ] Open debug panel
- [ ] View current status
- [ ] Reset all data
- [ ] Verify counter resets

---

## 🎉 You're Ready!

Everything is implemented and working. Just:

1. **Test** with the debug panel
2. **Verify** all flows work
3. **Integrate** real ads/IAP when ready
4. **Remove** debug panel for production
5. **Ship** it! 🚀

---

## 📚 More Info

- **Full API Docs:** `GATING_SYSTEM_README.md`
- **Visual Guide:** `IMPLEMENTATION_SUMMARY.md`
- **This Guide:** `QUICK_START.md`

---

**Built with ❤️ for PixalPrompt**

