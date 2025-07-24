import React from 'react';
import type { ScoreCategories, ScoreCategory } from '../types';

interface CategorySelectionSectionProps {
  selectedCategory: keyof ScoreCategories | 'other';
  onSelectCategory: (category: keyof ScoreCategories | 'other') => void;
}

const categories: ScoreCategory[] = [
  { key: 'other', label: 'Any', icon: '➕' },
  { key: 'roads', label: 'Roads', icon: '🛤️' },
  { key: 'cities', label: 'Cities', icon: '🏰' },
  { key: 'monasteries', label: 'Monst', icon: '⛪' },
  { key: 'fields', label: 'Fields', icon: '🌾' }
];

export const CategorySelectionSection: React.FC<CategorySelectionSectionProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="mb-4">
      <div className="text-xs uppercase tracking-wide text-znr-text-muted mb-3 text-center">
        Select Category
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => onSelectCategory(category.key)}
            className={`p-2 md:p-3 rounded-lg transition-all touch-manipulation flex flex-col items-center gap-1 ${
              selectedCategory === category.key
                ? 'bg-znr-accent text-znr-text-dim shadow-md'
                : 'bg-znr-tertiary text-znr-text-muted hover:bg-znr-elevated hover:text-znr-text'
            }`}
          >
            <div className="text-lg md:text-xl">{category.icon}</div>
            <div className="text-xs font-medium">{category.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};