import React from 'react';
import { ScoreTrackBorder } from './ScoreTrackBorder';
import { PlayerHeader } from './PlayerHeader';
import { ScoreInputSection } from './ScoreInputSection';
import { ScoreHistorySection } from './ScoreHistorySection';
import { GameOptionsSection } from './GameOptionsSection';
import { MedievalBackground } from './MedievalBackground';
import type { GameState, ScoreCategories, ScoreEntry } from '../types';

interface GameLayoutProps {
  gameState: GameState;
  onUpdateScore: (category: keyof ScoreCategories, delta: number) => void;
  onSetScore: (category: keyof ScoreCategories, score: number) => void;
  onAddScore: () => void;
  onSelectPlayer: (playerIndex: number) => void;
  onEditScore: (entry: ScoreEntry) => void;
  getCurrentTotal: () => number;
  onRestartGame: () => void;
  onNewGame: () => void;
  onEndGame: () => void;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  gameState,
  onUpdateScore,
  onSetScore,
  onAddScore,
  onSelectPlayer,
  onEditScore,
  getCurrentTotal,
  onRestartGame,
  onNewGame,
  onEndGame
}) => {
  return (
    <div className="fixed inset-0 bg-znr-elevated text-znr-text flex flex-col">
      {/* Medieval Background - shows on larger screens, stays behind content */}
      <div className="absolute inset-0 z-[10]">
        <MedievalBackground />
      </div>
      
      <ScoreTrackBorder players={gameState.players} />
      
      {/* Header - takes natural height, above background */}
      <div className="flex-shrink-0 p-6 pb-0 mt-2 not-first:relative z-[60]">
        <PlayerHeader
          players={gameState.players}
          activePlayer={gameState.activePlayer}
          onSelectPlayer={onSelectPlayer}
        />
      </div>

      {/* Content - fills remaining space, above background */}
      <div className="flex-1 overflow-hidden p-6 pt-2 mb-2 relative z-[40] ">
        <div className="h-full max-[70em]:bg-[var(--znr-primary)] rounded-lg overflow-y-auto">
          <div className="p-2">
            <div className="max-w-2xl mx-auto">
              <ScoreInputSection
                currentScores={gameState.currentScores}
                activePlayerName={gameState.getActivePlayer()?.getPlayerName()}
                onUpdateScore={onUpdateScore}
                onSetScore={onSetScore}
                onAddScore={onAddScore}
                getCurrentTotal={getCurrentTotal}
              />

              <ScoreHistorySection
                player={gameState.players[gameState.activePlayer]}
                onEditScore={onEditScore}
              />

              <GameOptionsSection
                onRestartGame={onRestartGame}
                onNewGame={onNewGame}
                onEndGame={onEndGame}
              />
              
              {/* Bottom safe area */}
              <div className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};