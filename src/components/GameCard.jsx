import React from 'react';
import { Play, Star, ExternalLink, Keyboard } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlayGame,
}) => {
  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative bg-[#111] border border-[#222] hover:border-[#FF3E00] transition-all duration-200 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-black/60"
    >
      {/* Top Accent Strip */}
      <div
        className="h-0.5 w-full transition-opacity group-hover:opacity-100 opacity-60 bg-gradient-to-r from-[#FF3E00] to-[#FFBE00]"
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Icon, Category, Favorite */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 bg-[#151515] border border-[#222] group-hover:border-[#FF3E00] flex items-center justify-center text-2xl transition-colors flex-shrink-0"
              >
                <span>{game.thumbnailIcon}</span>
              </div>
              <div>
                <span
                  className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border border-[#333] text-[#FF3E00] bg-black/60 inline-block"
                >
                  {game.category}
                </span>
                <h3
                  id={`game-title-${game.id}`}
                  className="text-base font-black uppercase tracking-tight text-white mt-1 group-hover:text-[#FF3E00] transition-colors leading-snug"
                >
                  {game.title}
                </h3>
              </div>
            </div>

            <button
              id={`fav-btn-${game.id}`}
              onClick={(e) => onToggleFavorite(e, game.id)}
              className="p-1.5 text-[#555] hover:text-[#FFBE00] hover:bg-[#1a1a1a] transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite ? 'text-[#FFBE00] fill-[#FFBE00]' : ''
                }`}
              />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-[#777] line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>

        {/* Bottom details & Play button */}
        <div>
          {/* Controls brief */}
          {game.controls && game.controls.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#666] mb-3.5 bg-[#0A0A0A] px-2.5 py-1.5 border border-[#1e1e1e]">
              <Keyboard className="w-3 h-3 text-[#555] flex-shrink-0" />
              <span className="truncate uppercase">{game.controls[0]}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#1e1e1e]">
            <button
              id={`play-game-${game.id}`}
              onClick={() => onPlayGame(game)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#FF3E00] hover:bg-[#ff551f] text-black font-black italic uppercase tracking-wider text-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PLAY</span>
            </button>

            <a
              id={`external-link-${game.id}`}
              href={game.iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#151515] hover:bg-[#222] text-[#888] hover:text-white border border-[#222] hover:border-[#333] transition-colors"
              title="Open standalone in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
