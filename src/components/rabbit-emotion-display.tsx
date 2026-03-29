import { useRabbitEmotion, getEmotionMessage } from '@/hooks/use-rabbit-emotions';
import { RabbitMascot } from './rabbit-mascot';
import type { RabbitLevel } from '@/lib/types';

interface RabbitEmotionDisplayProps {
  level?: RabbitLevel;
  outfit?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Map RabbitEmotion to RabbitMood for visual display
const emotionToMoodMap = {
  happy: 'happy' as const,
  energetic: 'celebrating' as const,
  calm: 'happy' as const,
  tired: 'sleeping' as const,
  focused: 'encouraging' as const,
  confused: 'nudging' as const,
  proud: 'celebrating' as const,
};

export function RabbitEmotionDisplay({
  level = 1,
  outfit = 'none',
  size = 'md',
}: RabbitEmotionDisplayProps) {
  const { currentEmotion } = useRabbitEmotion();
  const emotionalMessage = getEmotionMessage(currentEmotion);
  const visualMood = emotionToMoodMap[currentEmotion];

  // Emotion emojis for visual indicators
  const emotionEmoji = {
    happy: '😊',
    energetic: '⚡',
    calm: '😌',
    tired: '😴',
    focused: '🎯',
    confused: '🤔',
    proud: '👑',
  }[currentEmotion];

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-start gap-3">
        <RabbitMascot
          mood={visualMood}
          message={emotionalMessage}
          level={level}
          outfit={outfit}
          size={size}
          animated
        />
      </div>

      {/* Emotion indicator badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
        <span className="text-lg">{emotionEmoji}</span>
        <span className="text-sm font-medium text-amber-900 capitalize">
          {currentEmotion}
        </span>
      </div>
    </div>
  );
}
