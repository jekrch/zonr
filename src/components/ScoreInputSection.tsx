import React from 'react';
import { ScoreInputCategory } from './ScoreInputCategory';
import type { ScoreCategories, ScoreCategory } from '../types';

interface ScoreInputSectionProps {
  currentScores: ScoreCategories;
  activePlayerName: string;
  onUpdateScore: (category: keyof ScoreCategories, delta: number) => void;
  onAddScore: () => void;
  getCurrentTotal: () => number;
}

const scoreCategories: ScoreCategory[] = [
  { key: 'roads', label: 'Roads', icon: '🛤️' },
  { key: 'cities', label: 'Cities', icon: '🏰' },
  { key: 'monasteries', label: 'Monasteries', icon: '⛪' },
  { key: 'fields', label: 'Fields', icon: '🌾' }
];

export const ScoreInputSection: React.FC<ScoreInputSectionProps> = ({
  currentScores,
  activePlayerName,
  onUpdateScore,
  onAddScore,
  getCurrentTotal
}) => {
  return (
    <div className="bg-znr-secondary rounded-xl md:rounded-2xl p-3 md:p-6 mb-3 md:mb-4 shadow-xl">
      {scoreCategories.map(category => (
        <ScoreInputCategory
          key={category.key}
          category={category}
          currentScore={currentScores[category.key]}
          onUpdateScore={onUpdateScore}
        />
      ))}

      {/* Turn Total */}
      <div className="text-center py-4 md:py-6 my-3 md:my-4 relative">
        <div className="absolute left-[15%] right-[15%] top-0 h-px bg-gradient-to-r from-transparent via-znr-hover to-transparent" />
        <div className="text-xs uppercase tracking-wider text-znr-text-muted mb-1 md:mb-2">Turn Total</div>
        <div className="text-3xl md:text-5xl font-extralight text-znr-text-accent drop-shadow-lg">
          {getCurrentTotal()}
        </div>
      </div>

      {/* Add Score Button */}
      <button
        onClick={onAddScore}
        className="w-full py-3 md:py-5 bg-gradient-to-r from-znr-accent-alt to-znr-accent rounded-lg md:rounded-2xl text-znr-text font-semibold text-sm md:text-base uppercase tracking-wide hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] touch-manipulation"
      >
        Finish {activePlayerName}'s Turn
      </button>
    </div>
  );
};