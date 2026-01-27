import { CalendarIcon, CheckCircleIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate, Outlet } from "@tanstack/react-router";
import { useTasks } from "@/hooks/use-tasks";
import { useMoods } from "@/hooks/use-moods";
import type { Task, Mood } from "@/lib/types";
import { MOOD_OPTIONS } from "@/components/mood-tracker-form";
import { format, subDays, addDays, isSameDay, isToday, startOfWeek, endOfWeek, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function CalendarPage() {
  const navigate = useNavigate();
  const { data: tasks } = useTasks();
  const { data: moods } = useMoods();
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();

  const { currentWeek, previousWeek, weekLabel } = useMemo(() => {
    const baseDate = subDays(today, weekOffset * 7);
    const weekStart = startOfWeek(baseDate);
    const weekEnd = endOfWeek(baseDate);

    const prevWeekStart = subDays(weekStart, 7);
    const prevWeekEnd = subDays(weekStart, 1);

    const buildWeekData = (start: Date, end: Date) => {
      const days: Array<{
        date: Date;
        dateKey: string;
        completedTasks: Task[];
        mood: Mood | null;
      }> = [];

      let current = start;
      while (!isAfter(current, end)) {
        const dateKey = formatDateKey(current);
        const completedTasks =
          tasks?.filter((task) => {
            if (!task.completedAt) return false;
            return isSameDay(new Date(task.completedAt), current);
          }) ?? [];
        const mood =
          moods?.find((m) => isSameDay(new Date(m.createdAt), current)) ?? null;

        days.push({ date: new Date(current), dateKey, completedTasks, mood });
        current = addDays(current, 1);
      }
      return days;
    };

    return {
      currentWeek: buildWeekData(weekStart, weekEnd),
      previousWeek: buildWeekData(prevWeekStart, prevWeekEnd),
      weekLabel: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`,
    };
  }, [tasks, moods, weekOffset, today]);

  const handleDayClick = (date: Date) => {
    const timestamp = date.getTime();
    navigate({
      to: "/calendar/$timestamp",
      params: { timestamp: String(timestamp) },
    });
  };

  const goToPreviousWeeks = () => setWeekOffset((prev) => prev + 2);
  const goToNextWeeks = () => setWeekOffset((prev) => Math.max(0, prev - 2));
  const goToCurrentWeek = () => setWeekOffset(0);

  const canGoNext = weekOffset > 0;

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="size-8" />
          <h2 className="text-3xl font-bold">Calendar</h2>
        </div>
        {weekOffset > 0 && (
          <Button variant="ghost" onClick={goToCurrentWeek}>
            Today
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPreviousWeeks}>
          <CaretLeftIcon className="size-4" />
        </Button>
        <span className="text-sm font-medium">{weekLabel}</span>
        <Button variant="ghost" size="icon" onClick={goToNextWeeks} disabled={!canGoNext}>
          <CaretRightIcon className="size-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <WeekSection
          title="This Week"
          days={currentWeek}
          onDayClick={handleDayClick}
        />
        <WeekSection
          title="Last Week"
          days={previousWeek}
          onDayClick={handleDayClick}
        />
      </div>

      <Outlet />
    </div>
  );
}

function WeekSection({
  title,
  days,
  onDayClick,
}: {
  title: string;
  days: Array<{
    date: Date;
    dateKey: string;
    completedTasks: Task[];
    mood: Mood | null;
  }>;
  onDayClick: (date: Date) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, dateKey, completedTasks, mood }) => {
          const MoodIcon = mood
            ? MOOD_OPTIONS.find((m) => m.value === mood.mood)?.icon
            : null;
          const dayIsToday = isToday(date);
          const isFuture = isAfter(date, new Date());

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onDayClick(date)}
              disabled={isFuture}
              className={cn(
                "flex flex-col items-center p-2 rounded-2xl transition-colors min-h-24",
                "hover:bg-primary/15 cursor-pointer",
                dayIsToday && "ring-2 ring-primary",
                isFuture && "opacity-30 cursor-not-allowed hover:bg-transparent",
                !isFuture && (completedTasks.length > 0 || mood)
                  ? "bg-primary/10"
                  : "bg-primary/5"
              )}
            >
              <span className="text-xs text-muted-foreground">
                {format(date, "EEE")}
              </span>
              <span
                className={cn(
                  "text-lg font-semibold",
                  dayIsToday && "text-primary"
                )}
              >
                {format(date, "d")}
              </span>

              <div className="flex flex-col items-center gap-1 mt-auto">
                {MoodIcon && <MoodIcon className="size-5 text-primary" />}
                {completedTasks.length > 0 && (
                  <div className="flex items-center gap-0.5 text-success">
                    <CheckCircleIcon className="size-4" />
                    <span className="text-xs font-medium">
                      {completedTasks.length}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
