import React, { useState } from 'react';
import { AlertTriangle, Trophy } from 'lucide-react';
import Portal from '@/Portal';
import { loadGameStateFromURL } from '../gameStateUtils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  danger = false
}) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4">
        <div className="bg-znr-secondary border border-znr-border rounded-2xl w-full max-w-sm shadow-2xl">
          <div className="p-4 border-b border-znr-border ">
            <div className="flex items-center gap-3">
              {danger && <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />}
              <h3 className="text-lg font-semibold text-znr-text">{title}</h3>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-znr-text-muted leading-relaxed mb-6">
              {message}
            </p>
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="flex-1 bg-znr-tertiary hover:bg-znr-elevated rounded-lg px-3 py-2 text-sm text-znr-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${danger
                    ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300'
                    : 'bg-znr-accent hover:bg-znr-accent-alt text-white'
                  }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

interface EndGameDialogProps {
  isOpen: boolean;
  onConfirm: (playerWon?: boolean) => void;
  onCancel: () => void;
}

export const EndGameDialog: React.FC<EndGameDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  // Check if there's only one player
  const { gameState } = loadGameStateFromURL();
  const isSinglePlayer = gameState && gameState.players.length === 1;
  const playerName = isSinglePlayer ? gameState.players[0]?.getPlayerName() : '';

  // Set initial state based on single player mode
  const [playerWon, setPlayerWon] = useState<boolean | undefined>(() => 
    isSinglePlayer ? true : undefined
  );
  
  
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(isSinglePlayer ? playerWon : undefined);
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4">
        <div className="bg-znr-secondary border border-znr-border rounded-2xl w-full max-w-sm shadow-2xl">
          <div className="p-4 border-b border-znr-border">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-yellow-400 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-znr-text">End Game?</h3>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-znr-text-muted leading-relaxed mb-4">
              This will show the final game results and celebration. You can return to the game afterwards.
            </p>
            
            {isSinglePlayer && (
              <div className="mb-6 p-4 bg-gradient-to-br from-znr-tertiary to-znr-elevated rounded-md border border-znr-border">
                <div className="text-sm font-semibold text-znr-text mb-4 text-center">
                  How did {playerName} do?
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setPlayerWon(true)}
                    className={`w-full flex items-center gap-4 p-4 rounded-md text-left transition-all ${
                      playerWon
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-1 border-yellow-500/40 shadow-lg'
                        : 'bg-znr-secondary hover:bg-znr-elevated border border-znr-border'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                      playerWon 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg' 
                        : 'bg-znr-tertiary'
                    }`}>
                      <span className="text-lg">🏆</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-znr-text">Victory!</div>
                      <div className="text-xs text-znr-text-muted">Successfully completed the game</div>
                    </div>
                    {playerWon && (
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setPlayerWon(false)}
                    className={`w-full flex items-center gap-4 p-4 rounded-md text-left transition-all ${
                      playerWon === false
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-1 border-blue-500/40 shadow-lg'
                        : 'bg-znr-secondary hover:bg-znr-elevated border border-znr-border'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                      playerWon === false 
                        ? 'bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg' 
                        : 'bg-znr-tertiary'
                    }`}>
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-znr-text">Good Effort!</div>
                      <div className="text-xs text-znr-text-muted">Played well, try again next time</div>
                    </div>
                    {playerWon === false && (
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="flex-1 bg-znr-tertiary hover:bg-znr-elevated rounded-lg px-3 py-2 text-sm text-znr-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-znr-accent hover:bg-znr-accent-alt rounded-lg px-3 py-2 text-sm text-white transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};