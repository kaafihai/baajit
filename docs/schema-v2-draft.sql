-- =============================================================================
-- NIBBLE SCHEMA v2 - Data Model Redesign
-- =============================================================================
--
-- Design Goals:
-- - Support task relationships (projects, subtasks, dependencies)
-- - Support habits as linked-list chains with recurrence rules
-- - Support flows (dopamine staircasing, etc.) as completion-triggered sequences
-- - Unified event log for mood tracking, flow state, and audit trail
-- - Soft delete (archival) as default, hard delete cascades links
--
-- Key Concepts:
-- - task_type discriminates: 'task', 'project_root', 'habit_root', 'flow_root'
-- - Links table is an edge table (triple store pattern: src-type-dst)
-- - Events table is append-only for state tracking
-- - Habits use 'continues' links (linked list, not hierarchy)
-- - Flows use 'sequence_next' links
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- TASKS
-- -----------------------------------------------------------------------------
-- Core entity. Projects, habits, flows are all tasks with different task_type.
-- -----------------------------------------------------------------------------
CREATE TABLE tasks (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  completed     INTEGER NOT NULL DEFAULT 0,  -- boolean
  priority      TEXT NOT NULL DEFAULT 'medium',  -- 'low', 'medium', 'high'
  category_id   TEXT REFERENCES categories(id) ON DELETE SET NULL,

  created_at    TEXT NOT NULL,  -- ISO8601
  updated_at    TEXT NOT NULL,
  due_date      TEXT,
  archived_at   TEXT,           -- soft delete timestamp, NULL = active

  -- Type discriminator
  task_type     TEXT NOT NULL DEFAULT 'task',
                -- 'task'         : regular task
                -- 'project_root' : project container
                -- 'habit_root'   : origin of recurring chain
                -- 'flow_root'    : origin of flow/staircase

  -- Recurrence (nullable, primarily for habit_root but any task can recur)
  recurrence_rule TEXT,  -- e.g., 'weekly:fri', 'daily', or RRULE string

  -- Type-specific data
  metadata      TEXT  -- JSON blob
);

CREATE INDEX idx_tasks_type ON tasks(task_type) WHERE archived_at IS NULL;
CREATE INDEX idx_tasks_due ON tasks(due_date) WHERE archived_at IS NULL;
CREATE INDEX idx_tasks_category ON tasks(category_id);

-- -----------------------------------------------------------------------------
-- LINKS
-- -----------------------------------------------------------------------------
-- Edge table for task relationships. Directional: src → dst
-- -----------------------------------------------------------------------------
CREATE TABLE links (
  id          TEXT PRIMARY KEY,
  src         TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dst         TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
              -- 'subtask'       : dst is subtask of src (projects, task breakdown)
              -- 'continues'     : dst continues src (habit chain)
              -- 'sequence_next' : dst is next step after src (flows)
              -- 'blocks'        : src blocks dst (dependencies)
              -- 'based_on'      : dst was cloned/derived from src

  metadata    TEXT,       -- JSON for link-specific data
  created_at  TEXT NOT NULL,

  UNIQUE(src, dst, type)  -- prevent duplicate links of same type
);

CREATE INDEX idx_links_src_type ON links(src, type);
CREATE INDEX idx_links_dst_type ON links(dst, type);

-- -----------------------------------------------------------------------------
-- EVENTS
-- -----------------------------------------------------------------------------
-- Append-only log for state changes, mood tracking, flow progress, etc.
-- -----------------------------------------------------------------------------
CREATE TABLE events (
  id          TEXT PRIMARY KEY,
  timestamp   TEXT NOT NULL,  -- ISO8601
  entity_id   TEXT,           -- task/flow this relates to (NULL for global events)
  event_type  TEXT NOT NULL,
              -- 'mood'           : mood check-in
              -- 'flow_step'      : user advanced in a flow
              -- 'task_completed' : task completion record
              -- 'habit_spawned'  : new habit instance materialized
              -- 'archived'       : entity was archived
              -- etc.

  data        TEXT NOT NULL   -- JSON payload
);

CREATE INDEX idx_events_entity ON events(entity_id, timestamp);
CREATE INDEX idx_events_type_time ON events(event_type, timestamp);

-- -----------------------------------------------------------------------------
-- CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  color       TEXT NOT NULL DEFAULT '#6b7280',
  created_at  TEXT NOT NULL
);

-- -----------------------------------------------------------------------------
-- TAGS
-- -----------------------------------------------------------------------------
CREATE TABLE tags (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL
);

-- -----------------------------------------------------------------------------
-- TASK_TAGS (junction)
-- -----------------------------------------------------------------------------
CREATE TABLE task_tags (
  task_id     TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id      TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

CREATE INDEX idx_task_tags_tag ON task_tags(tag_id);


-- =============================================================================
-- EXAMPLE QUERIES
-- =============================================================================

-- List all projects
-- SELECT * FROM tasks WHERE task_type = 'project_root' AND archived_at IS NULL;

-- List all habits
-- SELECT * FROM tasks WHERE task_type = 'habit_root' AND archived_at IS NULL;

-- Get subtasks of a project
-- SELECT t.* FROM tasks t
-- JOIN links l ON t.id = l.dst
-- WHERE l.src = $project_id AND l.type = 'subtask' AND t.archived_at IS NULL;

-- Get habit chain (all instances) using recursive CTE
-- WITH RECURSIVE chain AS (
--   SELECT id, title, due_date, 0 as depth FROM tasks WHERE id = $habit_root_id
--   UNION ALL
--   SELECT t.id, t.title, t.due_date, c.depth + 1
--   FROM tasks t
--   JOIN links l ON t.id = l.dst
--   JOIN chain c ON l.src = c.id
--   WHERE l.type = 'continues'
-- )
-- SELECT * FROM chain ORDER BY depth;

-- Get current flow position (latest event)
-- SELECT data FROM events
-- WHERE entity_id = $flow_id AND event_type = 'flow_step'
-- ORDER BY timestamp DESC LIMIT 1;

-- Mood history (last 30 days)
-- SELECT * FROM events
-- WHERE event_type = 'mood'
-- ORDER BY timestamp DESC LIMIT 30;

-- What blocks this task?
-- SELECT t.* FROM tasks t
-- JOIN links l ON t.id = l.src
-- WHERE l.dst = $task_id AND l.type = 'blocks' AND t.archived_at IS NULL;


-- =============================================================================
-- MIGRATION NOTES (from v1)
-- =============================================================================
--
-- 1. tasks table:
--    - ADD: archived_at, task_type, recurrence_rule, metadata columns
--    - RENAME: category -> category_id (now a proper FK)
--    - Existing tasks get task_type='task', archived_at=NULL
--
-- 2. moods table:
--    - MIGRATE to events table with event_type='mood'
--    - data JSON: { "mood": "great"|"good"|"okay"|"bad"|"terrible", "note": "..." }
--    - DROP moods table after migration
--
-- 3. NEW: links table
--
-- 4. NEW: events table
--
-- 5. categories table: unchanged
--
-- 6. tags table: unchanged
--
-- 7. task_tags table: unchanged
--
