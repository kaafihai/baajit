import Database from "@tauri-apps/plugin-sql";
import type {
  Task,
  TaskWithRelations,
  Category,
  Tag,
  Link,
  LinkInput,
  AppEvent,
  EventInput,
  EventQuery,
  MoodLevel,
  MoodEventData,
  // Legacy types for backward compatibility
  Mood,
} from "./types";

let db: Database | null = null;

// =============================================================================
// DATABASE INITIALIZATION
// =============================================================================

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  db = await Database.load("sqlite:tasks.db");

  // Create tasks table (v2 schema)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id            TEXT PRIMARY KEY,
      title         TEXT NOT NULL,
      description   TEXT NOT NULL DEFAULT '',
      completed     INTEGER NOT NULL DEFAULT 0,
      priority      TEXT NOT NULL DEFAULT 'medium',
      category_id   TEXT REFERENCES categories(id) ON DELETE SET NULL,
      created_at    TEXT NOT NULL,
      updated_at    TEXT NOT NULL,
      due_date      TEXT,
      archived_at   TEXT,
      task_type     TEXT NOT NULL DEFAULT 'task',
      recurrence_rule TEXT,
      metadata      TEXT
    );
  `);

  // Create indexes for tasks
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(task_type);
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category_id);
  `);

  // Create links table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS links (
      id          TEXT PRIMARY KEY,
      src         TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      dst         TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      type        TEXT NOT NULL,
      metadata    TEXT,
      created_at  TEXT NOT NULL,
      UNIQUE(src, dst, type)
    );
  `);

  // Create indexes for links
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_links_src_type ON links(src, type);
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_links_dst_type ON links(dst, type);
  `);

  // Create events table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id          TEXT PRIMARY KEY,
      timestamp   TEXT NOT NULL,
      entity_id   TEXT,
      event_type  TEXT NOT NULL,
      data        TEXT NOT NULL
    );
  `);

  // Create indexes for events
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_events_entity ON events(entity_id, timestamp);
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_events_type_time ON events(event_type, timestamp);
  `);

  // Create tags table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );
  `);

  // Create task_tags junction table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS task_tags (
      task_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (task_id, tag_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_task_tags_tag ON task_tags(tag_id);
  `);

  // Create categories table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#6b7280',
      created_at TEXT NOT NULL
    );
  `);

  // Legacy moods table (kept for migration, new code uses events)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS moods (
      id TEXT PRIMARY KEY,
      mood TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL
    );
  `);

  return db;
}

async function getDb(): Promise<Database> {
  if (!db) {
    return await initDatabase();
  }
  return db;
}

// =============================================================================
// TASK OPERATIONS
// =============================================================================

export async function getTasks(includeArchived = false): Promise<TaskWithRelations[]> {
  const database = await getDb();

  const archiveClause = includeArchived ? "" : "WHERE t.archived_at IS NULL";

  const tasks = await database.select<
    Array<{
      id: string;
      title: string;
      description: string;
      completed: number;
      priority: string;
      category_id: string | null;
      created_at: string;
      updated_at: string;
      due_date: string | null;
      archived_at: string | null;
      task_type: string;
      recurrence_rule: string | null;
      metadata: string | null;
      category_name: string | null;
      category_color: string | null;
    }>
  >(`
    SELECT
      t.id,
      t.title,
      t.description,
      t.completed,
      t.priority,
      t.category_id,
      t.created_at,
      t.updated_at,
      t.due_date,
      t.archived_at,
      t.task_type,
      t.recurrence_rule,
      t.metadata,
      c.name as category_name,
      c.color as category_color
    FROM tasks t
    LEFT JOIN categories c ON t.category_id = c.id
    ${archiveClause}
    ORDER BY t.created_at DESC
  `);

  const tasksWithTags: TaskWithRelations[] = [];

  for (const task of tasks) {
    const tags = await database.select<Array<{ name: string }>>(
      `SELECT tg.name FROM task_tags tt
       JOIN tags tg ON tt.tag_id = tg.id
       WHERE tt.task_id = $1`,
      [task.id],
    );

    tasksWithTags.push({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed === 1,
      priority: task.priority as "Low" | "Medium" | "High",
      category: task.category || undefined,
      tags: tags.map((t) => t.name),
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      dueDate: task.due_date || undefined,
      archivedAt: task.archived_at || undefined,
      taskType: task.task_type as Task["taskType"],
      recurrenceRule: task.recurrence_rule || undefined,
      metadata: task.metadata ? JSON.parse(task.metadata) : undefined,
      categoryName: task.category_name || undefined,
      categoryColor: task.category_color || undefined,
    });
  }

  return tasksWithTags;
}

export async function getTasksByType(
  taskType: Task["taskType"],
  includeArchived = false
): Promise<TaskWithRelations[]> {
  const allTasks = await getTasks(includeArchived);
  return allTasks.filter((t) => t.taskType === taskType);
}

export async function getTaskById(id: string): Promise<TaskWithRelations | null> {
  const tasks = await getTasks(true);
  return tasks.find((t) => t.id === id) || null;
}

export async function createTask(task: Task): Promise<Task> {
  const database = await getDb();

  await database.execute(
    `INSERT INTO tasks (id, title, description, completed, priority, category_id,
      created_at, updated_at, due_date, archived_at, task_type, recurrence_rule, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      task.id,
      task.title,
      task.description,
      task.completed ? 1 : 0,
      task.priority,
      task.categoryId || null,
      task.createdAt,
      task.updatedAt,
      task.dueDate || null,
      task.archivedAt || null,
      task.taskType,
      task.recurrenceRule || null,
      task.metadata ? JSON.stringify(task.metadata) : null,
    ],
  );

  // Insert task-tag associations
  for (const tagName of task.tags) {
    const tagId = await findOrCreateTag(tagName);
    await database.execute(
      `INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)`,
      [task.id, tagId],
    );
  }

  return task;
}

export async function updateTask(
  id: string,
  updates: Partial<Task>,
): Promise<Task> {
  const database = await getDb();

  const updateFields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    updateFields.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    updateFields.push(`description = $${paramIndex++}`);
    values.push(updates.description);
  }
  if (updates.completed !== undefined) {
    updateFields.push(`completed = $${paramIndex++}`);
    values.push(updates.completed ? 1 : 0);
  }
  if (updates.priority !== undefined) {
    updateFields.push(`priority = $${paramIndex++}`);
    values.push(updates.priority);
  }
  if (updates.categoryId !== undefined) {
    updateFields.push(`category_id = $${paramIndex++}`);
    values.push(updates.categoryId || null);
  }
  if (updates.dueDate !== undefined) {
    updateFields.push(`due_date = $${paramIndex++}`);
    values.push(updates.dueDate || null);
  }
  if (updates.archivedAt !== undefined) {
    updateFields.push(`archived_at = $${paramIndex++}`);
    values.push(updates.archivedAt || null);
  }
  if (updates.taskType !== undefined) {
    updateFields.push(`task_type = $${paramIndex++}`);
    values.push(updates.taskType);
  }
  if (updates.recurrenceRule !== undefined) {
    updateFields.push(`recurrence_rule = $${paramIndex++}`);
    values.push(updates.recurrenceRule || null);
  }
  if (updates.metadata !== undefined) {
    updateFields.push(`metadata = $${paramIndex++}`);
    values.push(updates.metadata ? JSON.stringify(updates.metadata) : null);
  }

  // Always update updated_at
  updateFields.push(`updated_at = $${paramIndex++}`);
  values.push(new Date().toISOString());

  values.push(id);

  if (updateFields.length > 0) {
    await database.execute(
      `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = $${paramIndex}`,
      values,
    );
  }

  // Handle tags update if provided
  if (updates.tags !== undefined) {
    await database.execute(`DELETE FROM task_tags WHERE task_id = $1`, [id]);
    for (const tagName of updates.tags) {
      const tagId = await findOrCreateTag(tagName);
      await database.execute(
        `INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)`,
        [id, tagId],
      );
    }
  }

  const updatedTask = await getTaskById(id);
  if (!updatedTask) {
    throw new Error("Task not found after update");
  }
  return updatedTask;
}

export async function archiveTask(id: string): Promise<void> {
  await updateTask(id, { archivedAt: new Date().toISOString() });

  // Log archive event
  await createEvent({
    entityId: id,
    eventType: "archived",
    data: { taskId: id },
  });
}

export async function unarchiveTask(id: string): Promise<void> {
  const database = await getDb();
  await database.execute(
    `UPDATE tasks SET archived_at = NULL, updated_at = $1 WHERE id = $2`,
    [new Date().toISOString(), id],
  );

  await createEvent({
    entityId: id,
    eventType: "unarchived",
    data: { taskId: id },
  });
}

export async function deleteTask(id: string): Promise<void> {
  const database = await getDb();

  // Delete task-tag associations
  await database.execute(`DELETE FROM task_tags WHERE task_id = $1`, [id]);

  // Links will cascade delete due to FK constraint

  // Delete task
  await database.execute(`DELETE FROM tasks WHERE id = $1`, [id]);
}

// =============================================================================
// LINK OPERATIONS
// =============================================================================

export async function createLink(link: LinkInput): Promise<Link> {
  const database = await getDb();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await database.execute(
    `INSERT INTO links (id, src, dst, type, metadata, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      id,
      link.src,
      link.dst,
      link.type,
      link.metadata ? JSON.stringify(link.metadata) : null,
      createdAt,
    ],
  );

  return {
    id,
    src: link.src,
    dst: link.dst,
    type: link.type,
    metadata: link.metadata,
    createdAt,
  };
}

export async function getLinksFrom(
  taskId: string,
  type?: Link["type"]
): Promise<Link[]> {
  const database = await getDb();

  const typeClause = type ? "AND type = $2" : "";
  const params = type ? [taskId, type] : [taskId];

  const links = await database.select<
    Array<{
      id: string;
      src: string;
      dst: string;
      type: string;
      metadata: string | null;
      created_at: string;
    }>
  >(`SELECT * FROM links WHERE src = $1 ${typeClause}`, params);

  return links.map((l) => ({
    id: l.id,
    src: l.src,
    dst: l.dst,
    type: l.type as Link["type"],
    metadata: l.metadata ? JSON.parse(l.metadata) : undefined,
    createdAt: l.created_at,
  }));
}

export async function getLinksTo(
  taskId: string,
  type?: Link["type"]
): Promise<Link[]> {
  const database = await getDb();

  const typeClause = type ? "AND type = $2" : "";
  const params = type ? [taskId, type] : [taskId];

  const links = await database.select<
    Array<{
      id: string;
      src: string;
      dst: string;
      type: string;
      metadata: string | null;
      created_at: string;
    }>
  >(`SELECT * FROM links WHERE dst = $1 ${typeClause}`, params);

  return links.map((l) => ({
    id: l.id,
    src: l.src,
    dst: l.dst,
    type: l.type as Link["type"],
    metadata: l.metadata ? JSON.parse(l.metadata) : undefined,
    createdAt: l.created_at,
  }));
}

export async function deleteLink(id: string): Promise<void> {
  const database = await getDb();
  await database.execute(`DELETE FROM links WHERE id = $1`, [id]);
}

export async function deleteLinkBetween(
  src: string,
  dst: string,
  type: Link["type"]
): Promise<void> {
  const database = await getDb();
  await database.execute(
    `DELETE FROM links WHERE src = $1 AND dst = $2 AND type = $3`,
    [src, dst, type],
  );
}

// Get subtasks of a project/task
export async function getSubtasks(taskId: string): Promise<TaskWithRelations[]> {
  const links = await getLinksFrom(taskId, "subtask");
  const subtaskIds = links.map((l) => l.dst);

  const allTasks = await getTasks();
  return allTasks.filter((t) => subtaskIds.includes(t.id));
}

// Get tasks that block this task
export async function getBlockers(taskId: string): Promise<TaskWithRelations[]> {
  const links = await getLinksTo(taskId, "blocks");
  const blockerIds = links.map((l) => l.src);

  const allTasks = await getTasks();
  return allTasks.filter((t) => blockerIds.includes(t.id));
}

// Get habit chain from root
export async function getHabitChain(rootId: string): Promise<TaskWithRelations[]> {
  const chain: TaskWithRelations[] = [];
  let currentId: string | null = rootId;

  while (currentId) {
    const task = await getTaskById(currentId);
    if (!task) break;
    chain.push(task);

    const nextLinks = await getLinksFrom(currentId, "continues");
    currentId = nextLinks.length > 0 ? nextLinks[0].dst : null;
  }

  return chain;
}

// =============================================================================
// EVENT OPERATIONS
// =============================================================================

export async function createEvent(event: EventInput): Promise<AppEvent> {
  const database = await getDb();
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  await database.execute(
    `INSERT INTO events (id, timestamp, entity_id, event_type, data)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      id,
      timestamp,
      event.entityId || null,
      event.eventType,
      JSON.stringify(event.data),
    ],
  );

  return {
    id,
    timestamp,
    entityId: event.entityId,
    eventType: event.eventType,
    data: event.data,
  };
}

export async function getEvents(query: EventQuery = {}): Promise<AppEvent[]> {
  const database = await getDb();

  const clauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (query.entityId) {
    clauses.push(`entity_id = $${paramIndex++}`);
    params.push(query.entityId);
  }
  if (query.eventType) {
    clauses.push(`event_type = $${paramIndex++}`);
    params.push(query.eventType);
  }
  if (query.after) {
    clauses.push(`timestamp > $${paramIndex++}`);
    params.push(query.after);
  }
  if (query.before) {
    clauses.push(`timestamp < $${paramIndex++}`);
    params.push(query.before);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const limitClause = query.limit ? `LIMIT ${query.limit}` : "";

  const events = await database.select<
    Array<{
      id: string;
      timestamp: string;
      entity_id: string | null;
      event_type: string;
      data: string;
    }>
  >(
    `SELECT * FROM events ${whereClause} ORDER BY timestamp DESC ${limitClause}`,
    params,
  );

  return events.map((e) => ({
    id: e.id,
    timestamp: e.timestamp,
    entityId: e.entity_id || undefined,
    eventType: e.event_type as AppEvent["eventType"],
    data: JSON.parse(e.data),
  }));
}

// =============================================================================
// MOOD OPERATIONS (via events)
// =============================================================================

export async function createMoodEvent(
  mood: MoodLevel,
  note?: string
): Promise<AppEvent> {
  const data: MoodEventData = { mood, note };
  return createEvent({
    eventType: "mood",
    data,
  });
}

export async function getMoodHistory(limit = 30): Promise<Array<{
  id: string;
  timestamp: string;
  mood: MoodLevel;
  note?: string;
}>> {
  const events = await getEvents({ eventType: "mood", limit });
  return events.map((e) => ({
    id: e.id,
    timestamp: e.timestamp,
    mood: (e.data as MoodEventData).mood,
    note: (e.data as MoodEventData).note,
  }));
}

export async function getTodaysMoodEvent(): Promise<{
  id: string;
  timestamp: string;
  mood: MoodLevel;
  note?: string;
} | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const events = await getEvents({
    eventType: "mood",
    after: todayIso,
    limit: 1,
  });

  if (events.length === 0) return null;

  const e = events[0];
  return {
    id: e.id,
    timestamp: e.timestamp,
    mood: (e.data as MoodEventData).mood,
    note: (e.data as MoodEventData).note,
  };
}

// =============================================================================
// LEGACY MOOD OPERATIONS (backward compatibility)
// =============================================================================

/** @deprecated Use createMoodEvent instead */
export async function createMood(mood: Mood): Promise<Mood> {
  await createMoodEvent(mood.mood, mood.note);
  return mood;
}

/** @deprecated Use getTodaysMoodEvent instead */
export async function getTodaysMood(): Promise<Mood | null> {
  const event = await getTodaysMoodEvent();
  if (!event) return null;
  return {
    id: event.id,
    mood: event.mood,
    note: event.note,
    createdAt: event.timestamp,
  };
}

/** @deprecated Use getMoodHistory instead */
export async function getMoods(limit = 30): Promise<Mood[]> {
  const history = await getMoodHistory(limit);
  return history.map((h) => ({
    id: h.id,
    mood: h.mood,
    note: h.note,
    createdAt: h.timestamp,
  }));
}

/** @deprecated Use getEvents with date filter instead */
export async function getMoodByDate(date: Date): Promise<Mood | null> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const events = await getEvents({
    eventType: "mood",
    after: dayStart.toISOString(),
    before: dayEnd.toISOString(),
    limit: 1,
  });

  if (events.length === 0) return null;

  const e = events[0];
  return {
    id: e.id,
    mood: (e.data as MoodEventData).mood,
    note: (e.data as MoodEventData).note,
    createdAt: e.timestamp,
  };
}

// =============================================================================
// CATEGORY OPERATIONS
// =============================================================================

export async function getCategories(): Promise<Category[]> {
  const database = await getDb();

  const categories = await database.select<
    Array<{
      id: string;
      name: string;
      color: string;
      created_at: string;
    }>
  >("SELECT * FROM categories ORDER BY name ASC");

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
    createdAt: c.created_at,
  }));
}

export async function createCategory(category: Category): Promise<Category> {
  const database = await getDb();

  await database.execute(
    `INSERT INTO categories (id, name, color, created_at) VALUES ($1, $2, $3, $4)`,
    [category.id, category.name, category.color, category.createdAt],
  );

  return category;
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>,
): Promise<Category> {
  const database = await getDb();

  const updateFields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    updateFields.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }
  if (updates.color !== undefined) {
    updateFields.push(`color = $${paramIndex++}`);
    values.push(updates.color);
  }

  values.push(id);

  if (updateFields.length > 0) {
    await database.execute(
      `UPDATE categories SET ${updateFields.join(", ")} WHERE id = $${paramIndex}`,
      values,
    );
  }

  const categories = await getCategories();
  const updatedCategory = categories.find((c) => c.id === id);
  if (!updatedCategory) {
    throw new Error("Category not found after update");
  }
  return updatedCategory;
}

export async function deleteCategory(id: string): Promise<void> {
  const database = await getDb();

  // Set category_id to NULL for all tasks using this category
  await database.execute(
    `UPDATE tasks SET category_id = NULL WHERE category_id = $1`,
    [id],
  );

  await database.execute(`DELETE FROM categories WHERE id = $1`, [id]);
}

// =============================================================================
// TAG OPERATIONS
// =============================================================================

export async function getTags(): Promise<Tag[]> {
  const database = await getDb();

  const tags = await database.select<
    Array<{
      id: string;
      name: string;
      created_at: string;
    }>
  >("SELECT * FROM tags ORDER BY name ASC");

  return tags.map((t) => ({
    id: t.id,
    name: t.name,
    createdAt: t.created_at,
  }));
}

export async function createTag(tag: Tag): Promise<Tag> {
  const database = await getDb();

  try {
    await database.execute(
      `INSERT INTO tags (id, name, created_at) VALUES ($1, $2, $3)`,
      [tag.id, tag.name, tag.createdAt],
    );
  } catch {
    // Tag might already exist due to UNIQUE constraint
    console.log("Tag already exists:", tag.name);
  }

  return tag;
}

export async function deleteTag(id: string): Promise<void> {
  const database = await getDb();

  await database.execute(`DELETE FROM task_tags WHERE tag_id = $1`, [id]);
  await database.execute(`DELETE FROM tags WHERE id = $1`, [id]);
}

async function findOrCreateTag(tagName: string): Promise<string> {
  const database = await getDb();

  const existing = await database.select<Array<{ id: string }>>(
    `SELECT id FROM tags WHERE name = $1`,
    [tagName],
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const tagId = crypto.randomUUID();
  const tag: Tag = {
    id: tagId,
    name: tagName,
    createdAt: new Date().toISOString(),
  };
  await createTag(tag);

  return tagId;
}

// =============================================================================
// UTILITY QUERIES
// =============================================================================

export async function getTasksByDate(date: Date): Promise<TaskWithRelations[]> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const allTasks = await getTasks();
  return allTasks.filter((t) => {
    const createdAt = new Date(t.createdAt);
    const dueDate = t.dueDate ? new Date(t.dueDate) : null;

    const createdOnDate = createdAt >= dayStart && createdAt <= dayEnd;
    const dueOnDate = dueDate && dueDate >= dayStart && dueDate <= dayEnd;

    return createdOnDate || dueOnDate;
  });
}

// Get all projects
export async function getProjects(): Promise<TaskWithRelations[]> {
  return getTasksByType("project_root");
}

// Get all habits
export async function getHabits(): Promise<TaskWithRelations[]> {
  return getTasksByType("habit_root");
}

// Get all flows
export async function getFlows(): Promise<TaskWithRelations[]> {
  return getTasksByType("flow_root");
}
