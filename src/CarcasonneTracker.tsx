import React, { useState } from 'react';
import { SettingsButton } from './components/SettingsModal';
import { GameSetupModal } from './components/GameSetupModal';
import { EditScoreModal } from './components/EditScoreModal';
import { GameLayout } from './components/GameLayout';
import { useGameState } from './hooks/useGameState';
import type { ScoreCategories, ScoreEntry } from './types';

const CarcassonneTracker: React.FC = () => {
  const {
    gameState,
    showSetup,
    setShowSetup,
    createGame,
    updateCurrentScore,
    getCurrentTotal,
    addScore,
    selectPlayer,
    saveEditedScore,
    restartGame, 
    startNewGame
  } = useGameState();

  const [editingEntry, setEditingEntry] = useState<ScoreEntry | null>(null);

  const handleEditScore = (entry: ScoreEntry): void => {
    setEditingEntry(entry);
  };

  const handleSaveEditedScore = (newScores: ScoreCategories, newTotal: number): void => {
    saveEditedScore(editingEntry, newScores, newTotal);
    setEditingEntry(null);
  };

  const handleCreateGame = (players: { name: string; color: string }[]): void => {
    createGame(players);
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-znr-primary flex items-center justify-center">
        <SettingsButton 
          onRestartGame={restartGame}
          onNewGame={startNewGame}
        />
        <GameSetupModal
          isOpen={showSetup}
          onClose={() => setShowSetup(false)}
          onCreateGame={handleCreateGame}
        />
      </div>
    );
  }

  return (
    <>
      <SettingsButton 
        onRestartGame={restartGame}
        onNewGame={startNewGame}
      />
      <GameLayout
        gameState={gameState}
        onUpdateScore={updateCurrentScore}
        onAddScore={addScore}
        onSelectPlayer={selectPlayer}
        onEditScore={handleEditScore}
        getCurrentTotal={getCurrentTotal}
      />
      <EditScoreModal
        isOpen={editingEntry !== null}
        onClose={() => setEditingEntry(null)}
        onSave={handleSaveEditedScore}
        entry={editingEntry}
      />
    </>
  );
};

export default CarcassonneTracker;