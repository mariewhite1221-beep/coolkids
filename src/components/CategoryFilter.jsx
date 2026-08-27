import React from 'react';
import { Sparkles, Star, Flame, Puzzle, Swords, History } from 'lucide-react';

export const CategoryFilter = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
  favoritesCount
}) => {
  const categories = [
    { id: 'All', label: 'All Games', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'Favorites', label: 'Favorites', icon: <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> },
    { id: 'Arcade', label: 'Arcade', icon: <Flame className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'Puzzle', label: 'Puzzle', icon: <Puzzle className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'Action', label: 'Action', icon: <Swords className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'Classic', label: 'Classic', icon: <History className="w-3.5 h-3.5 text-cyan-400" /> },
  ];

  return (
    <div id="category-filter-container" className="flex items-center gap-2.5 overflow-x-auto py-2 pb-3 scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = cat.id === 'Favorites' ? favoritesCount : (cat.id === 'All' ? categoryCounts['All'] || 0 : categoryCounts[cat.id] || 0);

        return (
          <button
            key={cat.id}
            id={`category-tab-${cat.id.toLowerCase()}`}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase whitespace-nowrap transition-all border cursor-pointer ${
              isActive
                ? 'bg-[#FF3E00] text-black border-[#FF3E00] shadow-[0_0_15px_rgba(255,62,0,0.3)]'
                : 'bg-[#111] text-[#888] border-[#222] hover:border-[#FF3E00] hover:text-white'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 font-mono font-bold ${
                isActive ? 'bg-black text-[#FF3E00]' : 'bg-[#181818] text-[#666]'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
