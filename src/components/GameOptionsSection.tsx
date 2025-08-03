import React, { useState } from 'react';
import { RotateCcw, Plus, Trophy } from 'lucide-react';
import { ConfirmDialog, EndGameDialog } from './ConfirmDialog';

interface GameOptionsSectionProps {
  onRestartGame: () => void;
  onNewGame: () => void;
  onEndGame: (playerWon?: boolean) => void; 
}

export const GameOptionsSection: React.FC<GameOptionsSectionProps> = ({
  onRestartGame,
  onNewGame,
  onEndGame
}) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'restart' | 'new' | null;
  }>({ isOpen: false, type: null });
  const [endGameDialog, setEndGameDialog] = useState(false);

  const handleRestartGame = () => {
    setConfirmDialog({ isOpen: true, type: 'restart' });
  };

  const handleNewGame = () => {
    setConfirmDialog({ isOpen: true, type: 'new' });
  };

  const handleEndGame = () => {
    setEndGameDialog(true);
  };

  const confirmAction = () => {
    if (confirmDialog.type === 'restart') {
      onRestartGame();
    } else if (confirmDialog.type === 'new') {
      onNewGame();
    }
    setConfirmDialog({ isOpen: false, type: null });
  };

  const cancelAction = () => {
    setConfirmDialog({ isOpen: false, type: null });
  };

  const handleEndGameConfirm = (playerWon?: boolean) => {
    onEndGame(playerWon);
    setEndGameDialog(false);
  };

  const handleEndGameCancel = () => {
    setEndGameDialog(false);
  };

  return (
    <>
      <div className="bg-znr-secondary rounded-xl md:rounded-2xl overflow-hidden shadow-xl mt-3 md:mt-4">
        <div className="p-3 md:p-5 bg-znr-tertiary">
          <div className="text-xs md:text-sm uppercase tracking-wide text-znr-text-dim">
            Game Options
          </div>
        </div>

        <div className="p-3 md:p-4 space-y-2">
          {/* End Game Button */}
          <button
            onClick={handleEndGame}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-xl text-left transition-all"
          >
            <div className="w-8 h-8 bg-yellow-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Trophy size={16} className="text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-znr-text">End Game</div>
              <div className="text-xs text-znr-text-muted">
                Show final results and celebration
              </div>
            </div>
          </button>

          {/* Restart Game Button */}
          <button
            onClick={handleRestartGame}
            className="w-full flex items-center gap-3 p-3 bg-znr-tertiary hover:bg-znr-elevated rounded-xl text-left transition-colors"
          >
            <div className="w-8 h-8 bg-amber-500/70 rounded-lg flex items-center justify-center flex-shrink-0">
              <RotateCcw size={16} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-znr-text">Restart Game</div>
              <div className="text-xs text-znr-text-muted">
                Reset scores but keep current players
              </div>
            </div>
          </button>

          {/* New Game Button */}
          <button
            onClick={handleNewGame}
            className="w-full flex items-center gap-3 p-3 bg-znr-tertiary hover:bg-znr-elevated rounded-xl text-left transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Plus size={16} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-znr-text">New Game</div>
              <div className="text-xs text-znr-text-muted">
                Start fresh with new player setup
              </div>
            </div>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.type === 'restart' ? 'Restart Game?' : 'Start New Game?'
        }
        message={
          confirmDialog.type === 'restart'
            ? 'This will reset all scores to zero but keep the current players. This action cannot be undone.'
            : 'This will end the current game and return to player setup. All progress will be lost.'
        }
        confirmText={
          confirmDialog.type === 'restart' ? 'Restart' : 'New Game'
        }
        onConfirm={confirmAction}
        onCancel={cancelAction}
        danger={true}
      />

      <EndGameDialog
        isOpen={endGameDialog}
        onConfirm={handleEndGameConfirm}
        onCancel={handleEndGameCancel}
      />
    </>
  );
};