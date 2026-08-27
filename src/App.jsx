import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_GAMES, fetchGamesJson } from './data/games';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { CloakModal, CLOAK_PROFILES } from './components/CloakModal';
import { PanicOverlay } from './components/PanicOverlay';
import { Play, Sparkles, Flame, Clock, Plus, SearchX } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('unblocked_games_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_GAMES;
  });

  const [activeGame, setActiveGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Favorites & Recently Played
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('unblocked_favorites');
    return saved ? JSON.parse(saved) : ['snake', '2048', 'flappy'];
  });

  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState(() => {
    const saved = localStorage.getItem('unblocked_recently_played');
    return saved ? JSON.parse(saved) : ['snake', 'pong', 'dino-run'];
  });

  // Cloak tab disguise
  const [activeCloak, setActiveCloak] = useState(() => {
    const saved = localStorage.getItem('unblocked_cloak_profile');
    if (saved) {
      const match = CLOAK_PROFILES.find((p) => p.id === saved);
      if (match) return match;
    }
    return CLOAK_PROFILES[0];
  });

  // Fetch games.json on mount to guarantee in sync with public/games.json
  useEffect(() => {
    fetchGamesJson().then((remoteGames) => {
      const localCustom = localStorage.getItem('unblocked_games_list');
      if (!localCustom) {
        setGames(remoteGames);
      }
    });
  }, []);

  // Update tab title and favicon based on active cloak
  useEffect(() => {
    document.title = activeCloak.title;

    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    let targetHref = `${cleanBase}favicon.svg`;
    let targetType = 'image/svg+xml';

    if (activeCloak.id === 'classroom') {
      targetHref = 'https://ssl.gstatic.com/classroom/favicon.png';
      targetType = 'image/png';
    } else if (activeCloak.id === 'drive') {
      targetHref = 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';
      targetType = 'image/png';
    } else if (activeCloak.id === 'docs') {
      targetHref = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
      targetType = 'image/x-icon';
    } else if (activeCloak.id === 'wikipedia') {
      targetHref = 'https://en.wikipedia.org/static/favicon/wikipedia.ico';
      targetType = 'image/x-icon';
    } else if (activeCloak.id === 'desmos') {
      targetHref = 'https://www.desmos.com/favicon.ico';
      targetType = 'image/x-icon';
    }

    const iconLinks = document.querySelectorAll("link[rel*='icon']");
    if (iconLinks.length > 0) {
      iconLinks.forEach((link, idx) => {
        if (idx === 0) {
          link.href = targetHref;
          if (targetType) {
            link.type = targetType;
          }
        } else if (activeCloak.id !== 'default') {
          // Temporarily disable secondary icons so the disguised favicon takes total precedence
          link.dataset.savedHref = link.href;
          link.href = targetHref;
        } else if (link.dataset.savedHref) {
          link.href = link.dataset.savedHref;
        }
      });
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = targetType;
      link.href = targetHref;
      document.head.appendChild(link);
    }
  }, [activeCloak]);

  // Global Keyboard shortcuts for Panic Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Panic hotkey: ']' to trigger
      if (e.key === ']') {
        e.preventDefault();
        setIsPanicActive(true);
      }
      // Panic un-trigger: '[' to exit
      if (e.key === '[') {
        e.preventDefault();
        setIsPanicActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFavorite = (e, gameId) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      localStorage.setItem('unblocked_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handlePlayGame = (game) => {
    setActiveGame(game);
    // Track recently played
    setRecentlyPlayedIds((prev) => {
      const next = [game.id, ...prev.filter((id) => id !== game.id)].slice(0, 6);
      localStorage.setItem('unblocked_recently_played', JSON.stringify(next));
      return next;
    });
  };

  const handleAddGame = (newGame) => {
    setGames((prev) => {
      const next = [newGame, ...prev];
      localStorage.setItem('unblocked_games_list', JSON.stringify(next));
      return next;
    });
  };

  const handleImportJson = (imported) => {
    setGames(imported);
    localStorage.setItem('unblocked_games_list', JSON.stringify(imported));
  };

  const handleResetDefaults = () => {
    setGames(DEFAULT_GAMES);
    localStorage.removeItem('unblocked_games_list');
  };

  const handleSelectCloak = (profile) => {
    setActiveCloak(profile);
    localStorage.setItem('unblocked_cloak_profile', profile.id);
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Category filter
      if (activeCategory === 'Favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (activeCategory !== 'All') {
        if (game.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        const matchesCategory = game.category.toLowerCase().includes(q);
        const matchesTag = game.tags.some((t) => t.toLowerCase().includes(q));
        const matchesControls = game.controls.some((c) => c.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesCategory || matchesTag || matchesControls;
      }

      return true;
    });
  }, [games, activeCategory, searchQuery, favorites]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: games.length };
    games.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [games]);

  // Recently played game objects
  const recentlyPlayedGames = useMemo(() => {
    return recentlyPlayedIds
      .map((id) => games.find((g) => g.id === id))
      .filter(Boolean);
  }, [recentlyPlayedIds, games]);

  // Featured Game (e.g. Snake or first featured)
  const featuredGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0];
  }, [games]);

  return (
    <div id="unblocked-games-app" className="min-h-screen bg-[#0A0A0A] text-[#F0F0F0] flex flex-col font-sans select-none selection:bg-[#FF3E00] selection:text-black">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalGames={games.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onPanicTrigger={() => setIsPanicActive(true)}
        activeCloakName={activeCloak.name}
      />

      {/* Main Content Area */}
      <main id="main-content-container" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Spotlight (shown when not searching) */}
        {!searchQuery && featuredGame && (
          <section id="featured-hero-spotlight" className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Main Featured Game Card */}
              <div className="lg:col-span-8 bg-[#111] border-2 border-[#222] relative group overflow-hidden flex flex-col justify-between min-h-[300px]">
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 text-[10px] font-mono border border-[#FF3E00] text-[#FF3E00] z-10 uppercase tracking-widest">
                  FEATURED_MODULE // {featuredGame.category}
                </div>

                {/* Hero Showcase Center */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#050505] relative text-center min-h-[220px]">
                  {/* Radial flame glow */}
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_center,_#FF3E00_0%,_transparent_70%)] pointer-events-none" />

                  <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
                    <div className="text-5xl sm:text-6xl mb-3 filter drop-shadow-md">
                      {featuredGame.thumbnailIcon}
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-white mb-2 leading-none">
                      {featuredGame.title}
                    </h1>
                    <p className="text-[#888] font-mono text-xs sm:text-sm uppercase tracking-wider max-w-md line-clamp-2">
                      {featuredGame.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action / Spec Bar */}
                <div className="p-4 bg-[#1a1a1a] flex flex-wrap justify-between items-center gap-3 border-t border-[#222]">
                  <div className="flex gap-3 items-center">
                    <button
                      id="hero-play-btn"
                      onClick={() => handlePlayGame(featuredGame)}
                      className="px-6 py-2.5 bg-[#FF3E00] hover:bg-[#ff551e] text-black font-black italic uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>PLAY</span>
                    </button>
                    <span className="text-[11px] font-mono text-[#666] uppercase hidden sm:inline truncate max-w-xs">
                      SOURCE: {featuredGame.iframeUrl.slice(0, 32)}...
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-[#666] uppercase tracking-tighter">
                      Runtime Online // 60 FPS
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Column: Add/JSON Quick Panel & Recently Played */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                {/* High-Contrast Action Banner */}
                <div
                  id="hero-add-banner"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-white p-5 flex flex-col justify-between items-start border border-[#222] cursor-pointer hover:bg-[#FF3E00] hover:text-black transition-all group min-h-[105px]"
                >
                  <span className="text-black group-hover:text-black font-black italic text-xl uppercase leading-none">
                    ADD / EDIT GAMES
                  </span>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span className="text-[10px] font-mono text-black/70 group-hover:text-black uppercase font-bold">
                      LOCAL DB: {games.length} ACTIVE MODULES
                    </span>
                    <Plus className="w-4 h-4 text-black group-hover:rotate-90 transition-transform" />
                  </div>
                </div>

                {/* Recently Played / Quick Jump Grid */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#666] tracking-widest mb-2">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#FF3E00]" />
                      RECENT_ACCESS
                    </span>
                    <span>{recentlyPlayedGames.length} LOGGED</span>
                  </div>

                  {recentlyPlayedGames.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      {recentlyPlayedGames.slice(0, 4).map((game, idx) => (
                        <button
                          key={game.id}
                          id={`recent-game-${game.id}`}
                          onClick={() => handlePlayGame(game)}
                          className="border border-[#222] bg-[#111] p-3 flex flex-col justify-between text-left hover:border-[#FF3E00] hover:bg-[#FF3E00] hover:text-black transition-all group cursor-pointer h-20"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-lg">{game.thumbnailIcon}</span>
                            <span className="text-[10px] font-mono text-[#555] group-hover:text-black/70 uppercase">
                              0{idx + 1}
                            </span>
                          </div>
                          <span className="font-bold uppercase text-xs truncate leading-tight group-hover:text-black">
                            {game.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-[#222] bg-[#111] text-center text-xs font-mono text-[#555]">
                      NO RECENT SESSIONS
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filters and Search Info Header */}
        <section id="games-filter-controls" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CategoryFilter
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              categoryCounts={categoryCounts}
              favoritesCount={favorites.length}
            />

            {searchQuery && (
              <div className="text-xs font-mono text-[#888] flex items-center gap-2">
                <span>
                  QUERY MATCHES: <strong className="text-[#FF3E00]">{filteredGames.length}</strong> FOR &ldquo;{searchQuery}&rdquo;
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#FF3E00] hover:underline uppercase font-bold"
                >
                  [CLEAR]
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Games Grid */}
        <section id="games-catalog-grid">
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onPlayGame={handlePlayGame}
                />
              ))}
            </div>
          ) : (
            <div
              id="empty-games-message"
              className="border border-[#222] bg-[#111] p-12 text-center max-w-md mx-auto my-8 font-mono"
            >
              <div className="w-12 h-12 border border-[#333] bg-[#151515] flex items-center justify-center mx-auto text-[#666] mb-3">
                <SearchX className="w-6 h-6 text-[#FF3E00]" />
              </div>
              <h3 className="text-sm font-black uppercase text-white mb-1">ZERO MODULES LOCATED</h3>
              <p className="text-xs text-[#777] mb-5">
                No entries match &ldquo;{searchQuery || activeCategory}&rdquo; in the current catalog.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-4 py-2 border border-[#333] hover:border-[#FF3E00] text-xs font-bold uppercase text-white bg-[#151515]"
                >
                  RESET_FILTERS
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-[#FF3E00] hover:bg-[#ff551e] text-black text-xs font-black italic uppercase"
                >
                  ADD_NEW_GAME
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer id="site-footer" className="mt-auto border-t border-[#222] bg-[#0A0A0A] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#555] uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <span className="text-[#888] font-bold">VOIDHUB DIGITAL ARCADE</span>
            <span>//</span>
            <span>PURE IFRAMES • HTML5 / CSS3 / JS ENGINE</span>
          </div>
          <div className="flex items-center gap-6">
            <span>NO COOKIES</span>
            <span>•</span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-[#888] hover:text-[#FF3E00] transition-colors uppercase cursor-pointer"
            >
              EDIT GAMES.JSON
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCloakModalOpen(true)}
              className="text-[#888] hover:text-[#FFBE00] transition-colors uppercase cursor-pointer"
            >
              TAB CLOAK
            </button>
          </div>
        </div>
      </footer>

      {/* Active Game Player Overlay */}
      {activeGame && (
        <GamePlayer
          game={activeGame}
          onClose={() => setActiveGame(null)}
          isFavorite={favorites.includes(activeGame.id)}
          onToggleFavorite={(id) => handleToggleFavorite(null, id)}
        />
      )}

      {/* Add / Manage JSON Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        games={games}
        onAddGame={handleAddGame}
        onImportJson={handleImportJson}
        onResetDefaults={handleResetDefaults}
      />

      {/* Tab Cloak Modal */}
      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activeProfileId={activeCloak.id}
        onSelectProfile={handleSelectCloak}
        onTriggerPanic={() => setIsPanicActive(true)}
      />

      {/* Emergency Panic Screen */}
      <PanicOverlay
        isActive={isPanicActive}
        onExit={() => setIsPanicActive(false)}
      />
    </div>
  );
}
