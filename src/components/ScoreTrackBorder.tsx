import React from 'react';
import { ScoreDot } from './ScoreDot';
import { useScorePositions } from '../hooks/useScorePositions';
import type { Player } from '../types';

interface ScoreTrackBorderProps {
  players: Player[];
}

export const ScoreTrackBorder: React.FC<ScoreTrackBorderProps> = ({ players }) => {
  const { getScorePosition } = useScorePositions();

  return (
    <div className="absolute inset-0 z-[70] pointer-events-none">
      {/* Borders */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-znr-elevated"></div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-znr-elevated"></div>
      <div className="absolute top-0 bottom-0 left-0 w-6 bg-znr-elevated"></div>
      <div className="absolute top-0 bottom-0 right-0 w-6 bg-znr-elevated"></div>
      
      {/* Score markers */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }, (_, i) => {
          const pos = getScorePosition(i);
          const isMajor = i % 10 === 0;
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
        })}
        
        {/* Score number labels */}
        {[0, 25, 50, 75].map(score => {
          const pos = getScorePosition(score);
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
        })}
      </div>
      
      {/* Player score dots */}
      {players.map(player => (
        <ScoreDot
          key={player.id}
          player={player}
          position={getScorePosition(player.totalScore)}
        />
      ))}
    </div>
  );
};