-- =============================================================================
-- NIBBLE SCHEMA v1 (BACKUP)
-- Original schema from src/lib/db.ts before data model redesign
-- =============================================================================

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  completed INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  due_date TEXT
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

-- Task-tags junction table
CREATE TABLE IF NOT EXISTS task_tags (
  task_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (task_id, tag_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6b7280',
  created_at TEXT NOT NULL
);

-- Moods table
CREATE TABLE IF NOT EXISTS moods (
  id TEXT PRIMARY KEY,
  mood TEXT NOT NULL,  -- 'great', 'good', 'okay', 'bad', 'terrible'
  note TEXT,
  created_at TEXT NOT NULL
);
