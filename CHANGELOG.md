# Changelog

## v1.0.0 — First Release (March 2026)

Nibble is a task and habit management app built specifically for ADHD brains. Local-first, privacy-respecting, and designed to work with the way your brain actually works — not against it.

### Features

1. **Task Management** — Create, edit, complete, and archive tasks with due dates and energy-level tags. Swipe-friendly mobile layout with quick-add from the dashboard.

2. **Habit Tracking** — Build habits with flexible scheduling (daily, specific weekdays, or custom). Streak tracking with calendar heatmaps and detailed stats per habit.

3. **Mood Logging** — Five-level mood check-in (Great through Terrible) with optional notes. Prompted on each visit so you build the habit without thinking about it.

4. **Rabbit Progression System** — A companion rabbit that grows from tiny kit to majestic elder across 5 levels. Earns XP from everything you do: tasks (5 XP), habits (3 XP), moods (2 XP), focus sessions (8 XP), and brain dumps (4 XP). Unlockable outfits as milestone rewards.

5. **Focus Timer** — Distraction-free timer with preset durations (5, 15, 25, 45 minutes). No complicated setup — pick a time and start. Earns XP on completion.

6. **Brain Dump** — Quick-capture space for getting racing thoughts out of your head. Tag by category and optionally convert dumps into actionable tasks.

7. **Task Breakdown Assistant** — When a task feels overwhelming, break it into numbered mini-steps with coaching from your rabbit. Each step becomes its own trackable task.

8. **Energy Level Tracking** — Daily check-in across five levels (Depleted through Supercharged). The dashboard adapts suggestions based on your current energy.

9. **Sensory Grounding Exercises** — Three guided exercises for when focus slips: box breathing with a visual progress ring, the 5-4-3-2-1 sensory technique, and a quick body scan.

10. **Transition Prompts** — Gentle rabbit messages between completed tasks and habits, helping with the ADHD challenge of switching contexts without getting stuck.

11. **Calendar View** — Day and week views showing tasks, habits, and mood entries together. Tap any day to see what happened or what's coming up.

12. **Welcome Experience** — First-launch onboarding with an illustrated carrot field scene introducing Nibble's approach and your rabbit companion.

### Technical

- Built with Tauri v2 (desktop + mobile), React 19, TypeScript, and SQLite
- All data stored locally on your device — nothing leaves your machine
- TanStack Router for navigation, TanStack React Query for data management
- Tailwind CSS v4 with shadcn/ui components
- Phosphor Icons throughout
