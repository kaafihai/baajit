# Baajit v1.1 Features - Habit Formation Enhancements

Welcome to Baajit v1.1! We've built intelligent habit formation features that understand your unique rhythm and energy patterns.

## 🌅 Feature 1: Time-of-Day Cues

**What it does:** Set the best time for each habit - morning, afternoon, evening, or anytime.

**Why it matters:** Our brains are different at different times of day. Morning people can tackle hard things early, while others hit their stride later. Baajit helps you match habits to your natural rhythm.

**How to use:**
1. Create or edit a habit
2. Select "When do you want to do this?"
3. Choose: 🌅 Morning, ☀️ Afternoon, 🌙 Evening, or ⏰ Anytime
4. Habits show their best time in the suggestions

**Implementation:**
- New field: `timeOfDay` (morning | afternoon | evening | anytime)
- Added to habit form with emoji indicators
- Displayed in habit suggestions for context

---

## ⚡ Feature 2: Habit Stacking (Chaining Habits)

**What it does:** Link habits together so you can do one "after" another, building stronger routines.

**Why it matters:** Neurodivergent folks often do better with habit chains - using one behavior to cue the next. Instead of "remember to drink water," it's "drink water after breakfast."

**How to use:**
1. Create a new habit
2. Scroll to "Chain with another habit"
3. Select a habit from the dropdown: "After 'Breakfast' do this"
4. The app remembers the chain and suggests them together

**Example chains:**
- Stretch → Drink water
- Brush teeth → Take medication
- Morning tea → Review tasks for the day

**Implementation:**
- New field: `linkedHabitId` (UUID reference to another habit)
- Habit form shows available habits to link to
- Backend supports cascading habit suggestions

---

## 🪴 Feature 3: Energy-Aware Habit Suggestions

**What it does:** Automatically suggests habits that match your current energy level, based on your latest mood.

**Energy Levels:**
- 🪴 **Low Energy** (5-10 min): Gentle habits when you're tired or overwhelmed
- ⭐ **Medium Energy** (10-30 min): Standard habits for balanced days
- ⚡ **High Energy** (30+ min): Bigger habits when you're feeling great

**Why it matters:** ADHD and neurodivergent minds have fluctuating energy. Some days you're UP. Some days you're struggling. Smart suggestions meet you where you are.

**How to use:**
1. Log a mood on the app
2. The dashboard shows "Smart Suggestions"
3. It displays habits matching your current energy level
4. Try different energy habits if you need variety

**How it works:**
- Scans your latest mood entry
- Maps mood to energy: Terrible/Bad = Low, Okay = Medium, Good/Great = High
- Shows matching habits at the top
- Offers alternative energy levels if you want to try something different

**Implementation:**
- New field: `energyLevel` (low | medium | high)
- Hook: `useEnergyAwareness()` analyzes mood → energy mapping
- Component: `EnergyAwareSuggestions` displays smart recommendations
- Integrated into dashboard as "Smart Suggestions" section

---

## 🔔 Feature 4: Gentle Notifications (Push Reminders)

**What it does:** Optional, soft reminders at a time you choose - without being pushy or overwhelming.

**Why it matters:** Sometimes reminders help; sometimes they stress us out. You choose whether, when, and how often.

**How to use:**
1. Create or edit a habit
2. Check "Gentle reminders (optional)"
3. Set a time (e.g., 09:00 AM)
4. Get kind nudges at that time - or turn it off anytime

**What you'll see:**
- Soft notification: "Time for [Habit Name]?"
- Optional message from the rabbit
- No pressure - skip without consequences
- Notifications honor your energy level

**Implementation:**
- New fields: `notificationsEnabled` (boolean), `notificationTime` (HH:MM format)
- Conditional UI in habit form - time picker appears only if enabled
- Backend ready for notification queue (feature complete for v1.1)
- Can be integrated with push services (Firebase, etc.) in future

---

## 👑 Feature 5: Rabbit Emotions (Activity-Based)

**What it does:** Your rabbit companion's mood reflects YOUR mood and activity throughout the day.

**Emotions you'll see:**
- 😊 **Happy**: Normal productive day
- ⚡ **Energetic**: High activity, tasks flying
- 😌 **Calm**: Peaceful, light activity
- 😴 **Tired**: Low energy, few activities
- 🎯 **Focused**: In the zone, working steady
- 🤔 **Confused**: Mixed signals (trying hard but struggling)
- 👑 **Proud**: Major streaks or milestone achievements

**Why it matters:** The rabbit isn't just cute - it's your reflection. When you're doing well, the rabbit is proud. When you're exhausted, the rabbit gets that. It's emotional mirroring and validation.

**How to use:**
1. Go to the dashboard
2. Look at your rabbit greeting
3. Notice the emotion badge (e.g., "Focused")
4. Read what the rabbit is feeling
5. The emotion updates as you log moods and complete tasks

**Implementation:**
- New field in RabbitState: `currentEmotion` (emotion type)
- Hook: `useRabbitEmotion()` analyzes user activity
- Algorithm considers:
  - Today's task completions
  - Today's habit completions
  - Latest mood entry
  - Streak status
- Component: `RabbitEmotionDisplay` shows emotion with personality
- Messages: Context-aware messages from the rabbit about current emotion

---

## 📊 Database Schema Changes

New columns added to habits table:
```sql
-- Time of day
time_of_day TEXT NOT NULL DEFAULT 'anytime'

-- Habit linking/stacking
linked_habit_id TEXT REFERENCES habits(id)

-- Energy requirements
energy_level TEXT NOT NULL DEFAULT 'medium'

-- Notifications
notifications_enabled INTEGER NOT NULL DEFAULT 0
notification_time TEXT -- HH:MM format
```

New column in rabbit_state table:
```sql
current_emotion TEXT NOT NULL DEFAULT 'happy'
```

---

## 🚀 How All Features Work Together

**The Flow:**

1. **You create habits** with time-of-day cues and energy levels
2. **You chain them** (X after Y) for better routine building
3. **You log moods** and do your thing
4. **The app analyzes** your energy and suggests matching habits
5. **Gentle reminders** help you stay on track (optional)
6. **Your rabbit** shows how you're really doing - emotionally and productivity-wise

**Example Day:**

```
Morning (Energetic mood):
- Smart Suggestions shows HIGH energy habits
- Rabbit is 💪 Energetic
- Suggests: Exercise → Cold shower → Breakfast

Afternoon (Tired mood):
- Smart Suggestions shows LOW energy habits
- Rabbit is 😴 Tired
- Suggests: Gentle stretching, tea, journal

Evening:
- Complete some habits, log your mood
- Rabbit notices your effort: 👑 Proud
```

---

## 🛠️ Technical Implementation

**Files Added/Modified:**

New files:
- `src/hooks/use-energy-awareness.ts` - Energy analysis hook
- `src/hooks/use-rabbit-emotions.ts` - Emotion determination
- `src/components/energy-aware-suggestions.tsx` - Suggestions UI
- `src/components/rabbit-emotion-display.tsx` - Emotion display
- `migrations/003_v1_1_habits_enhancements.sql` - Database schema

Modified files:
- `src/lib/types.ts` - New types for v1.1
- `src/lib/db.ts` - Updated CRUD operations
- `src/components/habit-form.tsx` - Extended form with new fields
- `src/routes/dashboard.tsx` - Added suggestions and emotion components

---

## 🎨 Design Philosophy

All v1.1 features follow Baajit's core principles:

✨ **Neurodivergent-friendly**: Recognizes that our bodies and minds work differently at different times
💚 **Non-judgmental**: Energy fluctuation is normal - meet yourself where you are
🌱 **Gentle**: Reminders are kind nudges, not alarms
🐰 **Personal**: Your rabbit grows with you and reflects your reality
🔒 **Private**: Everything stays on your device

---

## 🔮 Next Steps for v1.2

Potential future enhancements:
- Push notification integration (iOS/Android)
- Habit history with energy insights
- "Best time" analysis (learning your patterns over time)
- Habit difficulty adjustments based on energy
- Emotion-based motivational messages
- Habit performance analytics
- Social features (optional sharing with accountability partners)

---

Enjoy your Baajit v1.1 experience! Remember: we built this for neurodivergent minds, by someone who lives this every day. Be kind to yourself. 🐰💚
