import React, { useState, useRef, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import Portal from '@/Portal';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showEditModal && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [showEditModal]);

  const handleEditClick = () => {
    setInputValue(''); // Start with empty input
    setShowEditModal(true);
  };

  const handleModalSave = () => {
    const newPoints = parseInt(inputValue, 10);
    if (!isNaN(newPoints)) {
      onSetPoints(newPoints);
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
      <div className="bg-znr-tertiary rounded-xl p-4 md:p-5 mb-4">
        <div className="text-center mb-4">
          <div className="text-xs uppercase tracking-wide text-znr-text-muted mb-2">
            Points to Add
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="text-4xl md:text-5xl font-extralight text-znr-text-accent">
              {currentPoints}
            </div>
            <button
              onClick={handleEditClick}
              className="w-8 h-8 md:w-9 md:h-9 bg-znr-elevated rounded-lg flex items-center justify-center text-znr-text-muted hover:text-znr-text hover:bg-znr-hover transition-colors touch-manipulation"
            >
              <Edit3 size={14} />
            </button>
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

      {/* Edit Modal */}
      {showEditModal && (
        <Portal>
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[90] p-4 select-none">
            <div className="bg-znr-secondary border border-znr-border rounded-2xl p-6 max-w-xs w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-znr-accent-alt rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
                  ➕
                </div>
                <h3 className="text-xl font-light text-znr-text mb-1">Edit Points</h3>
              </div>
              
              <div className="mb-6">
                <input
                  ref={inputRef}
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full text-center text-3xl font-light bg-znr-elevated border border-znr-border rounded-xl px-4 py-3 text-znr-text focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent focus:placeholder-transparent transition-all"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleModalCancel}
                  className="flex-1 py-3 bg-znr-elevated rounded-xl text-znr-text hover:bg-znr-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSave}
                  className="flex-1 py-3 bg-gradient-to-r from-znr-accent-alt to-znr-accent rounded-xl text-znr-text-dark font-semibold transition-colors hover:shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};