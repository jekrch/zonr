import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ScoreControl } from './ScoreControl';
import type { ScoreCategories, ScoreEntry, ScoreCategory } from '../types';
import Portal from '@/Portal';

export interface EditScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scores: ScoreCategories, total: number) => void;
  entry: ScoreEntry | null;
}

export const EditScoreModal: React.FC<EditScoreModalProps> = ({ isOpen, onClose, onSave, entry }) => {
  const [editScores, setEditScores] = useState<ScoreCategories>({
    roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0
  });

  const updateScore = (category: keyof ScoreCategories, delta: number): void => {
    setEditScores(prev => ({
      ...prev,
      [category]: Math.max(0, prev[category] + delta)
    }));
  };

  const setScore = (category: keyof ScoreCategories, score: number): void => {
    setEditScores(prev => ({
      ...prev,
      [category]: Math.max(0, score)
    }));
  };

  useEffect(() => {
    if (entry) {
      setEditScores({
        roads: entry.scores.roads || 0,
        cities: entry.scores.cities || 0,
        monasteries: entry.scores.monasteries || 0,
        fields: entry.scores.fields || 0,
        other: entry.scores.other || 0
      });
    }
  }, [entry]);

  const getTotal = (): number => {
    return Object.values(editScores).reduce((sum, score) => sum + score, 0);
  };

  const handleSave = (): void => {
    onSave(editScores, getTotal());
    onClose();
  };

  const scoreCategories: ScoreCategory[] = [
    { key: 'roads', label: 'Roads', icon: '🛤️' },
    { key: 'cities', label: 'Cities', icon: '🏰' },
    { key: 'monasteries', label: 'Monasteries', icon: '⛪' },
    { key: 'fields', label: 'Fields', icon: '🌾' },
    { key: 'other', label: 'Any', icon: '➕' }
  ];

  if (!isOpen || !entry) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[80] p-4 select-none">
        <div className="bg-znr-secondary border border-znr-border rounded-2xl p-4 md:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto znr-scroll-enhanced">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-light text-znr-text">Edit Turn {entry.turn}</h2>
            <button onClick={onClose} className="text-znr-text-muted hover:text-znr-text">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            {scoreCategories.map(category => (
              <ScoreControl
                key={category.key}
                category={category}
                currentScore={editScores[category.key]}
                onUpdateScore={updateScore}
                onSetScore={setScore}
                variant="modal"
                allowManualInput={true}
              />
            ))}
          </div>

          <div className="text-center mb-4 md:mb-6">
            <div className="text-xs md:text-sm text-znr-text-muted mb-1">New Total</div>
            <div className="text-2xl md:text-3xl font-light text-znr-text-accent">{getTotal()}</div>
          </div>

          <div className="flex gap-2 md:gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 md:py-3 bg-znr-elevated rounded-xl text-znr-text hover:bg-znr-hover text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 md:py-3 bg-gradient-to-r from-znr-accent-alt to-znr-accent rounded-xl text-znr-text-dark font-semibold text-sm md:text-base"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};