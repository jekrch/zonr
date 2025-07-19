import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useHoldButton } from '../hooks/useHoldButton';
import type { ScoreCategories, ScoreCategory } from '../types';

interface ScoreInputCategoryProps {
  category: ScoreCategory;
  currentScore: number;
  onUpdateScore: (category: keyof ScoreCategories, delta: number) => void;
}

export const ScoreInputCategory: React.FC<ScoreInputCategoryProps> = ({
  category,
  currentScore,
  onUpdateScore
}) => {
  const increment = useHoldButton(() => onUpdateScore(category.key, 1));
  //const increment5 = useHoldButton(() => onUpdateScore(category.key, 5));
  const decrement = useHoldButton(() => onUpdateScore(category.key, -1));
  //const decrement5 = useHoldButton(() => onUpdateScore(category.key, -5));

  return (
    <div className="flex items-center justify-between mb-3 md:mb-4 p-2 md:p-3 bg-znr-tertiary rounded-lg md:rounded-xl hover:bg-znr-elevated transition-colors last:mb-0">
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-znr-accent-alt rounded-md md:rounded-lg flex items-center justify-center text-base md:text-xl shadow-inner flex-shrink-0">
          {category.icon}
        </div>
        <div className="text-sm md:text-lg text-znr-text-dim font-medium truncate max-w-[80px] sm:max-w-none">
          {category.label}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* -5 Button */}
        {/* <button
          {...decrement5}
          className="w-7 h-7 md:w-8 md:h-8 bg-znr-elevated rounded-md flex items-center justify-center text-znr-text-dim hover:bg-znr-hover transition-all active:scale-95 touch-manipulation text-xs"
        >
          -5
        </button> */}
        
        {/* -1 Button */}
        <button
          {...decrement}
          className="w-8 h-8 md:w-10 md:h-10 bg-znr-elevated rounded-lg md:rounded-xl flex items-center justify-center text-znr-text-dim hover:bg-znr-hover transition-all active:scale-95 touch-manipulation"
        >
          <Minus size={16} />
        </button>
        
        {/* Score Display */}
        <div className="min-w-[45px] md:min-w-[60px] text-center text-lg md:text-2xl font-light text-znr-text">
          {currentScore}
        </div>
        
        {/* +1 Button */}
        <button
          {...increment}
          className="w-8 h-8 md:w-10 md:h-10 bg-znr-elevated rounded-lg md:rounded-xl flex items-center justify-center text-znr-text-dim hover:bg-znr-hover transition-all active:scale-95 touch-manipulation"
        >
          <Plus size={16} />
        </button>
        
        {/* +5 Button */}
        {/* <button
          {...increment5}
          className="w-7 h-7 md:w-8 md:h-8 bg-znr-elevated rounded-md flex items-center justify-center text-znr-text-dim hover:bg-znr-hover transition-all active:scale-95 touch-manipulation text-xs"
        >
          +5
        </button> */}
      </div>
    </div>
  );
};