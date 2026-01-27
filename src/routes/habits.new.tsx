import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HabitForm } from "@/components/habit-form";

export const Route = createFileRoute("/habits/new")({
  component: NewHabitComponent,
});

function NewHabitComponent() {
  const { history } = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          history.back();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <HabitForm />
      </DialogContent>
    </Dialog>
  );
}
