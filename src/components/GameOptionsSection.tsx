import React, { useState } from 'react';
import { RotateCcw, Plus, Trophy, AlertTriangle } from 'lucide-react';
import Portal from '@/Portal';

interface GameOptionsSectionProps {
  onRestartGame: () => void;
  onNewGame: () => void;
  onEndGame: () => void;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
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
          <div className="p-4 border-b border-znr-border">
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

export const GameOptionsSection: React.FC<GameOptionsSectionProps> = ({
  onRestartGame,
  onNewGame,
  onEndGame
}) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'restart' | 'new' | 'end' | null;
  }>({ isOpen: false, type: null });

  const handleRestartGame = () => {
    setConfirmDialog({ isOpen: true, type: 'restart' });
  };

  const handleNewGame = () => {
    setConfirmDialog({ isOpen: true, type: 'new' });
  };

  const handleEndGame = () => {
    setConfirmDialog({ isOpen: true, type: 'end' });
  };

  const confirmAction = () => {
    if (confirmDialog.type === 'restart') {
      onRestartGame();
    } else if (confirmDialog.type === 'new') {
      onNewGame();
    } else if (confirmDialog.type === 'end') {
      onEndGame();
    }
    setConfirmDialog({ isOpen: false, type: null });
  };

  const cancelAction = () => {
    setConfirmDialog({ isOpen: false, type: null });
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
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
          confirmDialog.type === 'restart' ? 'Restart Game?' :
            confirmDialog.type === 'new' ? 'Start New Game?' :
              'End Game?'
        }
        message={
          confirmDialog.type === 'restart'
            ? 'This will reset all scores to zero but keep the current players. This action cannot be undone.'
            : confirmDialog.type === 'new'
              ? 'This will end the current game and return to player setup. All progress will be lost.'
              : 'This will show the final game results and celebration. You can return to the game afterwards.'
        }
        confirmText={
          confirmDialog.type === 'restart' ? 'Restart' :
            confirmDialog.type === 'new' ? 'New Game' :
              'Show Results'
        }
        onConfirm={confirmAction}
        onCancel={cancelAction}
        danger={confirmDialog.type !== 'end'}
      />
    </>
  );
};