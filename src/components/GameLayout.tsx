import React, { useRef } from 'react';
import { ScoreTrackBorder } from './ScoreTrackBorder';
import { PlayerHeader } from './PlayerHeader';
import { ScoreInputSection } from './ScoreInputSection';
import { ScoreHistorySection } from './ScoreHistorySection';
import { useDimensions } from '../hooks/useDimensions';
import type { GameState, ScoreCategories, ScoreEntry } from '../types';
import { GameOptionsSection } from './GameOptionsSection';

interface GameLayoutProps {
  gameState: GameState;
  onUpdateScore: (category: keyof ScoreCategories, delta: number) => void;
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
  onAddScore,
  onSelectPlayer,
  onEditScore,
  getCurrentTotal,
  onRestartGame,    
  onNewGame,       
  onEndGame        
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useDimensions(gameState.players.length, headerRef as React.RefObject<HTMLDivElement>);

  return (
    <div className="fixed inset-0 bg-znr-elevated text-znr-text overflow-hidden">
      <ScoreTrackBorder players={gameState.players} />
      
      <PlayerHeader
        ref={headerRef}
        players={gameState.players}
        activePlayer={gameState.activePlayer}
        onSelectPlayer={onSelectPlayer}
      />

      {/* Content Container */}
      <div 
        className="absolute left-6 right-6 bottom-8 bg-znr-primary z-[40] overflow-y-auto rounded-lg znr-scroll-enhanced"
        style={{ top: `${headerHeight + 40}px` }}
      >
        <div className="p-2 md:p-4">
          <div className="max-w-2xl mx-auto w-full">
            <ScoreInputSection
              currentScores={gameState.currentScores}
              activePlayerName={gameState.getActivePlayer()?.getPlayerName()}
              onUpdateScore={onUpdateScore}
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
          </div>
        </div>
      </div>
    </div>
  );
};