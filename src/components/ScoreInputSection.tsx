import React from 'react';
import { PointEntrySection } from './PointEntrySection';
import { CategorySelectionSection } from './CategorySelectionSection';
import { TurnSummarySection } from './TurnSummarySection';
import type { GameState, ScoreCategories, TurnEntry } from '../types';

interface ScoreInputSectionProps {
  currentPoints: number;
  selectedCategory: keyof ScoreCategories | 'other';
  turnEntries: TurnEntry[];
  turnTotal: number;
  activePlayerName: string;
  gameState: GameState;
  onUpdatePoints: (delta: number) => void;
  onSetPoints: (points: number) => void;
  onSelectCategory: (category: keyof ScoreCategories | 'other') => void;
  onAddToTurn: () => void;
  onRemoveFromTurn: (entryId: string) => void;
  onFinishTurn: () => void;
}

export const ScoreInputSection: React.FC<ScoreInputSectionProps> = ({
  currentPoints,
  selectedCategory,
  turnEntries,
  turnTotal,
  activePlayerName,
  gameState,
  onUpdatePoints,
  onSetPoints,
  onSelectCategory,
  onAddToTurn,
  onRemoveFromTurn,
  onFinishTurn
}) => {
  const canAddToTurn = currentPoints !== 0;

  return (
    <div className="bg-znr-secondary rounded-xl md:rounded-2xl p-3 md:p-6 mb-3 md:mb-4 shadow-xl select-none">
      {/* Point Entry */}
      <PointEntrySection
        currentPoints={currentPoints}
        onUpdatePoints={onUpdatePoints}
        onSetPoints={onSetPoints}
        gameState={gameState}
      />

      {/* Category Selection */}
      <CategorySelectionSection
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Add to Turn Button */}
      <button
        onClick={onAddToTurn}
        disabled={!canAddToTurn}
        className={`w-full py-3 rounded-lg font-semibold text-sm md:text-base transition-colors touch-manipulation mb-4 ${
          canAddToTurn
            ? 'bg-znr-elevated text-znr-text hover:bg-znr-hover'
            : 'bg-znr-elevated text-znr-text-muted cursor-not-allowed opacity-50'
        }`}
      >
        Add to Turn
      </button>

      {/* Turn Summary */}
      <TurnSummarySection
        entries={turnEntries}
        turnTotal={turnTotal}
        onRemoveEntry={onRemoveFromTurn}
      />

      {/* Finish Turn Button - Always available */}
      <button
        onClick={onFinishTurn}
        className="w-full py-4 md:py-5 rounded-lg md:rounded-2xl font-semibold text-sm md:text-base uppercase tracking-wide transition-all touch-manipulation bg-gradient-to-r from-znr-accent-alt to-znr-accent text-znr-text shadow-lg hover:shadow-xl hover:-translate-y-1"
      >
        Finish {activePlayerName}'s Turn
      </button>
    </div>
  );
};