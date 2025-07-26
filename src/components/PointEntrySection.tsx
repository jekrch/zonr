import React, { useState, useRef, useEffect } from 'react';
import { Edit3, StepBack as Backspace, Check, X } from 'lucide-react';

interface PointEntrySectionProps {
  currentPoints: number;
  onUpdatePoints: (delta: number) => void;
  onSetPoints: (points: number) => void;
}

export const PointEntrySection: React.FC<PointEntrySectionProps> = ({
  currentPoints,
  onUpdatePoints,
  onSetPoints
}) => {
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleEditClick = () => {
    setInputValue('');
    setShowNumberPad(true);
  };

  const handleNumberClick = (num: string) => {
    if (inputValue.length < 6) { // Limit to 6 digits
      setInputValue(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleSubmit = () => {
    const newPoints = parseInt(inputValue, 10);
    if (!isNaN(newPoints)) {
      onSetPoints(newPoints);
    }
    setShowNumberPad(false);
    setInputValue('');
  };

  const handleCancel = () => {
    setShowNumberPad(false);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-znr-tertiary rounded-xl p-4 md:p-5 mb-4">
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-wide text-znr-text-muted mb-2">
          Points to Add
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="text-4xl md:text-5xl font-extralight text-znr-text-accent">
            {showNumberPad ? (inputValue || '0') : currentPoints}
          </div>
          <button
            onClick={handleEditClick}
            className="w-8 h-8 md:w-9 md:h-9 bg-znr-elevated rounded-lg flex items-center justify-center text-znr-text-muted hover:text-znr-text hover:bg-znr-hover transition-colors touch-manipulation"
          >
            <Edit3 size={14} />
          </button>
        </div>
      </div>

      {/* Expanding Number Pad */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          showNumberPad ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
        }`}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="bg-znr-elevated rounded-xl p-3 border border-[var(--znr-text-dim)]/40 shadow-lg backdrop-blur-sm">
          {/* Number Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-10 bg-znr-secondary border border-znr-border rounded-lg text-znr-text font-medium hover:bg-znr-hover hover:border-znr-accent/30 transition-all  touch-manipulation text-sm"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Bottom Row: 0, Backspace, Clear */}
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            <button
              onClick={handleClear}
              className="h-10 bg-znr-secondary border border-znr-border rounded-lg text-znr-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 transition-all  touch-manipulation text-xs font-medium"
            >
              Clear
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-10 bg-znr-secondary border border-znr-border rounded-lg text-znr-text font-medium hover:bg-znr-hover hover:border-znr-accent/30 transition-all  touch-manipulation text-sm"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-10 bg-znr-secondary border border-znr-border rounded-lg text-znr-text-muted hover:bg-znr-hover hover:border-znr-accent/30 transition-all  touch-manipulation flex items-center justify-center"
            >
              <Backspace size={14} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleCancel}
              className="h-10 bg-znr-secondary border border-znr-border rounded-lg text-znr-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 transition-all  touch-manipulation flex items-center justify-center gap-1.5 font-medium text-xs"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!inputValue}
              className="h-10 bg-gradient-to-r from-znr-accent-alt to-znr-accent rounded-lg text-znr-text font-semibold transition-all  touch-manipulation flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg disabled:hover:shadow-none text-xs"
            >
              <Check size={14} />
              Set
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => onUpdatePoints(-10)}
          className="flex-1 py-3 bg-znr-elevated rounded-lg text-znr-text hover:bg-red-500/20 hover:text-red-400 transition-colors touch-manipulation font-semibold text-sm md:text-base"
        >
          -10
        </button>
        <button
          onClick={() => onUpdatePoints(-1)}
          className="flex-1 py-3 bg-znr-elevated rounded-lg text-znr-text hover:bg-red-500/20 hover:text-red-400 transition-colors touch-manipulation font-semibold text-sm md:text-base"
        >
          -1
        </button>
        <button
          onClick={() => onUpdatePoints(1)}
          className="flex-1 py-3 bg-znr-elevated rounded-lg text-znr-text hover:bg-znr-accent/20 hover:text-znr-accent transition-colors touch-manipulation font-semibold text-sm md:text-base"
        >
          +1
        </button>
        <button
          onClick={() => onUpdatePoints(10)}
          className="flex-1 py-3 bg-znr-elevated rounded-lg text-znr-text hover:bg-znr-accent/20 hover:text-znr-accent transition-colors touch-manipulation font-semibold text-sm md:text-base"
        >
          +10
        </button>
      </div>
    </div>
  );
};