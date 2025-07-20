import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Edit3 } from 'lucide-react';
import { useHoldButton } from '../hooks/useHoldButton';
import type { ScoreCategories, ScoreCategory } from '../types';

interface ScoreControlProps {
  category: ScoreCategory;
  currentScore: number;
  onUpdateScore: (category: keyof ScoreCategories, delta: number) => void;
  onSetScore?: (category: keyof ScoreCategories, score: number) => void;
  variant?: 'main' | 'modal';
  allowManualInput?: boolean;
}

export const ScoreControl: React.FC<ScoreControlProps> = ({
  category,
  currentScore,
  onUpdateScore,
  onSetScore,
  variant = 'main',
  allowManualInput = false
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const increment = useHoldButton(() => onUpdateScore(category.key, 1));
  const decrement = useHoldButton(() => onUpdateScore(category.key, -1));

  // Style variants
  const isMain = variant === 'main';
  const buttonSize = isMain ? 'w-8 h-8 md:w-10 md:h-10' : 'w-7 h-7 md:w-8 md:h-8';
  const editButtonSize = isMain ? 'w-7 h-7 md:w-9 md:h-9' : 'w-6 h-6 md:w-7 md:h-7';
  const scoreWidth = isMain ? 'min-w-[45px] md:min-w-[60px]' : 'min-w-[35px] md:min-w-[40px]';
  const textSize = isMain ? 'text-lg md:text-2xl' : 'text-base md:text-lg';
  const containerPadding = isMain ? 'p-2 md:p-3' : 'p-2 md:p-3';
  const containerRounding = isMain ? 'rounded-lg md:rounded-xl' : 'rounded-xl';

  useEffect(() => {
    if (showEditModal && inputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [showEditModal]);

  const handleEditClick = () => {
    if (!allowManualInput || !onSetScore) return;
    setInputValue(currentScore.toString());
    setShowEditModal(true);
  };

  const handleModalSave = () => {
    const newScore = parseInt(inputValue, 10);
    if (!isNaN(newScore) && newScore >= 0 && onSetScore) {
      onSetScore(category.key, newScore);
    }
    setShowEditModal(false);
  };

  const handleModalCancel = () => {
    setShowEditModal(false);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleModalSave();
    } else if (e.key === 'Escape') {
      handleModalCancel();
    }
  };

  return (
    <>
      <div className={`flex items-center justify-between mb-3 md:mb-4 ${containerPadding} bg-znr-tertiary ${containerRounding} hover:bg-znr-elevated transition-colors last:mb-0`}>
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          {isMain && (
            <div className="w-8 h-8 md:w-10 md:h-10 bg-znr-accent-alt rounded-md md:rounded-lg flex items-center justify-center text-base md:text-xl shadow-inner flex-shrink-0">
              {category.icon}
            </div>
          )}
          {!isMain && (
            <span className="text-base md:text-lg flex-shrink-0">{category.icon}</span>
          )}
          <span className={`${isMain ? 'text-sm md:text-lg' : 'text-sm md:text-base'} text-znr-text-dim ${isMain ? 'font-medium' : ''} truncate max-w-[80px] sm:max-w-none`}>
            {category.label}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Edit Button (only show if manual input is allowed) */}
          {allowManualInput && (
            <button
              onClick={handleEditClick}
              className={`${editButtonSize} bg-znr-elevated rounded-lg flex items-center justify-center text-znr-text-muted hover:text-znr-text hover:bg-znr-hover transition-all active:scale-95 touch-manipulation`}
            >
              <Edit3 size={12} />
            </button>
          )}
          
          {/* Decrement Button */}
          <button
            {...decrement}
            className={`${buttonSize} bg-znr-elevated ${isMain ? 'rounded-lg md:rounded-xl' : 'rounded-lg'} flex items-center justify-center text-znr-text-dim hover:bg-znr-hover transition-all active:scale-95 touch-manipulation`}
          >
            <Minus size={16} />
          </button>
          
          {/* Score Display */}
          <div className={`${scoreWidth} text-center ${textSize} font-light text-znr-text`}>
            {currentScore}
          </div>
          
          {/* Increment Button */}
          <button
            {...increment}
            className={`${buttonSize} bg-znr-elevated ${isMain ? 'rounded-lg md:rounded-xl' : 'rounded-lg'} flex items-center justify-center text-znr-text-dim hover:bg-znr-hover transition-all active:scale-95 touch-manipulation`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[90] p-4 select-none">
          <div className="bg-znr-secondary border border-znr-border rounded-2xl p-6 max-w-xs w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-znr-accent-alt rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
                {category.icon}
              </div>
              <h3 className="text-xl font-light text-znr-text mb-1">Edit {category.label}</h3>
              {/* <p className="text-sm text-znr-text-muted">Enter the new score</p> */}
            </div>
            
            <div className="mb-6">
              <input
                ref={inputRef}
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-center text-3xl font-light bg-znr-elevated border border-znr-border rounded-xl px-4 py-3 text-znr-text focus:outline-none focus:ring-2 focus:ring-znr-accent focus:border-transparent transition-all"
                min="0"
                placeholder="0"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleModalCancel}
                className="flex-1 py-3 bg-znr-elevated rounded-xl text-znr-text hover:bg-znr-hover transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="flex-1 py-3 bg-gradient-to-r from-znr-accent-alt to-znr-accent rounded-xl text-znr-text-dark font-semibold transition-all hover:shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};