import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { RRulePicker } from "@/components/rrule-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateTask } from "@/hooks/use-tasks";
import { useCreateHabit } from "@/hooks/use-habits";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { TimeOfDay, EnergyLevel } from "@/lib/types";

export const Route = createFileRoute("/new")({
  component: NewItemComponent,
});

function NewItemComponent() {
  const { history } = useRouter();
  const navigate = useNavigate();

  const createTask = useCreateTask();
  const createHabit = useCreateHabit();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [rrule, setRrule] = useState<string | null>(null);

  // V1.1 Habit fields
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("anytime");
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>("medium");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("09:00");

  const isHabit = rrule !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      if (isHabit) {
        await createHabit.mutateAsync({
          title,
          description,
          rrule: rrule,
          timeOfDay,
          linkedHabitId: null,
          energyLevel,
          notificationsEnabled,
          notificationTime: notificationsEnabled ? notificationTime : null,
          archivedAt: null,
          pausedAt: null,
          cancelledAt: null,
        });
      } else {
        await createTask.mutateAsync({
          title,
          description,
          dueDate,
          completedAt: null,
          archivedAt: null,
        });
      }
      navigate({ to: "/" });
    } catch (error) {
      toast.error(`Failed to create ${isHabit ? "habit" : "task"}: ${error}`);
    }
  };

  const isPending = createTask.isPending || createHabit.isPending;

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          history.back();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New {isHabit ? "Habit" : "Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pr-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details"
              rows={3}
            />
          </div>

          <RRulePicker
            value={rrule}
            onChange={(value) => setRrule(value)}
          />

          {isHabit && (
            <>
              {/* V1.1: Time of Day */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="timeOfDay">When do you want to do this?</Label>
                <Select value={timeOfDay} onValueChange={(value) => setTimeOfDay(value as TimeOfDay)}>
                  <SelectTrigger id="timeOfDay">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">🌅 Morning</SelectItem>
                    <SelectItem value="afternoon">☀️ Afternoon</SelectItem>
                    <SelectItem value="evening">🌙 Evening</SelectItem>
                    <SelectItem value="anytime">⏰ Anytime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* V1.1: Energy Level */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="energyLevel">Energy required</Label>
                <Select value={energyLevel} onValueChange={(value) => setEnergyLevel(value as EnergyLevel)}>
                  <SelectTrigger id="energyLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🪴 Low (5-10 min)</SelectItem>
                    <SelectItem value="medium">⭐ Medium (10-30 min)</SelectItem>
                    <SelectItem value="high">⚡ High (30+ min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* V1.1: Notifications */}
              <div className="flex flex-col gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notificationsEnabled"
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => setNotificationsEnabled(Boolean(checked))}
                  />
                  <Label htmlFor="notificationsEnabled" className="cursor-pointer font-medium">
                    Gentle reminders (optional)
                  </Label>
                </div>

                {notificationsEnabled && (
                  <div className="flex flex-col gap-2 pl-6">
                    <Label htmlFor="notificationTime">Remind me at</Label>
                    <Input
                      id="notificationTime"
                      type="time"
                      value={notificationTime}
                      onChange={(e) => setNotificationTime(e.target.value)}
                    />
                    <p className="text-xs text-amber-700">
                      Soft, kind reminders at your chosen time
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {!isHabit && (
            <div className="flex flex-col gap-2">
              <Label>Due Date</Label>
              <DatePicker
                value={dueDate}
                onChange={(date) => setDueDate(date)}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={!title.trim() || isPending}
            >
              Create {isHabit ? "Habit" : "Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
