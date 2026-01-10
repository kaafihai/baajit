// =============================================================================
// SHARD TYPES v2
// =============================================================================

// -----------------------------------------------------------------------------
// Task Types
// -----------------------------------------------------------------------------

export type TaskType = "task" | "project_root" | "habit_root" | "flow_root";

export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  categoryId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  archivedAt?: string;
  taskType: TaskType;
  recurrenceRule?: string;
  metadata?: Record<string, unknown>;
}

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt" | "archivedAt">;

export type TaskFilter = "all" | "active" | "completed" | "archived";

export interface TaskWithRelations extends Task {
  categoryName?: string;
  categoryColor?: string;
  // Populated from links table
  subtasks?: Task[];
  blockedBy?: Task[];
  blocks?: Task[];
}

// -----------------------------------------------------------------------------
// Link Types
// -----------------------------------------------------------------------------

export type LinkType = "subtask" | "continues" | "sequence_next" | "blocks" | "based_on";

export interface Link {
  id: string;
  src: string;
  dst: string;
  type: LinkType;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface LinkInput {
  src: string;
  dst: string;
  type: LinkType;
  metadata?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Event Types
// -----------------------------------------------------------------------------

export type EventType =
  | "mood"
  | "flow_step"
  | "task_completed"
  | "habit_spawned"
  | "archived"
  | "unarchived";

export interface AppEvent {
  id: string;
  timestamp: string;
  entityId?: string;
  eventType: EventType;
  data: Record<string, unknown>;
}

export interface EventInput {
  entityId?: string;
  eventType: EventType;
  data: Record<string, unknown>;
}

// Mood-specific event data
export type MoodLevel = "great" | "good" | "okay" | "bad" | "terrible";

export interface MoodEventData {
  mood: MoodLevel;
  note?: string;
}

// Flow step event data
export interface FlowStepEventData {
  flowId: string;
  stepTaskId: string;
  stepIndex: number;
}

// -----------------------------------------------------------------------------
// Category & Tag Types
// -----------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface CategoryInput {
  name: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface TagInput {
  name: string;
}

// -----------------------------------------------------------------------------
// Legacy Types (for migration compatibility)
// -----------------------------------------------------------------------------

/** @deprecated Use AppEvent with eventType='mood' instead */
export interface Mood {
  id: string;
  mood: MoodLevel;
  note?: string;
  createdAt: string;
}

/** @deprecated Use EventInput instead */
export type MoodInput = Omit<Mood, "id" | "createdAt">;

// -----------------------------------------------------------------------------
// Query/Filter Types
// -----------------------------------------------------------------------------

export interface TaskQuery {
  taskType?: TaskType;
  completed?: boolean;
  includeArchived?: boolean;
  categoryId?: string;
  dueBefore?: string;
  dueAfter?: string;
}

export interface EventQuery {
  entityId?: string;
  eventType?: EventType;
  after?: string;
  before?: string;
  limit?: number;
}
