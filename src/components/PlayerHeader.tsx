import React from 'react';
import { AnimatedPlayerScore } from './AnimatedPlayerScore';
import type { Player } from '../types';

interface PlayerHeaderProps {
  players: Player[];
  activePlayer: number;
  onSelectPlayer: (playerIndex: number) => void;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  players,
  activePlayer,
  onSelectPlayer
}) => {
  return (
    <div className="max-[70em]:bg-[var(--znr-primary)] bg-gradient-to-br from-[var(--znr-primary)]/30 to-[var(--znr-primary)]/60 border-b border-znr-border-soft p-2 shadow-lg rounded-lg">
      <div className={`
        ${players.length === 1 
          ? 'flex justify-center' 
          : 'grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center'
        } 
        gap-3 sm:gap-2 lg:gap-3 max-w-4xl mx-auto
      `}>
        {players.map((player, index) => (
          <div key={player.id} className={players.length === 1 ? 'min-w-[14em]' : ''}>
            <AnimatedPlayerScore
              player={player}
              isActive={activePlayer === index}
              onClick={() => onSelectPlayer(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};