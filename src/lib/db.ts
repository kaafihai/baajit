import Database from "@tauri-apps/plugin-sql";
import { appDataDir, join, resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import type { Task, Mood, Habit, HabitEntry, RabbitState, RabbitOutfit, RabbitMemory, RabbitLevel, RabbitMemoryType } from "./types";

let db: Database | null = null;

// =============================================================================
// DATABASE INITIALIZATION
// =============================================================================

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const appDataDirPath = await appDataDir();
  const dbPath = await join(appDataDirPath, "tasks.db");
  db = await Database.load(`sqlite:${dbPath}`);

  // Load and run migrations
  const migrations = [
    "migrations/001_initial.sql",
    "migrations/002_rabbit_state.sql",
    "migrations/003_v1_1_habits_enhancements.sql",
  ];

  for (const migration of migrations) {
    try {
      const migrationPath = await resolveResource(migration);
      const migrationSql = await readTextFile(migrationPath);
      await db.execute(migrationSql);
    } catch (error) {
      console.warn(`Migration ${migration} failed or not found:`, error);
      // Continue with next migration instead of failing
    }
  }

  // Ensure v1.1 columns exist (fallback for development)
  try {
    console.log("Checking and adding v1.1 columns if needed...");

    // For habits table - simple ALTER without constraints
    await db.execute(`ALTER TABLE habits ADD COLUMN time_of_day TEXT`).catch(() => null);
    await db.execute(`ALTER TABLE habits ADD COLUMN linked_habit_id TEXT`).catch(() => null);
    await db.execute(`ALTER TABLE habits ADD COLUMN energy_level TEXT`).catch(() => null);
    await db.execute(`ALTER TABLE habits ADD COLUMN notifications_enabled INTEGER`).catch(() => null);
    await db.execute(`ALTER TABLE habits ADD COLUMN notification_time TEXT`).catch(() => null);

    // For rabbit_state table
    await db.execute(`ALTER TABLE rabbit_state ADD COLUMN current_emotion TEXT`).catch(() => null);

    console.log("V1.1 columns ensured");
  } catch (error) {
    console.warn("Error during v1.1 column setup:", error);
  }

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

export async function getTasks(limit: number = 1000): Promise<Task[]> {
  const database = await getDb();

  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      description: string;
      due_date: string | null;
      created_at: string;
      updated_at: string;
      completed_at: string | null;
      archived_at: string | null;
    }>
  >(`SELECT * FROM tasks ORDER BY completed_at IS NOT NULL, created_at DESC LIMIT $1`, [limit]);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
  }));
}

export async function getTasksByDueDate(date: Date, limit: number = 1000): Promise<Task[]> {
  const database = await getDb();

  // Calculate local day boundaries to handle timezone correctly
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      description: string;
      due_date: string | null;
      created_at: string;
      updated_at: string;
      completed_at: string | null;
      archived_at: string | null;
    }>
  >(`SELECT * FROM tasks WHERE due_date >= $1 AND due_date < $2 LIMIT $3`, [startOfDay.toISOString(), endOfDay.toISOString(), limit]);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
  }));
}

export async function getTasksByCompletedAt(date: Date, limit: number = 1000): Promise<Task[]> {
  const database = await getDb();

  // Calculate local day boundaries in UTC to handle timezone correctly
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      description: string;
      due_date: string | null;
      created_at: string;
      updated_at: string;
      completed_at: string | null;
      archived_at: string | null;
    }>
  >(`SELECT * FROM tasks WHERE completed_at >= $1 AND completed_at < $2 LIMIT $3`, [startOfDay.toISOString(), endOfDay.toISOString(), limit]);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
  }));
}

export async function getTasksByArchivedAt(date: Date, limit: number = 1000): Promise<Task[]> {
  const database = await getDb();

  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      description: string;
      due_date: string | null;
      created_at: string;
      updated_at: string;
      completed_at: string | null;
      archived_at: string | null;
    }>
  >(`SELECT * FROM tasks WHERE archived_at >= $1 AND archived_at < $2 LIMIT $3`, [startOfDay.toISOString(), endOfDay.toISOString(), limit]);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
  }));
}

export async function getTaskById(id: string): Promise<Task | null> {
  const database = await getDb();

  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      description: string;
      due_date: string | null;
      created_at: string;
      updated_at: string;
      completed_at: string | null;
      archived_at: string | null;
    }>
  >(`SELECT * FROM tasks WHERE id = $1`, [id]);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
  };
}

export async function createTask(task: Task): Promise<Task> {
  const database = await getDb();

  await database.execute(
    `INSERT INTO tasks (id, title, description, due_date, created_at, updated_at, completed_at, archived_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [task.id, task.title, task.description, task.dueDate, task.createdAt, task.updatedAt, task.completedAt, task.archivedAt]
  );

  return task;
}

export async function updateTask(task: Task): Promise<Task> {
  const database = await getDb();

  const now = new Date().toISOString();

  await database.execute(
    `UPDATE tasks SET title = $1, description = $2, due_date = $3, completed_at = $4, archived_at = $5, updated_at = $6 WHERE id = $7`,
    [task.title, task.description, task.dueDate, task.completedAt, task.archivedAt, now, task.id]
  );

  const updatedTask = await getTaskById(task.id);
  if (!updatedTask) {
    throw new Error(`Task with id ${task.id} not found`);
  }

  return updatedTask;
}

export async function deleteTask(task: Task): Promise<Task> {
  const database = await getDb();

  await database.execute(`DELETE FROM tasks WHERE id = $1`, [task.id]);

  return task;
}

// =============================================================================
// MOOD OPERATIONS
// =============================================================================

export async function getMoods(limit: number = 1000): Promise<Mood[]> {
  const database = await getDb();
  const rows = await database.select<
    Array<{
      id: string;
      mood: string;
      note: string;
      created_at: string;
    }>
  >(`SELECT * FROM moods LIMIT $1`, [limit]);

  return rows.map((row) => ({
    id: row.id,
    mood: row.mood as Mood["mood"],
    note: row.note,
    createdAt: row.created_at,
  }));
}

export async function getMoodById(id: string): Promise<Mood | null> {
  const database = await getDb();

  const rows = await database.select<
    Array<{
      id: string;
      mood: string;
      note: string;
      created_at: string;
    }>
  >(`SELECT * FROM moods WHERE id = $1`, [id]);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    mood: row.mood as Mood["mood"],
    note: row.note,
    createdAt: row.created_at,
  };
}

export async function getMoodByDate(date: Date): Promise<Mood | null> {
  const database = await getDb();

  // Calculate local day boundaries in UTC to handle timezone correctly
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const rows = await database.select<
    Array<{
      id: string;
      mood: string;
      note: string;
      created_at: string;
    }>
  >(`SELECT * FROM moods WHERE created_at >= $1 AND created_at < $2`, [startOfDay.toISOString(), endOfDay.toISOString()]);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    mood: row.mood as Mood["mood"],
    note: row.note,
    createdAt: row.created_at,
  };
}

export async function createMood(mood: Mood): Promise<Mood> {
  const database = await getDb();

  await database.execute(
    `INSERT INTO moods (id, mood, note, created_at)
     VALUES ($1, $2, $3, $4)`,
    [mood.id, mood.mood, mood.note, mood.createdAt]
  );

  return mood;
}

export async function updateMood(mood: Mood): Promise<Mood> {
  const database = await getDb();

  await database.execute(
    `UPDATE moods SET mood = $1, note = $2 WHERE id = $3`,
    [mood.mood, mood.note, mood.id]
  );

  const updatedMood = await getMoodById(mood.id);
  if (!updatedMood) {
    throw new Error(`Mood with id ${mood.id} not found`);
  }

  return updatedMood;
}

export async function deleteMood(mood: Mood): Promise<Mood> {
  const database = await getDb();

  await database.execute(`DELETE FROM moods WHERE id = $1`, [mood.id]);

  return mood;
}

// =============================================================================
// HABIT OPERATIONS
// =============================================================================

export async function getHabits(includeArchived: boolean = false): Promise<Habit[]> {
  const database = await getDb();

  const query = includeArchived
    ? `SELECT id, title, description, rrule, COALESCE(time_of_day, 'anytime') as time_of_day, linked_habit_id, COALESCE(energy_level, 'medium') as energy_level, COALESCE(notifications_enabled, 0) as notifications_enabled, notification_time, created_at, updated_at, archived_at, paused_at, cancelled_at FROM habits ORDER BY created_at DESC`
    : `SELECT id, title, description, rrule, COALESCE(time_of_day, 'anytime') as time_of_day, linked_habit_id, COALESCE(energy_level, 'medium') as energy_level, COALESCE(notifications_enabled, 0) as notifications_enabled, notification_time, created_at, updated_at, archived_at, paused_at, cancelled_at FROM habits WHERE archived_at IS NULL ORDER BY created_at DESC`;

  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      description: string;
      rrule: string;
      time_of_day: string;
      linked_habit_id: string | null;
      energy_level: string;
      notifications_enabled: number;
      notification_time: string | null;
      created_at: string;
      updated_at: string;
      archived_at: string | null;
      paused_at: string | null;
      cancelled_at: string | null;
    }>
  >(query);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    rrule: row.rrule,
    timeOfDay: (row.time_of_day as any) || 'anytime',
    linkedHabitId: row.linked_habit_id,
    energyLevel: (row.energy_level as any) || 'medium',
    notificationsEnabled: Boolean(row.notifications_enabled),
    notificationTime: row.notification_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
    pausedAt: row.paused_at,
    cancelledAt: row.cancelled_at,
  }));
}

export async function getHabitById(id: string): Promise<Habit | null> {
  const database = await getDb();

  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      description: string;
      rrule: string;
      time_of_day: string;
      linked_habit_id: string | null;
      energy_level: string;
      notifications_enabled: number;
      notification_time: string | null;
      created_at: string;
      updated_at: string;
      archived_at: string | null;
      paused_at: string | null;
      cancelled_at: string | null;
    }>
  >(`SELECT id, title, description, rrule, COALESCE(time_of_day, 'anytime') as time_of_day, linked_habit_id, COALESCE(energy_level, 'medium') as energy_level, COALESCE(notifications_enabled, 0) as notifications_enabled, notification_time, created_at, updated_at, archived_at, paused_at, cancelled_at FROM habits WHERE id = $1`, [id]);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    rrule: row.rrule,
    timeOfDay: (row.time_of_day as any) || 'anytime',
    linkedHabitId: row.linked_habit_id,
    energyLevel: (row.energy_level as any) || 'medium',
    notificationsEnabled: Boolean(row.notifications_enabled),
    notificationTime: row.notification_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
    pausedAt: row.paused_at,
    cancelledAt: row.cancelled_at,
  };
}

export async function createHabit(habit: Habit): Promise<Habit> {
  const database = await getDb();

  try {
    // Try with all v1.1 columns first
    await database.execute(
      `INSERT INTO habits (id, title, description, rrule, time_of_day, linked_habit_id, energy_level, notifications_enabled, notification_time, created_at, updated_at, archived_at, paused_at, cancelled_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        habit.id,
        habit.title,
        habit.description,
        habit.rrule,
        habit.timeOfDay,
        habit.linkedHabitId,
        habit.energyLevel,
        habit.notificationsEnabled ? 1 : 0,
        habit.notificationTime,
        habit.createdAt,
        habit.updatedAt,
        habit.archivedAt,
        habit.pausedAt,
        habit.cancelledAt,
      ]
    );
  } catch (error) {
    // Fallback for old schema without v1.1 columns
    console.warn("Failed to insert with v1.1 columns, trying without:", error);
    await database.execute(
      `INSERT INTO habits (id, title, description, rrule, created_at, updated_at, archived_at, paused_at, cancelled_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        habit.id,
        habit.title,
        habit.description,
        habit.rrule,
        habit.createdAt,
        habit.updatedAt,
        habit.archivedAt,
        habit.pausedAt,
        habit.cancelledAt,
      ]
    );
  }

  return habit;
}

export async function updateHabit(habit: Habit): Promise<Habit> {
  const database = await getDb();

  const now = new Date().toISOString();

  try {
    // Try with all v1.1 columns first
    await database.execute(
      `UPDATE habits SET title = $1, description = $2, rrule = $3, time_of_day = $4, linked_habit_id = $5, energy_level = $6, notifications_enabled = $7, notification_time = $8, archived_at = $9, paused_at = $10, cancelled_at = $11, updated_at = $12 WHERE id = $13`,
      [
        habit.title,
        habit.description,
        habit.rrule,
        habit.timeOfDay,
        habit.linkedHabitId,
        habit.energyLevel,
        habit.notificationsEnabled ? 1 : 0,
        habit.notificationTime,
        habit.archivedAt,
        habit.pausedAt,
        habit.cancelledAt,
        now,
        habit.id,
      ]
    );
  } catch (error) {
    // Fallback for old schema without v1.1 columns
    console.warn("Failed to update with v1.1 columns, trying without:", error);
    await database.execute(
      `UPDATE habits SET title = $1, description = $2, rrule = $3, archived_at = $4, paused_at = $5, cancelled_at = $6, updated_at = $7 WHERE id = $8`,
      [
        habit.title,
        habit.description,
        habit.rrule,
        habit.archivedAt,
        habit.pausedAt,
        habit.cancelledAt,
        now,
        habit.id,
      ]
    );
  }

  const updatedHabit = await getHabitById(habit.id);
  if (!updatedHabit) {
    throw new Error(`Habit with id ${habit.id} not found`);
  }

  return updatedHabit;
}

export async function deleteHabit(habit: Habit): Promise<Habit> {
  const database = await getDb();

  await database.execute(`DELETE FROM habits WHERE id = $1`, [habit.id]);

  return habit;
}

// =============================================================================
// HABIT ENTRY OPERATIONS
// =============================================================================

export async function getHabitEntries(habitId: string): Promise<HabitEntry[]> {
  const database = await getDb();

  const rows = await database.select<
    Array<{
      id: string;
      habit_id: string;
      date: string;
      status: string;
      note: string;
      created_at: string;
    }>
  >(`SELECT * FROM habit_entries WHERE habit_id = $1 ORDER BY date DESC`, [habitId]);

  return rows.map((row) => ({
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
    status: row.status as HabitEntry["status"],
    note: row.note,
    createdAt: row.created_at,
  }));
}

export async function getHabitEntriesByDate(date: string): Promise<HabitEntry[]> {
  const database = await getDb();

  const rows = await database.select<
    Array<{
      id: string;
      habit_id: string;
      date: string;
      status: string;
      note: string;
      created_at: string;
    }>
  >(`SELECT * FROM habit_entries WHERE date = $1`, [date]);

  return rows.map((row) => ({
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
    status: row.status as HabitEntry["status"],
    note: row.note,
    createdAt: row.created_at,
  }));
}

export async function getAllHabitEntries(): Promise<HabitEntry[]> {
  const database = await getDb();

  const rows = await database.select<
    Array<{
      id: string;
      habit_id: string;
      date: string;
      status: string;
      note: string;
      created_at: string;
    }>
  >(`SELECT * FROM habit_entries ORDER BY date DESC`);

  return rows.map((row) => ({
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
    status: row.status as HabitEntry["status"],
    note: row.note,
    createdAt: row.created_at,
  }));
}

export async function getHabitEntryByHabitAndDate(habitId: string, date: string): Promise<HabitEntry | null> {
  const database = await getDb();

  const rows = await database.select<
    Array<{
      id: string;
      habit_id: string;
      date: string;
      status: string;
      note: string;
      created_at: string;
    }>
  >(`SELECT * FROM habit_entries WHERE habit_id = $1 AND date = $2`, [habitId, date]);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
    status: row.status as HabitEntry["status"],
    note: row.note,
    createdAt: row.created_at,
  };
}

export async function createHabitEntry(entry: HabitEntry): Promise<HabitEntry> {
  const database = await getDb();

  await database.execute(
    `INSERT INTO habit_entries (id, habit_id, date, status, note, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [entry.id, entry.habitId, entry.date, entry.status, entry.note, entry.createdAt]
  );

  return entry;
}

export async function updateHabitEntry(entry: HabitEntry): Promise<HabitEntry> {
  const database = await getDb();

  await database.execute(
    `UPDATE habit_entries SET status = $1, note = $2 WHERE id = $3`,
    [entry.status, entry.note, entry.id]
  );

  return entry;
}

export async function deleteHabitEntry(entry: HabitEntry): Promise<HabitEntry> {
  const database = await getDb();

  await database.execute(`DELETE FROM habit_entries WHERE id = $1`, [entry.id]);

  return entry;
}

// =============================================================================
// HABIT BACKPOPULATION
// =============================================================================

// Helper function to check if a habit is scheduled for a given date
function isHabitScheduledForDate(habit: Habit, date: Date): boolean {
  // Parse RRULE to determine if habit is scheduled
  const freqMatch = habit.rrule.match(/FREQ=(\w+)/);
  const frequency = freqMatch?.[1] || "DAILY";

  if (frequency === "DAILY") {
    return true;
  }

  if (frequency === "WEEKLY") {
    const daysMatch = habit.rrule.match(/BYDAY=([A-Z,]+)/);
    const days = daysMatch ? daysMatch[1].split(",") : [];
    const dayOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][date.getDay()];
    return days.includes(dayOfWeek);
  }

  return false;
}

// Backpopulate entries for a single habit from its updated_at to today
export async function backpopulateHabitEntriesForHabit(habit: Habit): Promise<void> {
  // Skip if habit is paused or archived
  if (habit.pausedAt || habit.archivedAt) {
    return;
  }

  const database = await getDb();

  // Get all existing entries for this habit
  const existingEntries = await database.select<
    Array<{
      date: string;
    }>
  >(`SELECT date FROM habit_entries WHERE habit_id = $1`, [habit.id]);
  const existingDates = new Set(existingEntries.map((e) => e.date));

  // Helper to format date as YYYY-MM-DD in local timezone
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Start from updated_at (or created_at if updated_at is not set)
  const startDate = new Date(habit.updatedAt || habit.createdAt);
  startDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Iterate through each day from start to today
  const currentDate = new Date(startDate);
  while (currentDate <= today) {
    const dateString = formatDateLocal(currentDate);

    // Skip if entry already exists for this date
    if (!existingDates.has(dateString)) {
      // Check if habit is scheduled for this date
      if (isHabitScheduledForDate(habit, currentDate)) {
        // Create entry with "skipped" status
        const now = new Date().toISOString();
        const entry: HabitEntry = {
          id: crypto.randomUUID(),
          habitId: habit.id,
          date: dateString,
          status: "skipped",
          note: "",
          createdAt: now,
        };
        await createHabitEntry(entry);
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

// Backpopulate entries for all active habits
export async function backpopulateHabitEntries(): Promise<void> {
  // Ensure database is initialized
  await getDb();

  // Get all active habits (not archived, not paused)
  const habits = await getHabits(true); // Include all to filter ourselves
  const activeHabits = habits.filter(
    (h) => !h.pausedAt && !h.archivedAt
  );

  // Backpopulate each active habit
  for (const habit of activeHabits) {
    await backpopulateHabitEntriesForHabit(habit);
  }
}

// =============================================================================
// RABBIT STATE OPERATIONS
// =============================================================================

export async function getRabbitState(): Promise<RabbitState | null> {
  const database = await getDb();
  const rows = await database.select<
    Array<{
      id: string;
      level: number;
      xp: number;
      current_outfit: string;
      current_emotion: string;
      created_at: string;
      updated_at: string;
    }>
  >(`SELECT * FROM rabbit_state WHERE id = 'singleton'`);
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    level: row.level as RabbitLevel,
    xp: row.xp,
    currentOutfit: row.current_outfit,
    currentEmotion: (row.current_emotion as any) || 'happy',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function initRabbitState(): Promise<RabbitState> {
  const existing = await getRabbitState();
  if (existing) return existing;

  const database = await getDb();
  const now = new Date().toISOString();
  await database.execute(
    `INSERT INTO rabbit_state (id, level, xp, current_outfit, current_emotion, created_at, updated_at) VALUES ('singleton', 1, 0, 'none', 'happy', $1, $2)`,
    [now, now]
  );
  return {
    id: "singleton",
    level: 1,
    xp: 0,
    currentOutfit: "none",
    currentEmotion: 'happy',
    createdAt: now,
    updatedAt: now,
  };
}

export async function addRabbitXP(amount: number): Promise<RabbitState> {
  const state = await initRabbitState();
  const newXP = state.xp + amount;

  // Calculate new level based on XP thresholds
  let newLevel: RabbitLevel = 1;
  if (newXP >= 700) newLevel = 5;
  else if (newXP >= 350) newLevel = 4;
  else if (newXP >= 150) newLevel = 3;
  else if (newXP >= 50) newLevel = 2;

  const database = await getDb();
  const now = new Date().toISOString();
  await database.execute(
    `UPDATE rabbit_state SET xp = $1, level = $2, updated_at = $3 WHERE id = 'singleton'`,
    [newXP, newLevel, now]
  );

  return { ...state, xp: newXP, level: newLevel as RabbitLevel, updatedAt: now };
}

export async function setRabbitOutfit(outfitId: string): Promise<void> {
  const database = await getDb();
  const now = new Date().toISOString();
  await database.execute(
    `UPDATE rabbit_state SET current_outfit = $1, updated_at = $2 WHERE id = 'singleton'`,
    [outfitId, now]
  );
}

// =============================================================================
// RABBIT OUTFITS OPERATIONS
// =============================================================================

export async function getUnlockedOutfits(): Promise<RabbitOutfit[]> {
  const database = await getDb();
  const rows = await database.select<
    Array<{
      id: string;
      unlocked_at: string;
      unlock_reason: string;
    }>
  >(`SELECT * FROM rabbit_outfits ORDER BY unlocked_at`);
  return rows.map((row) => ({
    id: row.id,
    unlockedAt: row.unlocked_at,
    unlockReason: row.unlock_reason,
  }));
}

export async function unlockOutfit(id: string, reason: string): Promise<RabbitOutfit | null> {
  const database = await getDb();
  // Check if already unlocked
  const existing = await database.select<Array<{ id: string }>>(
    `SELECT id FROM rabbit_outfits WHERE id = $1`, [id]
  );
  if (existing.length > 0) return null; // Already unlocked

  const now = new Date().toISOString();
  await database.execute(
    `INSERT INTO rabbit_outfits (id, unlocked_at, unlock_reason) VALUES ($1, $2, $3)`,
    [id, now, reason]
  );
  return { id, unlockedAt: now, unlockReason: reason };
}

// =============================================================================
// RABBIT MEMORY OPERATIONS
// =============================================================================

export async function getRabbitMemories(): Promise<RabbitMemory[]> {
  const database = await getDb();
  const rows = await database.select<
    Array<{
      id: string;
      memory_type: string;
      memory_key: string;
      memory_value: string;
      created_at: string;
      updated_at: string;
    }>
  >(`SELECT * FROM rabbit_memory ORDER BY updated_at DESC`);
  return rows.map((row) => ({
    id: row.id,
    memoryType: row.memory_type as RabbitMemoryType,
    memoryKey: row.memory_key,
    memoryValue: row.memory_value,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function upsertRabbitMemory(
  memoryType: RabbitMemoryType,
  memoryKey: string,
  memoryValue: string
): Promise<void> {
  const database = await getDb();
  const now = new Date().toISOString();
  const id = `${memoryType}:${memoryKey}`;

  // Try update first, then insert
  const result = await database.execute(
    `UPDATE rabbit_memory SET memory_value = $1, updated_at = $2 WHERE memory_type = $3 AND memory_key = $4`,
    [memoryValue, now, memoryType, memoryKey]
  );

  if (result.rowsAffected === 0) {
    await database.execute(
      `INSERT INTO rabbit_memory (id, memory_type, memory_key, memory_value, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, memoryType, memoryKey, memoryValue, now, now]
    );
  }
}
