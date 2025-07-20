import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Meeple } from './Meeple';

export interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (players: { name: string; color: string }[]) => void;
}

// Standard Carcassonne meeple colors
const MEEPLE_COLORS = [
  { value: '#5B9BD5', name: 'Blue' },
  { value: '#E85D75', name: 'Red' },
  { value: '#70AD47', name: 'Green' },
  { value: '#FFC000', name: 'Yellow' },
  { value: '#4A4A4A', name: 'Black' },
  { value: '#9966CC', name: 'Purple' }
];

export const GameSetupModal: React.FC<GameSetupModalProps> = ({ isOpen, onClose, onCreateGame }) => {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [playerColors, setPlayerColors] = useState<string[]>([MEEPLE_COLORS[0].value, MEEPLE_COLORS[1].value]);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Update colors array when players are added/removed
  useEffect(() => {
    const currentLength = playerColors.length;
    const targetLength = playerNames.length;
    
    if (targetLength > currentLength) {
      // Adding players - assign next available colors
      const newColors = [...playerColors];
      for (let i = currentLength; i < targetLength; i++) {
        const usedColors = new Set(newColors);
        const availableColor = MEEPLE_COLORS.find(color => !usedColors.has(color.value));
        newColors.push(availableColor?.value || MEEPLE_COLORS[i % MEEPLE_COLORS.length].value);
      }
      setPlayerColors(newColors);
    } else if (targetLength < currentLength) {
      // Removing players
      setPlayerColors(playerColors.slice(0, targetLength));
    }
  }, [playerNames.length, playerColors]);

  // Initialize refs array when playerNames length changes
  useEffect(() => {
    dropdownRefs.current = dropdownRefs.current.slice(0, playerNames.length);
  }, [playerNames.length]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen !== null) {
        const dropdownRef = dropdownRefs.current[dropdownOpen];
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          setDropdownOpen(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);
  
  const addPlayer = (): void => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, '']);
    }
  };
  
  const removePlayer = (index: number): void => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };
  
  const updatePlayerName = (index: number, name: string): void => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };
  
  const updatePlayerColor = (index: number, color: string): void => {
    const newColors = [...playerColors];
    newColors[index] = color;
    setPlayerColors(newColors);
  };
  
  const getAvailableColors = (currentIndex: number): typeof MEEPLE_COLORS => {
    const usedColors = new Set(playerColors.filter((_, i) => i !== currentIndex));
    return MEEPLE_COLORS.filter(color => !usedColors.has(color.value));
  };
  
  const handleSubmit = (): void => {
    const validPlayers = playerNames
      .map((name, index) => ({
        name: name?.trim(),
        color: playerColors[index]
      }));
      
    if (validPlayers.length >= 2) {
      onCreateGame(validPlayers);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[80] p-4">
      <div className="bg-znr-secondary border border-znr-border rounded-2xl p-4 md:p-6 max-w-md w-full">
        <h2 className="text-xl md:text-2xl font-light text-znr-text mb-4 md:mb-6 text-center">
          Create New Game
        </h2>
        
        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          {playerNames.map((name, index) => {
            const availableColors = getAvailableColors(index);
            const currentColor = MEEPLE_COLORS.find(c => c.value === playerColors[index]);
            
            return (
              <div key={index} className="flex gap-2 items-center">
                {/* Color Selection - available for all players */}
                <div 
                  ref={(el) => {
                    if (dropdownRefs.current) {
                      dropdownRefs.current[index] = el;
                    }
                  }}
                  className="flex-shrink-0 relative"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(`Clicked player ${index}, current dropdownOpen:`, dropdownOpen);
                      setDropdownOpen(dropdownOpen === index ? null : index);
                    }}
                    className="w-12 h-12 p-1 bg-znr-tertiary border border-znr-border rounded-xl hover:bg-znr-hover flex items-center justify-center focus:outline-none focus:border-znr-accent transition-colors"
                  >
                    <Meeple color={playerColors[index]} className="w-8 h-8" />
                  </button>

                  {dropdownOpen === index && (
                    <div className="absolute top-full left-0 mt-1 bg-znr-secondary border border-znr-border rounded-xl shadow-xl z-[100] min-w-[180px] overflow-hidden">
                      {availableColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            console.log(`Selected color ${color.name} for player ${index}`);
                            updatePlayerColor(index, color.value);
                            setDropdownOpen(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-znr-hover focus:bg-znr-hover focus:outline-none flex items-center gap-2 text-znr-text transition-colors"
                        >
                          <Meeple color={color.value} className="w-6 h-6" />
                          <span>{color.name}</span>
                        </button>
                      ))}
                      {/* Keep current selection even if it would normally be unavailable */}
                      {currentColor && !availableColors.find(c => c.value === currentColor.value) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            updatePlayerColor(index, currentColor.value);
                            setDropdownOpen(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-znr-hover focus:bg-znr-hover focus:outline-none flex items-center gap-2 text-znr-text transition-colors"
                        >
                          <Meeple color={currentColor.value} className="w-6 h-6" />
                          <span>{currentColor.name}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <input
                  type="text"
                  placeholder={`Player ${index + 1}`}
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="flex-1 bg-znr-tertiary border border-znr-border rounded-xl px-3 md:px-4 py-2 md:py-3 text-znr-text placeholder-znr-text-muted focus:outline-none focus:border-znr-accent text-base"
                />
                
                {playerNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="px-2 md:px-3 py-2 md:py-3 bg-znr-elevated rounded-xl text-znr-text hover:bg-znr-hover flex-shrink-0"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-2 md:gap-3 mb-4 md:mb-6">
          {playerNames.length < 6 && (
            <button
              type="button"
              onClick={addPlayer}
              className="flex-1 py-2 md:py-3 bg-znr-elevated rounded-xl text-znr-text hover:bg-znr-hover flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Plus size={16} /> Add Player
            </button>
          )}
        </div>
        
        <div className="flex gap-2 md:gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            // disabled={playerNames.filter(name => name.trim()).length < 2}
            className="flex-1 py-2 md:py-3 bg-gradient-to-r from-znr-accent-alt to-znr-accent rounded-xl text-znr-text-dark font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};