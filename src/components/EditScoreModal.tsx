import React, { useState, useEffect } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { useHoldButton } from '../hooks/useHoldButton';
import type { ScoreCategories, ScoreEntry, ScoreCategory } from '../types';

export interface EditScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scores: ScoreCategories, total: number) => void;
  entry: ScoreEntry | null;
}

export const EditScoreModal: React.FC<EditScoreModalProps> = ({ isOpen, onClose, onSave, entry }) => {
  const [editScores, setEditScores] = useState<ScoreCategories>({
    roads: 0, cities: 0, monasteries: 0, fields: 0
  });

  const updateScore = (category: keyof ScoreCategories, delta: number): void => {
    setEditScores(prev => ({
      ...prev,
      [category]: Math.max(0, prev[category] + delta)
    }));
  };

  // Pre-create all hold button handlers at the top level
  const roadsIncrement = useHoldButton(() => updateScore('roads', 1));
  const roadsIncrement5 = useHoldButton(() => updateScore('roads', 5));
  const roadsDecrement = useHoldButton(() => updateScore('roads', -1));
  const roadsDecrement5 = useHoldButton(() => updateScore('roads', -5));

  const citiesIncrement = useHoldButton(() => updateScore('cities', 1));
  const citiesIncrement5 = useHoldButton(() => updateScore('cities', 5));
  const citiesDecrement = useHoldButton(() => updateScore('cities', -1));
  const citiesDecrement5 = useHoldButton(() => updateScore('cities', -5));

  const monasteriesIncrement = useHoldButton(() => updateScore('monasteries', 1));
  const monasteriesIncrement5 = useHoldButton(() => updateScore('monasteries', 5));
  const monasteriesDecrement = useHoldButton(() => updateScore('monasteries', -1));
  const monasteriesDecrement5 = useHoldButton(() => updateScore('monasteries', -5));

  const fieldsIncrement = useHoldButton(() => updateScore('fields', 1));
  const fieldsIncrement5 = useHoldButton(() => updateScore('fields', 5));
  const fieldsDecrement = useHoldButton(() => updateScore('fields', -1));
  const fieldsDecrement5 = useHoldButton(() => updateScore('fields', -5));

  // Create a lookup object for the handlers
  const holdButtonHandlers = {
    roads: {
      increment: roadsIncrement,
      increment5: roadsIncrement5,
      decrement: roadsDecrement,
      decrement5: roadsDecrement5
    },
    cities: {
      increment: citiesIncrement,
      increment5: citiesIncrement5,
      decrement: citiesDecrement,
      decrement5: citiesDecrement5
    },
    monasteries: {
      increment: monasteriesIncrement,
      increment5: monasteriesIncrement5,
      decrement: monasteriesDecrement,
      decrement5: monasteriesDecrement5
    },
    fields: {
      increment: fieldsIncrement,
      increment5: fieldsIncrement5,
      decrement: fieldsDecrement,
      decrement5: fieldsDecrement5
    }
  };

  useEffect(() => {
    if (entry) {
      setEditScores(entry.scores);
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
    { key: 'fields', label: 'Fields', icon: '🌾' }
  ];

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[80] p-4 select-none">
      <div className="bg-znr-secondary border border-znr-border rounded-2xl p-4 md:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto znr-scroll-enhanced">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-light text-znr-text">Edit Turn {entry.turn}</h2>
          <button onClick={onClose} className="text-znr-text-muted hover:text-znr-text">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
          {scoreCategories.map(category => {
            const handlers = holdButtonHandlers[category.key];
            return (
              <div key={category.key} className="flex items-center justify-between p-2 md:p-3 bg-znr-tertiary rounded-xl">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <span className="text-base md:text-lg flex-shrink-0">{category.icon}</span>
                  <span className="text-sm md:text-base text-znr-text-dim truncate max-w-[80px] sm:max-w-none">{category.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {/* -5 Button */}
                  <button
                    {...handlers.decrement5}
                    className="w-6 h-6 md:w-7 md:h-7 bg-znr-elevated rounded-lg flex items-center justify-center text-znr-text-dim hover:bg-znr-hover text-xs"
                  >
                    -5
                  </button>
                  {/* -1 Button */}
                  <button
                    {...handlers.decrement}
                    className="w-7 h-7 md:w-8 md:h-8 bg-znr-elevated rounded-lg flex items-center justify-center text-znr-text-dim hover:bg-znr-hover"
                  >
                    <Minus size={14} />
                  </button>
                  {/* Score Display */}
                  <div className="min-w-[35px] md:min-w-[40px] text-center text-base md:text-lg text-znr-text">
                    {editScores[category.key]}
                  </div>
                  {/* +1 Button */}
                  <button
                    {...handlers.increment}
                    className="w-7 h-7 md:w-8 md:h-8 bg-znr-elevated rounded-lg flex items-center justify-center text-znr-text-dim hover:bg-znr-hover"
                  >
                    <Plus size={16} />
                  </button>
                  {/* +5 Button */}
                  <button
                    {...handlers.increment5}
                    className="w-6 h-6 md:w-7 md:h-7 bg-znr-elevated rounded-lg flex items-center justify-center text-znr-text-dim hover:bg-znr-hover text-xs"
                  >
                    +5
                  </button>
                </div>
              </div>
            );
          })}
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
  );
};