-- =============================================================================
-- Rabbit State - Phase 1: Evolving Companion
-- =============================================================================
-- Stores the rabbit's progression level, unlocked outfits, and personality memory
-- =============================================================================

-- -----------------------------------------------------------------------------
-- RABBIT_STATE - Single row table for rabbit progression
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rabbit_state (
  id              TEXT PRIMARY KEY DEFAULT 'singleton',
  level           INTEGER NOT NULL DEFAULT 1,        -- 1=baby, 2=young, 3=teen, 4=adult, 5=elder
  xp              INTEGER NOT NULL DEFAULT 0,        -- Experience points (earned from activity)
  current_outfit  TEXT NOT NULL DEFAULT 'none',       -- Currently equipped outfit ID
  created_at      TEXT NOT NULL,                      -- ISO8601 format
  updated_at      TEXT NOT NULL                       -- ISO8601 format
);

-- -----------------------------------------------------------------------------
-- RABBIT_OUTFITS - Unlocked outfits/accessories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rabbit_outfits (
  id              TEXT PRIMARY KEY,                   -- Outfit identifier (e.g., 'scarf_red', 'hat_party')
  unlocked_at     TEXT NOT NULL,                      -- ISO8601 format
  unlock_reason   TEXT NOT NULL DEFAULT ''             -- Description of how it was earned
);

-- -----------------------------------------------------------------------------
-- RABBIT_MEMORY - Pattern observations for personality
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rabbit_memory (
  id              TEXT PRIMARY KEY,
  memory_type     TEXT NOT NULL CHECK(memory_type IN ('day_pattern', 'streak_record', 'mood_pattern', 'milestone', 'fun_fact')),
  memory_key      TEXT NOT NULL,                      -- e.g., 'best_day=monday', 'longest_streak=14'
  memory_value    TEXT NOT NULL DEFAULT '',            -- Additional context
  created_at      TEXT NOT NULL,                      -- ISO8601 format
  updated_at      TEXT NOT NULL                       -- ISO8601 format
);

CREATE INDEX IF NOT EXISTS idx_rabbit_memory_type ON rabbit_memory(memory_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rabbit_memory_key ON rabbit_memory(memory_type, memory_key);
