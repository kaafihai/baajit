-- =============================================================================
-- V1.1 Habits Enhancement Migration
-- =============================================================================
-- Adds support for:
-- - Time-of-day cues (morning, afternoon, evening, anytime)
-- - Habit stacking / linking
-- - Energy level requirements
-- - Gentle notifications
-- - Rabbit emotions
-- Idempotent: safe to run multiple times
-- =============================================================================

-- Add v1.1 columns to habits table
ALTER TABLE habits ADD COLUMN IF NOT EXISTS time_of_day TEXT NOT NULL DEFAULT 'anytime' CHECK(time_of_day IN ('morning', 'afternoon', 'evening', 'anytime'));
ALTER TABLE habits ADD COLUMN IF NOT EXISTS linked_habit_id TEXT REFERENCES habits(id) ON DELETE SET NULL;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS energy_level TEXT NOT NULL DEFAULT 'medium' CHECK(energy_level IN ('low', 'medium', 'high'));
ALTER TABLE habits ADD COLUMN IF NOT EXISTS notifications_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS notification_time TEXT; -- HH:MM format, e.g., "09:00"

-- Add emotion column to rabbit_state table (will be created in 002 if not exists)
ALTER TABLE rabbit_state ADD COLUMN IF NOT EXISTS current_emotion TEXT NOT NULL DEFAULT 'happy' CHECK(current_emotion IN ('happy', 'energetic', 'calm', 'tired', 'focused', 'confused', 'proud'));

-- Create index for linked_habit_id for efficient lookups
CREATE INDEX IF NOT EXISTS idx_habits_linked_habit ON habits(linked_habit_id);
CREATE INDEX IF NOT EXISTS idx_habits_time_of_day ON habits(time_of_day);
CREATE INDEX IF NOT EXISTS idx_habits_energy_level ON habits(energy_level);
