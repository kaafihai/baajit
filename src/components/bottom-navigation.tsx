import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarIcon,
  CompletedIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { User, Timer, Brain } from "@phosphor-icons/react";

export function BottomNavigation() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  // Hide nav on welcome page
  if (currentPath === "/welcome") return null;

  const isCalendarActive = currentPath.startsWith("/calendar");
  const isTasksActive = currentPath === "/" || currentPath === "/archive";
  const isFocusActive = currentPath === "/focus";
  const isBraindumpActive = currentPath === "/braindump";
  const isProfileActive = currentPath.startsWith("/dashboard");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-border">
      <div className="absolute inset-0 bg-white -z-10"></div>
      <div className="absolute inset-0 bg-primary/10 -z-10"></div>
      <div className="max-w-4xl mx-auto px-2 py-1 relative">
        <div className="grid grid-cols-5 items-center relative">
          {/* Calendar */}
          <div className="flex items-center justify-center">
            <Link
              to="/calendar"
              className={cn("btn p-2 flex flex-col items-center gap-0.5", isCalendarActive ? "text-primary" : "btn--ghost")}
            >
              <CalendarIcon className="size-5" />
              <span className={cn("text-[10px]", isCalendarActive ? "font-medium" : "opacity-60")}>Calendar</span>
            </Link>
          </div>

          {/* Tasks */}
          <div className="flex items-center justify-center">
            <Link
              to="/"
              className={cn("btn p-2 flex flex-col items-center gap-0.5", isTasksActive ? "text-primary" : "btn--ghost")}
            >
              <CompletedIcon className="size-5" />
              <span className={cn("text-[10px]", isTasksActive ? "font-medium" : "opacity-60")}>Tasks</span>
            </Link>
          </div>

          {/* Focus Timer */}
          <div className="flex items-center justify-center">
            <Link
              to="/focus"
              className={cn("btn p-2 flex flex-col items-center gap-0.5", isFocusActive ? "text-primary" : "btn--ghost")}
            >
              <Timer className="size-5" weight={isFocusActive ? "fill" : "regular"} />
              <span className={cn("text-[10px]", isFocusActive ? "font-medium" : "opacity-60")}>Focus</span>
            </Link>
          </div>

          {/* Brain Dump */}
          <div className="flex items-center justify-center">
            <Link
              to="/braindump"
              className={cn("btn p-2 flex flex-col items-center gap-0.5", isBraindumpActive ? "text-primary" : "btn--ghost")}
            >
              <Brain className="size-5" weight={isBraindumpActive ? "fill" : "regular"} />
              <span className={cn("text-[10px]", isBraindumpActive ? "font-medium" : "opacity-60")}>Dump</span>
            </Link>
          </div>

          {/* Dashboard */}
          <div className="flex items-center justify-center">
            <Link
              to="/dashboard"
              className={cn("btn p-2 flex flex-col items-center gap-0.5", isProfileActive ? "text-primary" : "btn--ghost")}
            >
              <User className="size-5" weight={isProfileActive ? "fill" : "regular"} />
              <span className={cn("text-[10px]", isProfileActive ? "font-medium" : "opacity-60")}>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
