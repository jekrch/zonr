import React, { useRef, useEffect, useState } from 'react';
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
  onSetScore: (category: keyof ScoreCategories, score: number) => void; // Add this prop
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
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useDimensions(gameState.players.length, headerRef);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Ensure layout is properly initialized
  useEffect(() => {
    const checkLayout = () => {
      if (headerHeight > 0) {
        setIsLayoutReady(true);
      }
    };

    checkLayout();
    
    // Also check after a delay to handle initial load timing
    const timeoutId = setTimeout(checkLayout, 200);
    return () => clearTimeout(timeoutId);
  }, [headerHeight]);

  // Calculate safe spacing values
  const topSpacing = Math.max(headerHeight + 40, 125); // Minimum fallback height
  const contentOpacity = isLayoutReady ? 1 : 0; // Fade in when layout is ready

  return (
    <div className="fixed inset-0 bg-znr-elevated text-znr-text overflow-hidden">
      <ScoreTrackBorder players={gameState.players} />
      
      <PlayerHeader
        ref={headerRef}
        players={gameState.players}
        activePlayer={gameState.activePlayer}
        onSelectPlayer={onSelectPlayer}
      />

      {/* Content Container with improved mobile handling */}
      <div 
        ref={contentRef}
        className="absolute left-6 right-6 bottom-8 bg-znr-primary z-[40] rounded-lg znr-scroll-enhanced"
        style={{ 
          top: `${topSpacing}px`,
          opacity: contentOpacity,
          transition: 'opacity 0.2s ease-in-out',
          overflow: 'hidden' // Changed from overflow-y-auto to be more explicit
        }}
      >
        <div 
          className="h-full overflow-y-auto overscroll-contain"
          style={{
            WebkitOverflowScrolling: 'touch', // Better iOS scrolling
            scrollbarWidth: 'thin'
          }}
        >
          <div className="p-2 md:p-4">
            <div className="max-w-2xl mx-auto w-full">
              <ScoreInputSection
                currentScores={gameState.currentScores}
                activePlayerName={gameState.getActivePlayer()?.getPlayerName()}
                onUpdateScore={onUpdateScore}
                onSetScore={onSetScore} // Add this prop
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
              
              {/* Bottom padding for iOS safe area */}
              <div className="h-4 md:h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};