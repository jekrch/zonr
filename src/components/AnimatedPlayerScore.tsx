import React from 'react';
import { Meeple } from './Meeple';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import type { Player } from '../types';

interface AnimatedPlayerScoreProps {
  player: Player;
  isActive: boolean;
  onClick: () => void;
}

export const AnimatedPlayerScore: React.FC<AnimatedPlayerScoreProps> = ({ 
  player, 
  isActive, 
  onClick 
}) => {
  const animatedScore = useAnimatedNumber(player.totalScore, 800);
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-znr-secondary border-2 rounded-lg lg:rounded-xl p-2 md:p-3 cursor-pointer 
        transition-all duration-300 flex flex-row items-center justify-center gap-3 sm:gap-4
        shadow-lg hover:shadow-xl hover:-translate-y-0.5 relative min-h-[70px] sm:min-h-[65px] lg:min-h-[75px]
        ${isActive 
          ? 'border-znr-border-soft bg-gradient-to-br from-znr-secondary to-znr-tertiary shadow-[0_0_0_2px_var(--color-znr-border-accent)]' 
          : 'border-transparent hover:border-znr-hover'
        }
      `}
    >
      <Meeple color={player.color} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-md flex-shrink-0" />
      <div className="flex flex-col items-center text-center">
        <div className="text-lg sm:text-xl lg:text-2xl font-light leading-none">{animatedScore}</div>
        <div className="text-xs sm:text-sm text-znr-text-muted uppercase tracking-wide mt-0.5 truncate max-w-[80px] sm:max-w-[100px] lg:max-w-none">
          {player.name}
        </div>
      </div>
      {isActive && (
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-znr-accent" />
      )}
    </div>
  );
};