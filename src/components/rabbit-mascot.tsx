import { cn } from "@/lib/utils";

export type RabbitMood =
  | "happy"
  | "encouraging"
  | "nudging"
  | "celebrating"
  | "sleeping"
  | "waving";

interface RabbitMascotProps {
  mood?: RabbitMood;
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showBubble?: boolean;
}

export function RabbitMascot({
  mood = "happy",
  message,
  size = "md",
  className,
  showBubble = true,
}: RabbitMascotProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={cn("flex items-end gap-3", className)}>
      <div className={cn("shrink-0", sizeClasses[size])}>
        <RabbitSVG mood={mood} />
      </div>
      {message && showBubble && (
        <div className="relative bg-primary/10 rounded-2xl rounded-bl-sm px-3 py-2 text-sm max-w-[240px]">
          {message}
        </div>
      )}
    </div>
  );
}

function RabbitSVG({ mood }: { mood: RabbitMood }) {
  // Eye expressions based on mood
  const getEyes = () => {
    switch (mood) {
      case "celebrating":
        // Excited closed eyes (happy arcs)
        return (
          <>
            <path d="M35 52 Q38 48 41 52" stroke="#5a4a5a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M55 52 Q58 48 61 52" stroke="#5a4a5a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      case "sleeping":
        // Closed sleepy eyes
        return (
          <>
            <line x1="34" y1="51" x2="42" y2="51" stroke="#5a4a5a" strokeWidth="2" strokeLinecap="round" />
            <line x1="54" y1="51" x2="62" y2="51" stroke="#5a4a5a" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case "nudging":
        // One eye winking
        return (
          <>
            <circle cx="38" cy="50" r="3" fill="#5a4a5a" />
            <path d="M55 50 Q58 46 61 50" stroke="#5a4a5a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      default:
        // Normal round eyes
        return (
          <>
            <circle cx="38" cy="50" r="3.5" fill="#5a4a5a" />
            <circle cx="58" cy="50" r="3.5" fill="#5a4a5a" />
            {/* Eye shine */}
            <circle cx="39.5" cy="48.5" r="1.2" fill="white" />
            <circle cx="59.5" cy="48.5" r="1.2" fill="white" />
          </>
        );
    }
  };

  const getMouth = () => {
    switch (mood) {
      case "celebrating":
        return <path d="M42 60 Q48 67 54 60" stroke="#5a4a5a" strokeWidth="2" fill="none" strokeLinecap="round" />;
      case "encouraging":
        return <path d="M43 60 Q48 64 53 60" stroke="#5a4a5a" strokeWidth="2" fill="none" strokeLinecap="round" />;
      case "nudging":
        return <path d="M44 60 Q48 63 52 60" stroke="#5a4a5a" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
      case "sleeping":
        return <path d="M44 61 Q48 63 52 61" stroke="#5a4a5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />;
      default:
        return <path d="M43 60 Q48 65 53 60" stroke="#5a4a5a" strokeWidth="2" fill="none" strokeLinecap="round" />;
    }
  };

  // Celebration extras (confetti, stars)
  const getExtras = () => {
    if (mood === "celebrating") {
      return (
        <>
          <circle cx="20" cy="20" r="2.5" fill="#e8a87c" opacity="0.8" />
          <circle cx="75" cy="15" r="2" fill="#b8d4c8" opacity="0.8" />
          <circle cx="80" cy="30" r="3" fill="#d4b8d8" opacity="0.7" />
          <circle cx="15" cy="35" r="2" fill="#e8a87c" opacity="0.6" />
          {/* Stars */}
          <text x="10" y="25" fontSize="8" opacity="0.7">✦</text>
          <text x="82" y="22" fontSize="6" opacity="0.6">✦</text>
        </>
      );
    }
    if (mood === "sleeping") {
      return (
        <>
          <text x="65" y="30" fontSize="10" fill="#5a4a5a" opacity="0.4">z</text>
          <text x="72" y="22" fontSize="8" fill="#5a4a5a" opacity="0.3">z</text>
          <text x="78" y="16" fontSize="6" fill="#5a4a5a" opacity="0.2">z</text>
        </>
      );
    }
    if (mood === "waving") {
      return null; // Wave is handled by arm positioning
    }
    return null;
  };

  // Ear tilt based on mood
  const earRotation = mood === "celebrating" ? -5 : mood === "sleeping" ? 10 : 0;

  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {getExtras()}

      {/* Left ear */}
      <g transform={`rotate(${earRotation - 5}, 36, 30)`}>
        <ellipse cx="36" cy="18" rx="10" ry="20" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1.5" />
        <ellipse cx="36" cy="18" rx="5.5" ry="14" fill="#f0c4c4" opacity="0.5" />
      </g>

      {/* Right ear */}
      <g transform={`rotate(${-earRotation + 5}, 60, 30)`}>
        <ellipse cx="60" cy="18" rx="10" ry="20" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1.5" />
        <ellipse cx="60" cy="18" rx="5.5" ry="14" fill="#f0c4c4" opacity="0.5" />
      </g>

      {/* Body */}
      <ellipse cx="48" cy="78" rx="18" ry="14" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1.5" />

      {/* Head */}
      <ellipse cx="48" cy="52" rx="22" ry="20" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1.5" />

      {/* Cheek blush */}
      <ellipse cx="30" cy="56" rx="5" ry="3.5" fill="#f0c4c4" opacity="0.45" />
      <ellipse cx="66" cy="56" rx="5" ry="3.5" fill="#f0c4c4" opacity="0.45" />

      {/* Eyes */}
      {getEyes()}

      {/* Nose */}
      <ellipse cx="48" cy="56" rx="2.5" ry="2" fill="#d4a0a0" />

      {/* Mouth */}
      {getMouth()}

      {/* Whiskers */}
      <line x1="20" y1="54" x2="32" y2="56" stroke="#d4c0b0" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <line x1="20" y1="58" x2="32" y2="58" stroke="#d4c0b0" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <line x1="64" y1="56" x2="76" y2="54" stroke="#d4c0b0" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <line x1="64" y1="58" x2="76" y2="58" stroke="#d4c0b0" strokeWidth="1" opacity="0.5" strokeLinecap="round" />

      {/* Arms */}
      {mood === "waving" || mood === "celebrating" ? (
        <>
          {/* Left arm down */}
          <ellipse cx="32" cy="80" rx="5" ry="4" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1" />
          {/* Right arm raised */}
          <ellipse cx="68" cy="68" rx="5" ry="4" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1" transform="rotate(-30 68 68)" />
        </>
      ) : (
        <>
          <ellipse cx="32" cy="80" rx="5" ry="4" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1" />
          <ellipse cx="64" cy="80" rx="5" ry="4" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1" />
        </>
      )}

      {/* Feet */}
      <ellipse cx="40" cy="90" rx="7" ry="4" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1" />
      <ellipse cx="56" cy="90" rx="7" ry="4" fill="#f5e6d3" stroke="#e8d4c0" strokeWidth="1" />
    </svg>
  );
}

// --- Playful Coach Messages ---

const GREETING_MESSAGES = {
  morning: [
    "Rise and shine! Ready to crush today?",
    "Good morning! Let's make today count!",
    "Morning, superstar! What's the plan?",
  ],
  afternoon: [
    "Afternoon check-in! How's it going?",
    "Keep that momentum rolling!",
    "You've got this — the day's not over yet!",
  ],
  evening: [
    "Wrapping up? Let's see what you nailed today!",
    "Evening wind-down time. Nice work today!",
    "Almost bedtime — you did great today!",
  ],
};

export function getGreetingMessage(): { message: string; mood: RabbitMood } {
  const hour = new Date().getHours();
  let messages: string[];
  if (hour < 12) messages = GREETING_MESSAGES.morning;
  else if (hour < 17) messages = GREETING_MESSAGES.afternoon;
  else messages = GREETING_MESSAGES.evening;

  const message = messages[Math.floor(Math.random() * messages.length)];
  return { message, mood: "waving" };
}

const AGING_MESSAGES: Record<string, string[]> = {
  mild: [
    "This one's been chillin' for a bit — want to tackle it?",
    "Hey, remember this one? It's still hanging around!",
    "A little nudge — this task is waiting for you!",
  ],
  moderate: [
    "This task is getting lonely... it's been a few days!",
    "Psst! This one's been here a while. Give it some love?",
    "Time flies! This task has been patient — maybe today?",
  ],
  urgent: [
    "Okay, real talk — this one's been here a while. You got this!",
    "This task has been waiting patiently. Let's do this!",
    "It's been over a week! Just a little push and it's done!",
  ],
};

export function getAgingMessage(daysSinceCreated: number): { message: string; mood: RabbitMood } | null {
  if (daysSinceCreated < 1) return null;

  let category: string;
  let mood: RabbitMood;

  if (daysSinceCreated <= 5) {
    category = "mild";
    mood = "encouraging";
  } else if (daysSinceCreated <= 8) {
    category = "moderate";
    mood = "nudging";
  } else {
    category = "urgent";
    mood = "nudging";
  }

  const messages = AGING_MESSAGES[category];
  const message = messages[Math.floor(Math.random() * messages.length)];
  return { message, mood };
}

const STREAK_CELEBRATIONS: Record<number, { message: string; mood: RabbitMood }> = {
  3: { message: "Nice start! 3 days in — keep it rolling!", mood: "encouraging" },
  7: { message: "A FULL WEEK! You're building something great!", mood: "celebrating" },
  14: { message: "Two weeks strong! You're unstoppable!", mood: "celebrating" },
  21: { message: "Three weeks! This is becoming a real habit!", mood: "celebrating" },
  30: { message: "ONE MONTH! I'm so proud of you!", mood: "celebrating" },
  60: { message: "60 days?! You're a habit MACHINE!", mood: "celebrating" },
  90: { message: "90 days! That's legendary dedication!", mood: "celebrating" },
  180: { message: "Half a year! You're writing history!", mood: "celebrating" },
  365: { message: "A WHOLE YEAR! You absolute champion!", mood: "celebrating" },
};

export function getStreakCelebration(streak: number): { message: string; mood: RabbitMood; milestone: number } | null {
  // Find the highest milestone the streak has reached
  const milestones = Object.keys(STREAK_CELEBRATIONS)
    .map(Number)
    .sort((a, b) => b - a);

  for (const milestone of milestones) {
    if (streak >= milestone) {
      const celebration = STREAK_CELEBRATIONS[milestone];
      return { ...celebration, milestone };
    }
  }
  return null;
}

export function getEmptyStateMessage(): { message: string; mood: RabbitMood } {
  const messages = [
    "All clear! Time to add something new?",
    "A blank slate — the possibilities are endless!",
    "Nothing here yet! Let's add your first task!",
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];
  return { message, mood: "happy" };
}

export function getDashboardEmptyMessage(): { message: string; mood: RabbitMood } {
  const messages = [
    "Let's get started! Add a task or log a mood!",
    "Your journey starts with a single step. Ready?",
    "I'm here to help! What would you like to track?",
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];
  return { message, mood: "waving" };
}
