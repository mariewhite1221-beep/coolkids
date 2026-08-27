import React from 'react';
import { Gamepad2, Search, EyeOff, PlusCircle, ShieldAlert, Code2 } from 'lucide-react';

export const Header = ({
  searchQuery,
  onSearchChange,
  totalGames,
  onOpenAddModal,
  onOpenCloakModal,
  onPanicTrigger,
  activeCloakName
}) => {
  return (
    <header id="site-header" className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div 
            id="brand-logo-icon"
            className="w-10 h-10 bg-[#111] border border-[#333] flex items-center justify-center text-[#FF3E00] font-bold shadow-xs transition-colors hover:border-[#FF3E00]"
          >
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span id="site-title" className="text-xl sm:text-2xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#FF3E00] to-[#FFBE00]">
                VOID<span className="text-white">HUB</span>
              </span>
              <span 
                id="games-count-badge" 
                className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#151515] text-[#888] border border-[#222]"
              >
                {totalGames} MODULES
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#666] uppercase tracking-widest mt-0.5 hidden sm:block">
              Accessing Terminal: unblocked_v2.0.4
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              id="game-search-input"
              type="text"
              placeholder="SEARCH_CATALOG: tags, titles, keys..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#111] text-[#F0F0F0] placeholder-[#555] font-mono text-xs pl-10 pr-4 py-2 border border-[#222] focus:outline-none focus:border-[#FF3E00] transition-colors"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#888] hover:text-white bg-[#222] px-1.5 py-0.5 border border-[#333]"
              >
                ESC
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Tab Cloak Disguise */}
          <button
            id="cloak-toggle-btn"
            onClick={onOpenCloakModal}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase border transition-colors ${
              activeCloakName !== 'Default'
                ? 'bg-[#FF3E00]/10 border-[#FF3E00] text-[#FF3E00]'
                : 'bg-[#111] border-[#333] text-[#888] hover:border-[#FF3E00] hover:text-white'
            }`}
            title="Tab disguise & stealth settings"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CLOAK:</span>
            <span>{activeCloakName}</span>
          </button>

          {/* Manage JSON / Add Game */}
          <button
            id="manage-json-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase bg-[#111] border border-[#333] text-[#888] hover:border-[#FF3E00] hover:text-white transition-colors"
            title="Add iframe game or inspect JSON catalog"
          >
            <Code2 className="w-3.5 h-3.5 text-[#FF3E00]" />
            <span className="hidden sm:inline">JSON / ADD</span>
          </button>

          {/* Emergency Panic Button */}
          <button
            id="panic-button"
            onClick={onPanicTrigger}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-black font-black text-xs uppercase border border-white hover:bg-[#FF3E00] hover:border-[#FF3E00] hover:text-black transition-all cursor-pointer shadow-sm"
            title="Emergency Panic: Instantly display schoolwork"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="tracking-wider">PANIC [ ]</span>
          </button>
        </div>
      </div>
    </header>
  );
};
