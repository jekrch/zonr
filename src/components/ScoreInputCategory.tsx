import React from 'react';
import { ScoreControl } from './ScoreControl';
import type { ScoreCategories, ScoreCategory } from '../types';

interface ScoreInputCategoryProps {
  category: ScoreCategory;
  currentScore: number;
  onUpdateScore: (category: keyof ScoreCategories, delta: number) => void;
  onSetScore?: (category: keyof ScoreCategories, score: number) => void;
}

export const ScoreInputCategory: React.FC<ScoreInputCategoryProps> = ({
  category,
  currentScore,
  onUpdateScore,
  onSetScore
}) => {
  return (
    <ScoreControl
      category={category}
      currentScore={currentScore}
      onUpdateScore={onUpdateScore}
      onSetScore={onSetScore}
      variant="main"
      allowManualInput={!!onSetScore}
    />
  );
};