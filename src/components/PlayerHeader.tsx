import React, { useRef } from 'react';
import { AnimatedPlayerScore } from './AnimatedPlayerScore';
import { useDimensions } from '../hooks/useDimensions';
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
  const headerRef = useRef<HTMLDivElement>(null);
  useDimensions(players.length, headerRef as any);

  return (
    <div 
      ref={headerRef}
      className="absolute top-8 left-6 right-6 bg-znr-primary border-b border-znr-border-soft p-2 md:p-4 shadow-lg z-[60] rounded-lg"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex justify-center gap-1 sm:gap-2 lg:gap-3 max-w-4xl mx-auto">
        {players.map((player, index) => (
          <AnimatedPlayerScore
            key={player.id}
            player={player}
            isActive={activePlayer === index}
            onClick={() => onSelectPlayer(index)}
          />
        ))}
      </div>
    </div>
  );
};