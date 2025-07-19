import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (playerNames: string[]) => void;
}

export const GameSetupModal: React.FC<GameSetupModalProps> = ({ isOpen, onClose, onCreateGame }) => {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  
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
  
  const handleSubmit = (): void => {
    const validNames = playerNames.filter(name => name.trim());
    if (validNames.length >= 2) {
      onCreateGame(validNames);
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
          {playerNames.map((name, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder={`Player ${index + 1}`}
                value={name}
                onChange={(e) => updatePlayerName(index, e.target.value)}
                className="flex-1 bg-znr-tertiary border border-znr-border rounded-xl px-3 md:px-4 py-2 md:py-3 text-znr-text placeholder-znr-text-muted focus:outline-none focus:border-znr-accent text-sm md:text-base"
              />
              {playerNames.length > 2 && (
                <button
                  onClick={() => removePlayer(index)}
                  className="px-2 md:px-3 py-2 md:py-3 bg-znr-elevated rounded-xl text-znr-text hover:bg-znr-hover"
                >
                  <Minus size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 md:gap-3 mb-4 md:mb-6">
          {playerNames.length < 6 && (
            <button
              onClick={addPlayer}
              className="flex-1 py-2 md:py-3 bg-znr-elevated rounded-xl text-znr-text hover:bg-znr-hover flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Plus size={16} /> Add Player
            </button>
          )}
        </div>
        
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 md:py-3 bg-znr-elevated rounded-xl text-znr-text hover:bg-znr-hover text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={playerNames.filter(name => name.trim()).length < 2}
            className="flex-1 py-2 md:py-3 bg-gradient-to-r from-znr-accent-alt to-znr-accent rounded-xl text-znr-text-dark font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};