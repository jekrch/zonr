import React, { useState, useEffect } from 'react';
import { ScoreDot } from './ScoreDot';
import { useScorePositions } from '../hooks/useScorePositions';
import { useDimensions } from '../hooks/useDimensions';
import type { Player } from '../types';

interface ScoreTrackBorderProps {
  players: Player[];
}

export const ScoreTrackBorder: React.FC<ScoreTrackBorderProps> = ({ players }) => {
  const { getScorePosition } = useScorePositions();
  const { windowDimensions } = useDimensions();
  const [isTrackReady, setIsTrackReady] = useState(false);

  // Ensure track is ready before rendering positions
  useEffect(() => {
    const checkTrackReady = () => {
      if (windowDimensions.width > 0 && windowDimensions.height > 0) {
        // Add a small delay to ensure layout is settled
        setTimeout(() => setIsTrackReady(true), 100);
      }
    };

    checkTrackReady();
  }, [windowDimensions]);

  // Reset track readiness when dimensions change significantly
  useEffect(() => {
    setIsTrackReady(false);
    const timeoutId = setTimeout(() => setIsTrackReady(true), 150);
    return () => clearTimeout(timeoutId);
  }, [windowDimensions.width, windowDimensions.height]);

  if (!isTrackReady) {
    return (
      <div className="absolute inset-0 z-[70] pointer-events-none">
        {/* Borders - always render these */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-znr-elevated"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-znr-elevated"></div>
        <div className="absolute top-0 bottom-0 left-0 w-6 bg-znr-elevated"></div>
        <div className="absolute top-0 bottom-0 right-0 w-6 bg-znr-elevated"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[70] pointer-events-none">
      {/* Borders */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-znr-elevated"></div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-znr-elevated"></div>
      <div className="absolute top-0 bottom-0 left-0 w-6 bg-znr-elevated"></div>
      <div className="absolute top-0 bottom-0 right-0 w-6 bg-znr-elevated"></div>

      {/* Score markers - only render when ready */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }, (_, i) => {
          try {
            const pos = getScorePosition(i);
            const isMajor = i % 10 === 0;
            
            // Validate position before rendering
            if (!pos || isNaN(pos.x) || isNaN(pos.y)) {
              return null;
            }
            
            return (
              <div
                key={i}
                className={`absolute ${isMajor ? 'w-1.5 h-1.5 bg-znr-text' : 'w-0.5 h-0.5 bg-znr-text-muted'} rounded-full`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            );
          } catch (error) {
            console.warn(`Error calculating position for score ${i}:`, error);
            return null;
          }
        })}

        {/* Score number labels for corner positioning */}
        {[0, 25, 50, 75].map(score => {
          try {
            const { width, height } = windowDimensions;
            const borderWidth = 24; 
            const borderHeight = 32; 

            let pos;
            switch (score) {
              case 0: // Top-Left Corner
                pos = { x: borderWidth / 2, y: borderHeight / 2 };
                break;
              case 25: // Top-Right Corner
                pos = { x: width - (borderWidth / 2), y: borderHeight / 2 };
                break;
              case 50: // Bottom-Right Corner
                pos = { x: width - (borderWidth / 2), y: height - (borderHeight / 2) };
                break;
              case 75: // Bottom-Left Corner
                pos = { x: borderWidth / 2, y: height - (borderHeight / 2) };
                break;
              default:
                pos = getScorePosition(score);
                break;
            }

            // Validate position
            if (!pos || isNaN(pos.x) || isNaN(pos.y)) {
              return null;
            }

            return (
              <div
                key={score}
                className="absolute text-[10px] md:text-xs text-znr-text font-bold"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {score}
              </div>
            );
          } catch (error) {
            console.warn(`Error calculating corner position for score ${score}:`, error);
            return null;
          }
        })}
      </div>

      {/* Player score dots - only render when ready */}
      {players.map(player => {
        try {
          const position = getScorePosition(player.totalScore);
          
          // Validate position before rendering
          if (!position || isNaN(position.x) || isNaN(position.y)) {
            return null;
          }
          
          return (
            <ScoreDot
              key={player.id}
              player={player}
              position={position}
            />
          );
        } catch (error) {
          console.warn(`Error rendering score dot for player ${player.name}:`, error);
          return null;
        }
      })}
    </div>
  );
};