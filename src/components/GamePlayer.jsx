import React, { useRef, useState, useEffect } from 'react';
import { getGameUrl } from '../data/games.js';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Star,
  Keyboard,
  Tv,
  X
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);

  // Restart/Reload iframe
  const handleReload = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 50);
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Listen for Escape to close player when not in fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      id="game-player-wrapper"
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0A0A0A] text-[#F0F0F0] flex flex-col overflow-y-auto font-sans select-none selection:bg-[#FF3E00] selection:text-black"
    >
      {/* Player Header Bar */}
      <div
        id="player-header-bar"
        className="h-16 px-4 sm:px-6 bg-[#0A0A0A] border-b border-[#222] flex items-center justify-between gap-3 flex-shrink-0"
      >
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <button
            id="player-back-btn"
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#111] hover:bg-[#181818] text-[#F0F0F0] text-xs font-mono uppercase font-bold border border-[#333] hover:border-[#FF3E00] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF3E00]" />
            <span className="hidden sm:inline">RETURN_TO_HUB</span>
          </button>

          <div className="flex items-center gap-2.5 border-l border-[#222] pl-3">
            <span className="text-2xl">{game.thumbnailIcon}</span>
            <div>
              <h2 id="active-game-title" className="text-sm sm:text-base font-black italic uppercase text-white leading-tight tracking-tight">
                {game.title}
              </h2>
              <span
                className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border border-[#333] text-[#FF3E00] bg-black inline-block mt-0.5"
              >
                {game.category}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Favorite */}
          <button
            id="player-fav-btn"
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2.5 border text-xs font-medium transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-[#FF3E00]/10 border-[#FF3E00] text-[#FFBE00]'
                : 'bg-[#111] border-[#222] text-[#888] hover:text-white hover:border-[#333]'
            }`}
            title={isFavorite ? 'In Favorites' : 'Add to Favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-[#FFBE00]' : ''}`} />
          </button>

          {/* Reload Iframe */}
          <button
            id="player-reload-btn"
            onClick={handleReload}
            className="p-2.5 bg-[#111] hover:bg-[#181818] text-[#888] hover:text-white border border-[#222] hover:border-[#FF3E00] transition-colors cursor-pointer"
            title="Reload Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theater Mode Toggle */}
          <button
            id="player-theater-btn"
            onClick={() => setIsTheater(!isTheater)}
            className={`p-2.5 border text-xs font-medium transition-colors cursor-pointer ${
              isTheater
                ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                : 'bg-[#111] border-[#222] text-[#888] hover:text-white hover:border-[#333]'
            }`}
            title={isTheater ? 'Default Width' : 'Theater / Expanded View'}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            id="player-fullscreen-btn"
            onClick={handleToggleFullscreen}
            className="p-2.5 bg-[#111] hover:bg-[#181818] text-[#888] hover:text-white border border-[#222] hover:border-[#FF3E00] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Open in New Window */}
          <a
            id="player-open-tab-btn"
            href={getGameUrl(game.iframeUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-[#111] hover:bg-[#181818] text-[#888] hover:text-white border border-[#222] hover:border-[#333] transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Close */}
          <button
            id="player-close-btn"
            onClick={onClose}
            className="p-2.5 bg-white text-black hover:bg-[#FF3E00] hover:text-black border border-white hover:border-[#FF3E00] transition-all cursor-pointer ml-1"
            title="Close Game (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Screen Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-[#050505]">
        <div
          id="game-viewport-container"
          className={`w-full transition-all duration-300 flex flex-col items-center justify-center ${
            isTheater ? 'max-w-[96vw]' : 'max-w-4xl'
          }`}
        >
          {/* Iframe Box */}
          <div className="w-full bg-[#111] border-2 border-[#222] overflow-hidden shadow-2xl shadow-black relative aspect-[4/3] sm:aspect-[16/10] max-h-[80vh]">
            <iframe
              id="active-game-iframe"
              ref={iframeRef}
              src={getGameUrl(game.iframeUrl)}
              title={game.title}
              className="w-full h-full border-0 block bg-black"
              allow="autoplay; fullscreen; keyboard; gamepad"
              allowFullScreen
            />
          </div>

          {/* Game Controls & Info Bar */}
          <div className="w-full mt-4 bg-[#111] border border-[#222] p-4 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Controls Cheatsheet */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#151515] border border-[#333] flex items-center justify-center text-[#FF3E00] flex-shrink-0">
                  <Keyboard className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-[#888] uppercase">INPUT_BINDS:</span>
                  {game.controls && game.controls.map((ctrl, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-[#151515] border border-[#333] text-[#F0F0F0] uppercase font-bold"
                    >
                      {ctrl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5">
                {game.tags && game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#0A0A0A] text-[#888] border border-[#222]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-3 pt-3 border-t border-[#222] text-xs text-[#777] leading-relaxed font-sans">
              <span className="font-mono font-bold text-[#888] uppercase">SYS_LOG: </span>
              {game.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
