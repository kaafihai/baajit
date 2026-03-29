import { useMoods } from './use-moods';
import { useHabits } from './use-habits';
import type { MoodLevel } from '@/lib/types';
import { useMemo } from 'react';

// Map mood levels to energy levels
// Terrible/Bad = Low energy
// Okay = Medium energy
// Good/Great = High energy
function moodToEnergyLevel(mood: MoodLevel): 'low' | 'medium' | 'high' {
  switch (mood) {
    case 'great':
      return 'high';
    case 'good':
      return 'high';
    case 'okay':
      return 'medium';
    case 'bad':
      return 'low';
    case 'terrible':
      return 'low';
    default:
      return 'medium';
  }
}

export function useEnergyAwareness() {
  const { data: moods, isLoading: moodsLoading } = useMoods();
  const { data: habits, isLoading: habitsLoading } = useHabits();

  const energyState = useMemo(() => {
    if (!moods || moods.length === 0) {
      return {
        currentEnergy: 'medium' as const,
        lastMoodAt: null,
        recommendation: "No mood data yet. Log a mood to get personalized habit suggestions!",
      };
    }

    // Get the most recent mood
    const latestMood = moods[0];
    const currentEnergy = moodToEnergyLevel(latestMood.mood);

    return {
      currentEnergy,
      lastMoodAt: latestMood.createdAt,
      recommendation:
        currentEnergy === 'low'
          ? '🪴 You\'re running low on energy. Here are some gentle habits:'
          : currentEnergy === 'medium'
            ? '⭐ You\'ve got medium energy. These habits might fit well:'
            : '⚡ You\'re feeling energized! Here are some bigger habits you can tackle:',
    };
  }, [moods]);

  const suggestedHabits = useMemo(() => {
    if (!habits) return [];

    // Filter habits by current energy level
    const suggestions = habits
      .filter((h) => h.energyLevel === energyState.currentEnergy)
      .slice(0, 5); // Show top 5

    return suggestions;
  }, [habits, energyState.currentEnergy]);

  const alternativeHabits = useMemo(() => {
    if (!habits) return [];

    // Show other energy levels as alternatives
    const alternatives = habits
      .filter((h) => h.energyLevel !== energyState.currentEnergy)
      .slice(0, 3);

    return alternatives;
  }, [habits, energyState.currentEnergy]);

  return {
    currentEnergy: energyState.currentEnergy,
    lastMoodAt: energyState.lastMoodAt,
    recommendation: energyState.recommendation,
    suggestedHabits,
    alternativeHabits,
    isLoading: moodsLoading || habitsLoading,
  };
}
