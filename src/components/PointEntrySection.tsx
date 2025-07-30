import React, { useState, useEffect, useRef } from 'react';
import { Edit3, StepBack as Backspace, Check, X } from 'lucide-react';
import type { GameState } from '@/types';
import { Meeple } from '../components/Meeple';

interface PointEntrySectionProps {
  gameState: GameState;
  currentPoints: number;
  onUpdatePoints: (delta: number) => void;
  onSetPoints: (points: number) => void;
}

export const PointEntrySection: React.FC<PointEntrySectionProps> = ({
  currentPoints,
  onUpdatePoints,
  onSetPoints,
  gameState
}) => {
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Animation state for meeple transitions
  const [displayColor, setDisplayColor] = useState(gameState?.getActivePlayer()?.color);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontColor, setFrontColor] = useState(gameState?.getActivePlayer()?.color);
  const [backColor, setBackColor] = useState(gameState?.getActivePlayer()?.color);

  const activePlayerColor = gameState?.getActivePlayer()?.color;
  const lastColorRef = useRef(activePlayerColor);

  // Handle meeple color changes with flip animation
  useEffect(() => {
    // Only animate if color actually changed
    if (activePlayerColor && activePlayerColor !== lastColorRef.current) {
      lastColorRef.current = activePlayerColor;
      
      // Don't start new animation if already flipping
      if (isFlipping) return;
      
      // Set up the new color on the back face
      if (isFlipped) {
        setFrontColor(activePlayerColor);
      } else {
        setBackColor(activePlayerColor);
      }
      
      // Start the flip
      setIsFlipping(true);
      
      setTimeout(() => {
        // Flip the card and update display color
        setDisplayColor(activePlayerColor);
        setIsFlipped(prev => !prev);
        
        // End flip animation
        setTimeout(() => {
          setIsFlipping(false);
        }, 300);
      }, 150);
    }
  }, [activePlayerColor]);

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
          {/* Header with integrated meeple */}
          <div className="relative mb-2">
            <div className="flex items-center justify-center gap-2">
               {/* Left Meeple with 3D Card Flip */}
               <div 
                 className="mr-2"
                 style={{ perspective: '200px' }}
               >
                 <div
                   className={`relative w-6 h-6 transition-all duration-500 ease-out ${
                     isFlipping ? 'scale-110' : 'scale-100'
                   }`}
                   style={{
                     transformStyle: 'preserve-3d',
                     transform: `rotateY(${
                       (isFlipped ? 180 : 0) + (isFlipping ? 180 : 0)
                     }deg) ${isFlipping ? 'rotateY(-10deg) translateY(-2px)' : 'translateY(0px)'}`,
                     transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                   }}
                 >
                   {/* Front face */}
                   <div
                     className="absolute inset-0"
                     style={{
                       backfaceVisibility: 'hidden',
                       transform: 'rotateY(0deg)'
                     }}
                   >
                     <Meeple 
                       color={frontColor} 
                       className="-rotate-15 w-6 h-6 opacity-70" 
                     />
                   </div>
                   
                   {/* Back face */}
                   <div
                     className="absolute inset-0"
                     style={{
                       backfaceVisibility: 'hidden',
                       transform: 'rotateY(180deg)'
                     }}
                   >
                     <Meeple 
                       color={backColor} 
                       className="-rotate-15 w-6 h-6 opacity-70" 
                     />
                   </div>
                 </div>
               </div>

              <div className="text-xs uppercase tracking-wide text-znr-text-muted">
                Points to Add
              </div>

              {/* Right Meeple with 3D Card Flip */}
              {displayColor && (
                <div 
                  className="ml-2"
                  style={{ perspective: '200px' }}
                >
                  <div
                    className={`relative w-6 h-6 transition-all duration-500 ease-out ${
                      isFlipping ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${
                        (isFlipped ? 180 : 0) + (isFlipping ? 180 : 0)
                      }deg) ${isFlipping ? 'rotateY(10deg) translateY(-2px)' : 'translateY(0px)'}`,
                      transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                    }}
                  >
                    {/* Front face */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)'
                      }}
                    >
                      <Meeple 
                        color={frontColor} 
                        className="rotate-15 w-6 h-6 opacity-70" 
                      />
                    </div>
                    
                    {/* Back face */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <Meeple 
                        color={backColor} 
                        className="rotate-15 w-6 h-6 opacity-70" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
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
            showNumberPad ? 'max-h-96 opacity-100 mb-6 ' : 'max-h-0 opacity-0'
          }`}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div className="bg-znr-elevated rounded-xl p-3 border border-[var(--znr-text-dim)]/10 shadow-lg backdrop-blur-sm">
            {/* Number Grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  className="h-10 bg-znr-tertiary border border-znr-border rounded-lg text-znr-text font-medium transition-all touch-manipulation text-sm active:!bg-[var(--znr-secondary)] hover:!bg-[var(--znr-secondary)]/80"
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
                className="h-10 bg-znr-tertiary border border-znr-border rounded-lg text-znr-text font-medium hover:bg-znr-hover hover:border-znr-accent/30 transition-all  touch-manipulation text-sm"
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