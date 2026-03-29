import { useRabbitState } from './use-rabbit';
import { useMoods } from './use-moods';
import { useTasks } from './use-tasks';
import { useAllHabitEntries } from './use-habits';
import type { RabbitEmotion } from '@/lib/types';
import { useMemo } from 'react';

/**
 * Analyzes user activity to determine the rabbit's current emotion
 * - happy: tasks completed, good mood, active day
 * - energetic: streak active, many tasks done, high energy
 * - calm: good mood logged, peaceful day
 * - tired: few activities, bad/terrible mood
 * - focused: working on tasks, medium-high activity
 * - confused: mixed signals (bad mood but tasks completed, etc.)
 * - proud: streak milestone, many habits completed
 */
export function useRabbitEmotion() {
  const { data: rabbitState } = useRabbitState();
  const { data: moods } = useMoods();
  const { data: tasks } = useTasks();
  const { data: habitEntries } = useAllHabitEntries();

  const emotion = useMemo(() => {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count today's activities
    const tasksCompletedToday = tasks?.filter((t) => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length ?? 0;

    const habitsCompletedToday = habitEntries?.filter((e) => {
      if (e.status !== 'completed') return false;
      const entryDate = new Date(e.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    }).length ?? 0;

    // Get latest mood
    const latestMood = moods?.[0];

    // Determine emotion based on activity levels and mood
    let determinedEmotion: RabbitEmotion = 'happy';

    // Tired: bad mood and low activity
    if (
      latestMood?.mood === 'terrible' ||
      (latestMood?.mood === 'bad' && tasksCompletedToday === 0 && habitsCompletedToday === 0)
    ) {
      determinedEmotion = 'tired';
    }
    // Proud: high activity and good mood
    else if (
      (tasksCompletedToday >= 5 || habitsCompletedToday >= 5) &&
      (latestMood?.mood === 'good' || latestMood?.mood === 'great')
    ) {
      determinedEmotion = 'proud';
    }
    // Energetic: very high activity
    else if (tasksCompletedToday >= 8 || habitsCompletedToday >= 8) {
      determinedEmotion = 'energetic';
    }
    // Focused: moderate activity with good focus
    else if ((tasksCompletedToday >= 3 || habitsCompletedToday >= 3) && latestMood?.mood !== 'bad') {
      determinedEmotion = 'focused';
    }
    // Calm: peaceful mood, light activity
    else if (latestMood?.mood === 'good' && tasksCompletedToday <= 2) {
      determinedEmotion = 'calm';
    }
    // Confused: mixed signals
    else if (
      tasksCompletedToday > 0 &&
      latestMood &&
      latestMood.mood !== 'good' &&
      latestMood.mood !== 'great' &&
      latestMood.mood !== 'okay'
    ) {
      determinedEmotion = 'confused';
    }
    // Default happy
    else {
      determinedEmotion = 'happy';
    }

    return determinedEmotion;
  }, [moods, tasks, habitEntries]);

  return {
    currentEmotion: emotion,
    rabbit: rabbitState,
  };
}

/**
 * Get emotion-specific messages from the rabbit
 */
export function getEmotionMessage(emotion: RabbitEmotion): string {
  const messages: Record<RabbitEmotion, string[]> = {
    happy: [
      "Hopping with joy! 🐰",
      "Life is good in the garden! 🌱",
      "Ready for anything! ✨",
    ],
    energetic: [
      "Let's GO! *bounces excitedly* ⚡",
      "I'm zooming around! 🏃",
      "So much energy! 💫",
    ],
    calm: [
      "Peaceful garden vibes... 🌿",
      "All is well in our little garden 🌳",
      "Just chillin' here 😌",
    ],
    tired: [
      "Been a long day... 😴",
      "Need some rest soon... 💤",
      "*yawns* You did good today 🥱",
    ],
    focused: [
      "Laser focus! 🎯",
      "Getting things done! 💪",
      "On a roll! 🚀",
    ],
    confused: [
      "Hmm, mixed signals here... 🤔",
      "That's... interesting! 👀",
      "Sorting things out... 🧩",
    ],
    proud: [
      "You're amazing! 🌟",
      "*puffs chest proudly* Look at you go! 👑",
      "I'm so proud of you! 💖",
    ],
  };

  const emotionMessages = messages[emotion];
  return emotionMessages[Math.floor(Math.random() * emotionMessages.length)];
}
