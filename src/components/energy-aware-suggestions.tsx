import { useEnergyAwareness } from '@/hooks/use-energy-awareness';
import { playChirp } from '@/lib/sounds';
import { toast } from 'sonner';

interface EnergyAwareSuggestionsProps {
  compact?: boolean;
}

export function EnergyAwareSuggestions({ compact = false }: EnergyAwareSuggestionsProps) {
  const {
    currentEnergy,
    recommendation,
    suggestedHabits,
    alternativeHabits,
    isLoading,
  } = useEnergyAwareness();

  const handleHabitStart = (habitTitle: string) => {
    playChirp();
    toast.success(`Let's go with "${habitTitle}"! 🌟`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-4 text-amber-600">
        Loading your energy profile...
      </div>
    );
  }

  if (suggestedHabits.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-700">
          {recommendation}
        </p>
        {alternativeHabits.length > 0 && (
          <p className="text-xs text-amber-600 mt-2">
            Or try habits at a different energy level
          </p>
        )}
      </div>
    );
  }

  const energyIcon = {
    low: '🪴',
    medium: '⭐',
    high: '⚡',
  }[currentEnergy];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
        <p className="text-sm font-medium text-amber-900 mb-3">
          {energyIcon} {recommendation}
        </p>

        <div className={compact ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
          {suggestedHabits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => handleHabitStart(habit.title)}
              className="text-left p-3 rounded-lg bg-white border-2 border-transparent hover:border-amber-400 transition-colors"
            >
              <div className="font-medium text-amber-900 text-sm">
                {habit.title}
              </div>
              {habit.description && (
                <div className="text-xs text-amber-600 mt-1">
                  {habit.description}
                </div>
              )}
              {habit.timeOfDay !== 'anytime' && (
                <div className="text-xs text-amber-500 mt-1">
                  Best: {habit.timeOfDay}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {alternativeHabits.length > 0 && (
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Other habits you could try:
          </p>
          <div className="flex flex-wrap gap-2">
            {alternativeHabits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => handleHabitStart(habit.title)}
                className="text-xs px-3 py-1 rounded-full bg-white border border-gray-300 hover:border-gray-400 transition-colors text-gray-700"
              >
                {habit.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
