import React from 'react';
import type { Player } from '../types';

export interface ScoreDotProps {
  player: Player;
  position: { x: number; y: number };
}

export const ScoreDot: React.FC<ScoreDotProps> = ({ player, position }) => {
  const laps = Math.floor(player.totalScore / 100);
  
  return (
    <div 
      className="absolute w-3 h-3 md:w-4 md:h-4 transition-all duration-500 ease-in-out"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div 
        className="w-full h-full rounded-full border-2 border-white shadow-lg relative"
        style={{ backgroundColor: player.color }}
      >
        {laps > 0 && (
          <>
            <div className="absolute inset-0 rounded-full animate-pulse" 
                 style={{ backgroundColor: player.color, opacity: 0.6 }} />
            <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full text-xs flex items-center justify-center font-bold text-black"
                 style={{ fontSize: '6px' }}>
              {laps}
            </div>
          </>
        )}
      </div>
    </div>
  );
};