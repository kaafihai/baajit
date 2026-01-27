import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useTasks, useToggleTask, useDeleteTask } from "@/hooks/use-tasks";
import { useHabits, useHabitEntriesByDate, useToggleHabitEntry, getTodayDateString } from "@/hooks/use-habits";
import { useTodaysMood } from "@/hooks/use-moods";
import { Button, ButtonLink } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CalendarBlankIcon, CheckIcon, PencilSimpleIcon, TrashIcon, RepeatIcon, PlusIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import type { Task, Habit, HabitEntry } from "@/lib/types";

const DAY_MAP: Record<number, string> = {
  0: "SU",
  1: "MO",
  2: "TU",
  3: "WE",
  4: "TH",
  5: "FR",
  6: "SA",
};

function isDateScheduled(date: Date, rrule: string): boolean {
  const freqMatch = rrule.match(/FREQ=(\w+)/);
  const frequency = freqMatch?.[1] || "DAILY";

  if (frequency === "DAILY") {
    return true;
  }

  if (frequency === "WEEKLY") {
    const daysMatch = rrule.match(/BYDAY=([A-Z,]+)/);
    const days = daysMatch ? daysMatch[1].split(",") : [];
    const dayOfWeek = DAY_MAP[date.getDay()];
    return days.includes(dayOfWeek);
  }

  return true;
}

export const Route = createFileRoute("/")({
  component: TasksComponent,
});

function HabitItem({
  habit,
  entry,
  onToggle,
}: {
  habit: Habit;
  entry: HabitEntry | null;
  onToggle: (habit: Habit, entry: HabitEntry | null) => void;
}) {
  const isCompleted = entry?.status === 'completed';

  return (
    <div data-completed={isCompleted} className="flex bg-primary/10 data-[completed=true]:bg-success/10 items-center gap-4 p-4 rounded-4xl group transition-colors">
      <Button
        size="icon"
        variant={isCompleted ? 'ghost' : 'success'}
        onClick={() => onToggle(habit, entry)}
      >
        <CheckIcon />
      </Button>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold ${isCompleted ? "opacity-80 text-muted-foreground" : ""}`}
        >
          {habit.title}
        </h3>
        {habit.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {habit.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <RepeatIcon className="size-3" />
          {habit.rrule}
        </p>
      </div>
    </div>
  );
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {

  const past = task.dueDate && !task.completedAt && (new Date(task.dueDate) < new Date());
  return (
    <div data-completed={Boolean(task.completedAt)} className="flex bg-primary/10 data-[completed=true]:bg-success/10 items-center gap-4 p-4 rounded-4xl group transition-colors">
      <Button
        size="icon"
        variant={Boolean(task.completedAt) ? 'ghost' : 'success'}
        disabled={Boolean(task.completedAt)}
        onClick={() => onToggle(task)}
      >
        <CheckIcon />
      </Button>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold ${task.completedAt ? "opacity-80 text-muted-foreground" : ""}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {task.description}
          </p>
        )}
        {task.dueDate && (
          <p data-past={past} className="text-sm data-[past=true]:text-destructive text-muted-foreground mt-1 flex items-center gap-1">
            <CalendarBlankIcon className="size-3" />
            {format(new Date(task.dueDate), "PPP")}
          </p>
        )}
      </div>
      <ButtonLink
        variant="ghost"
        size="icon"
        to='/tasks/$id/edit'
        params={{id: task.id}}
        disabled={Boolean(task.completedAt)}
      >
        <PencilSimpleIcon />
      </ButtonLink>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => onDelete(task)}
      >
        <TrashIcon />
      </Button>
    </div>
  );
}

function TasksComponent() {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading } = useTasks();
  const { data: habits = [], isLoading: isHabitsLoading } = useHabits();
  const todayDate = getTodayDateString();
  const { data: todayEntries = [] } = useHabitEntriesByDate(todayDate);
  const { data: todaysMood, isLoading: isMoodLoading } = useTodaysMood();
  const [filter, setFilter] = useState<"active" | "completed" | "all">("all");
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const toggleHabitEntry = useToggleHabitEntry();

  useEffect(() => {
    if (!isMoodLoading && todaysMood === null) {
      navigate({ to: "/mood/track" });
    }
  }, [todaysMood, isMoodLoading, navigate]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completedAt;
    if (filter === "completed") return Boolean(task.completedAt);
    return true;
  });

  const todaysHabits = useMemo(() => {
    const today = new Date();
    return habits.filter((habit) => isDateScheduled(today, habit.rrule));
  }, [habits]);

  const getEntryForHabit = (habitId: string) => {
    return todayEntries.find((e) => e.habitId === habitId) || null;
  };

  const handleToggleHabit = (habit: Habit, entry: HabitEntry | null) => {
    toggleHabitEntry.mutate({ habit, date: todayDate, currentEntry: entry });
  };

  const completedHabitsCount = todaysHabits.filter((h) => getEntryForHabit(h.id)?.status === 'completed').length;

  if (isLoading || isHabitsLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-8">
      {/* Today's Habits Section */}
      <div className="flex justify-between items-end border-b pb-4">
        <h2 className="text-3xl font-bold">Today's Habits</h2>
        <div className="flex items-center gap-4">
          {todaysHabits.length > 0 && (
            <span className="text-muted-foreground text-sm">
              {completedHabitsCount}/{todaysHabits.length}
            </span>
          )}
          <ButtonLink to="/habits/new" size="icon">
            <PlusIcon />
          </ButtonLink>
        </div>
      </div>

      {todaysHabits.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No habits scheduled for today.
        </div>
      ) : (
        <div className="space-y-3">
          {todaysHabits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              entry={getEntryForHabit(habit.id)}
              onToggle={handleToggleHabit}
            />
          ))}
        </div>
      )}

      {/* Tasks Section */}
      <div className="flex justify-between items-end border-b pb-4">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <ButtonLink to="/tasks/new" size="icon">
          <PlusIcon />
        </ButtonLink>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          onClick={() => setFilter("all")}
        >
          All ({tasks.length})
        </Button>
        <Button
          variant={filter === "active" ? "default" : "ghost"}
          onClick={() => setFilter("active")}
        >
          Active ({tasks.filter((t) => !t.completedAt).length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "ghost"}
          onClick={() => setFilter("completed")}
        >
          Completed ({tasks.filter((t) => Boolean(t.completedAt)).length})
        </Button>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          All done!
        </div>
      )}

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask.mutate}
            onDelete={deleteTask.mutate}
          />
        ))}
      </div>
      <Outlet />
    </div>
  );
}
