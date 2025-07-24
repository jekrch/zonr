import React from 'react';
import { X } from 'lucide-react';
import type { TurnEntry } from '../types';

interface TurnSummarySectionProps {
  entries: TurnEntry[];
  turnTotal: number;
  onRemoveEntry: (entryId: string) => void;
}

export const TurnSummarySection: React.FC<TurnSummarySectionProps> = ({
  entries,
  turnTotal,
  onRemoveEntry
}) => {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-znr-tertiary rounded-xl overflow-hidden mb-4">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-znr-border-soft">
        <div className="flex justify-between items-center">
          <div className="text-xs uppercase tracking-wide text-znr-text-muted">
            Turn Total
          </div>
          <div className="text-xl md:text-2xl font-light text-znr-text-accent">
            {turnTotal}
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="max-h-40 overflow-y-auto znr-scroll-enhanced">
        {entries.map((entry) => (
          <div key={entry.id} className="p-3 border-b border-znr-border-soft last:border-b-0 flex justify-between items-center hover:bg-znr-elevated/30 transition-colors">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="text-base flex-shrink-0">{entry.categoryIcon}</div>
              <div className="text-sm text-znr-text truncate">
                {entry.categoryName}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`text-base font-medium ${
                entry.points > 0 ? 'text-znr-text-accent' : 'text-red-400'
              }`}>
                {entry.points > 0 ? '+' : ''}{entry.points}
              </div>
              <button
                onClick={() => onRemoveEntry(entry.id)}
                className="w-6 h-6 bg-znr-elevated rounded-md flex items-center justify-center text-znr-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors touch-manipulation"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};