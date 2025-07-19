import React, { useState, useEffect } from 'react';
import { SettingsButton } from './components/SettingsModal';
import { GameSetupModal } from './components/GameSetupModal';
import { EditScoreModal } from './components/EditScoreModal';
import { EndGameModal } from './components/EndGameModal';
import { GameLayout } from './components/GameLayout';
import { useGameState } from './hooks/useGameState';
import { loadGameStateFromURL, setEndGameInURL } from './gameStateUtils';
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
  const [showEndGame, setShowEndGame] = useState(false);

  // Check URL for endGame parameter on mount and when URL changes
  useEffect(() => {
    const checkEndGameFromURL = () => {
      const { endGame } = loadGameStateFromURL();
      if (endGame && gameState.players.length > 0) {
        setShowEndGame(true);
      }
    };

    checkEndGameFromURL();

    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      checkEndGameFromURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [gameState.players.length]);

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

  const handleEndGame = (): void => {
    setShowEndGame(true);
    setEndGameInURL(true);
  };

  const handleCloseEndGame = (): void => {
    setShowEndGame(false);
    setEndGameInURL(false);
  };

  const handleBackToGame = (): void => {
    setShowEndGame(false);
    setEndGameInURL(false);
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-znr-primary flex items-center justify-center">
        <SettingsButton 
          onRestartGame={restartGame}
          onNewGame={startNewGame}
          onEndGame={handleEndGame}
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
        onEndGame={handleEndGame}
      />
      <GameLayout
        gameState={gameState}
        onUpdateScore={updateCurrentScore}
        onAddScore={addScore}
        onSelectPlayer={selectPlayer}
        onEditScore={handleEditScore}
        getCurrentTotal={getCurrentTotal}
        onRestartGame={restartGame}
        onNewGame={startNewGame}
        onEndGame={handleEndGame}
      />
      <EditScoreModal
        isOpen={editingEntry !== null}
        onClose={() => setEditingEntry(null)}
        onSave={handleSaveEditedScore}
        entry={editingEntry}
      />
      <EndGameModal
        isOpen={showEndGame}
        onClose={handleCloseEndGame}
        onBackToGame={handleBackToGame}
        onRestartGame={() => {
          handleCloseEndGame();
          restartGame();
        }}
        onNewGame={() => {
          handleCloseEndGame();
          startNewGame();
        }}
        gameState={gameState}
      />
    </>
  );
};

export default CarcassonneTracker;