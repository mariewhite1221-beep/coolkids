import React, { useState } from 'react';
import { X, Plus, Code, Download, Upload, Check, RefreshCw } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  games,
  onAddGame,
  onImportJson,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState('add');
  const [copied, setCopied] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeUrl, setIframeUrl] = useState('');
  const [thumbnailIcon, setThumbnailIcon] = useState('🎮');
  const [accentColor, setAccentColor] = useState('#10b981');
  const [description, setDescription] = useState('');
  const [controlsText, setControlsText] = useState('Arrow Keys to move, Space to action');
  const [tagsText, setTagsText] = useState('arcade, fun');

  // JSON Edit State
  const [jsonText, setJsonText] = useState(JSON.stringify(games, null, 2));
  const [jsonError, setJsonError] = useState(null);

  if (!isOpen) return null;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !iframeUrl.trim()) return;

    const newGame = {
      id: title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36),
      title: title.trim(),
      category,
      iframeUrl: iframeUrl.trim(),
      thumbnailIcon: thumbnailIcon.trim() || '🎮',
      accentColor,
      description: description.trim() || 'Custom embedded game.',
      controls: controlsText.split(',').map(s => s.trim()).filter(Boolean),
      tags: tagsText.split(',').map(s => s.trim()).filter(Boolean),
    };

    onAddGame(newGame);
    onClose();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(games, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(games, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleApplyJsonEdit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON root must be an array of game objects');
      }
      onImportJson(parsed);
      setJsonError(null);
      onClose();
    } catch (err) {
      setJsonError(err.message || 'Invalid JSON format');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          onImportJson(parsed);
          setJsonText(JSON.stringify(parsed, null, 2));
          onClose();
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="add-game-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none"
    >
      <div className="bg-[#0A0A0A] border-2 border-[#222] w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex bg-[#111] p-1 border border-[#333]">
              <button
                id="tab-add-game"
                onClick={() => setActiveTab('add')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'add'
                    ? 'bg-[#FF3E00] text-black italic'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Game</span>
              </button>
              <button
                id="tab-json-editor"
                onClick={() => {
                  setJsonText(JSON.stringify(games, null, 2));
                  setActiveTab('json');
                }}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'json'
                    ? 'bg-[#FF3E00] text-black italic'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>games.json Editor</span>
              </button>
            </div>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-2 border border-[#333] bg-[#111] text-[#888] hover:text-white hover:border-[#FF3E00] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {activeTab === 'add' ? (
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <p className="text-xs font-mono text-[#888]">
                REGISTER_MODULE: Append game iframe definition into <code className="text-[#FF3E00] font-mono">games.json</code>.
              </p>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#888] mb-1.5">Game Title</label>
                  <input
                    id="input-game-title"
                    type="text"
                    required
                    placeholder="e.g. Cyber Raider"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] px-3 py-2 text-xs font-mono text-[#F0F0F0] focus:outline-none focus:border-[#FF3E00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#888] mb-1.5">Category</label>
                  <select
                    id="select-game-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] px-3 py-2 text-xs font-mono text-[#F0F0F0] focus:outline-none focus:border-[#FF3E00]"
                  >
                    <option value="Arcade">Arcade</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Action">Action</option>
                    <option value="Classic">Classic</option>
                    <option value="Retro">Retro</option>
                  </select>
                </div>
              </div>

              {/* Iframe URL */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#888] mb-1.5">
                  Iframe Source URL (Local path e.g. <code className="text-[#FF3E00] font-mono">/games/snake/index.html</code> or Web URL)
                </label>
                <input
                  id="input-iframe-url"
                  type="text"
                  required
                  placeholder="/games/custom/index.html or https://..."
                  value={iframeUrl}
                  onChange={(e) => setIframeUrl(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] px-3 py-2 text-xs font-mono text-[#F0F0F0] focus:outline-none focus:border-[#FF3E00]"
                />
              </div>

              {/* Icon & Accent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#888] mb-1.5">Thumbnail Icon (Emoji)</label>
                  <input
                    id="input-game-icon"
                    type="text"
                    value={thumbnailIcon}
                    onChange={(e) => setThumbnailIcon(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] px-3 py-2 text-xs font-mono text-[#F0F0F0] focus:outline-none focus:border-[#FF3E00]"
                    placeholder="🎮"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#888] mb-1.5">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-accent-color"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-9 cursor-pointer bg-transparent border border-[#222]"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 bg-[#111] border border-[#222] px-3 py-2 text-xs font-mono text-[#F0F0F0] focus:outline-none focus:border-[#FF3E00]"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#888] mb-1.5">Description</label>
                <textarea
                  id="input-game-desc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe game objective..."
                  className="w-full bg-[#111] border border-[#222] px-3 py-2 text-xs text-[#F0F0F0] focus:outline-none focus:border-[#FF3E00]"
                />
              </div>

              {/* Controls */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#888] mb-1.5">
                  Controls (Comma-separated)
                </label>
                <input
                  id="input-game-controls"
                  type="text"
                  value={controlsText}
                  onChange={(e) => setControlsText(e.target.value)}
                  placeholder="e.g. Arrow keys to steer, Space to shoot"
                  className="w-full bg-[#111] border border-[#222] px-3 py-2 text-xs font-mono text-[#F0F0F0] focus:outline-none focus:border-[#FF3E00]"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#888] mb-1.5">
                  Tags (Comma-separated)
                </label>
                <input
                  id="input-game-tags"
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="e.g. action, retro, multiplayer"
                  className="w-full bg-[#111] border border-[#222] px-3 py-2 text-xs font-mono text-[#F0F0F0] focus:outline-none focus:border-[#FF3E00]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-[#222]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#333] bg-[#111] text-[#888] text-xs font-mono uppercase font-bold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-new-game-btn"
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF3E00] hover:bg-[#ff551e] text-black text-xs font-black italic uppercase transition-all cursor-pointer shadow-xs"
                >
                  Add Game to Catalog
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-[#888] uppercase">
                  RAW_CATALOG: Full JSON structure of registered games
                </p>
                <div className="flex items-center gap-2">
                  <button
                    id="copy-json-btn"
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#F0F0F0] bg-[#111] border border-[#333] hover:border-[#FF3E00] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#FF3E00]" /> : <Code className="w-3.5 h-3.5" />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                  <button
                    id="download-json-btn"
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#F0F0F0] bg-[#111] border border-[#333] hover:border-[#FF3E00] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT</span>
                  </button>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#F0F0F0] bg-[#111] border border-[#333] hover:border-[#FF3E00] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>IMPORT</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    id="reset-defaults-btn"
                    onClick={onResetDefaults}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3E00]/10 hover:bg-[#FF3E00]/20 text-xs text-[#FF3E00] border border-[#FF3E00]/40 cursor-pointer font-bold"
                    title="Reset to default games"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RESET</span>
                  </button>
                </div>
              </div>

              {jsonError && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-400 text-xs">
                  {jsonError}
                </div>
              )}

              <textarea
                id="raw-json-editor-textarea"
                rows={14}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full bg-[#050505] font-mono text-xs text-[#FFBE00] border border-[#222] p-3.5 focus:outline-none focus:border-[#FF3E00]"
              />

              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#222]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#333] bg-[#111] text-[#888] text-xs font-mono uppercase font-bold hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  id="apply-json-changes-btn"
                  onClick={handleApplyJsonEdit}
                  className="px-5 py-2.5 bg-[#FF3E00] hover:bg-[#ff551e] text-black text-xs font-black italic uppercase cursor-pointer"
                >
                  Save Changes to Catalog
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
