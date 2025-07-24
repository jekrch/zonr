import React, { useState } from 'react';
import { ChevronDown, Edit2 } from 'lucide-react';
import type { Player, ScoreEntry, ScoreCategory, ScoreCategories } from '../types';

interface ScoreHistorySectionProps {
  player: Player;
  onEditScore: (entry: ScoreEntry) => void;
}

const scoreCategories: ScoreCategory[] = [
  { key: 'other', label: 'Any', icon: '➕' },
  { key: 'roads', label: 'Roads', icon: '🛤️' },
  { key: 'cities', label: 'Cities', icon: '🏰' },
  { key: 'monasteries', label: 'Monasteries', icon: '⛪' },
  { key: 'fields', label: 'Fields', icon: '🌾' }
];

export const ScoreHistorySection: React.FC<ScoreHistorySectionProps> = ({
  player,
  onEditScore
}) => {
  const [historyExpanded, setHistoryExpanded] = useState<boolean>(false);

  return (
    <div className="bg-znr-secondary rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
      <div 
        className="p-3 md:p-5 bg-znr-tertiary cursor-pointer hover:bg-znr-elevated transition-colors flex justify-between items-center touch-manipulation"
        onClick={() => setHistoryExpanded(!historyExpanded)}
      >
        <div className="text-xs md:text-sm uppercase tracking-wide text-znr-text-dim">
          Score History
        </div>
        <ChevronDown 
          size={20} 
          className={`transition-transform duration-300 ${historyExpanded ? 'rotate-180' : ''}`}
        />
      </div>
      
      <div className={`transition-all duration-500 overflow-hidden ${historyExpanded ? 'max-h-80 md:max-h-96 overflow-y-auto znr-scroll-enhanced' : 'max-h-0'}`}>
        {player?.history.slice().reverse().map((entry) => (
          <div key={entry.id} className="p-2 md:p-4 border-t border-znr-border-soft flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-[10px] md:text-xs text-znr-text-muted uppercase tracking-wide">
                Turn {entry.turn}
              </div>
              <button
                onClick={() => onEditScore(entry)}
                className="p-1 text-znr-text-muted hover:text-znr-text-accent transition-colors"
              >
                <Edit2 size={12} />
              </button>
            </div>
            
            <div className="flex gap-1 md:gap-2 items-center flex-wrap">
              {scoreCategories.map(category => {
                // The 'other' key is not a property on ScoreCategories, so we skip it.
                if (category.key === 'other') {
                  return null;
                }
                
                // After the check, TypeScript knows category.key is a valid `keyof ScoreCategories`.
                const score = entry.scores[category.key];
                
                return score > 0 && (
                  <div key={category.key} className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm text-znr-text-dim">
                    <span className="text-xs md:text-sm">{category.icon}</span>
                    <span>{score}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="text-base md:text-xl text-znr-text font-light">
              {entry.total}
            </div>
          </div>
        )) || (
          <div className="p-6 md:p-8 text-center text-znr-text-muted text-sm md:text-base">
            No scores recorded yet
          </div>
        )}
      </div>
    </div>
  );
};