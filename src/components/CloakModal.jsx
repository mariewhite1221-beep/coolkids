import React from 'react';
import { X, ShieldCheck, Zap } from 'lucide-react';

export const CLOAK_PROFILES = [
  {
    id: 'default',
    name: 'Default',
    title: 'Unblocked Games',
    icon: '🎮',
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    icon: '🏫',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: '📁',
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: '📄',
  },
  {
    id: 'desmos',
    name: 'Desmos Math',
    title: 'Desmos | Graphing Calculator',
    icon: '📐',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Photosynthesis - Wikipedia',
    icon: '📚',
  },
];

export const CloakModal = ({
  isOpen,
  onClose,
  activeProfileId,
  onSelectProfile,
  onTriggerPanic,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="cloak-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none"
    >
      <div className="bg-[#0A0A0A] border-2 border-[#222] w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#151515] border border-[#333] flex items-center justify-center text-[#FFBE00]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black italic uppercase tracking-tight text-white">TAB CLOAKER & STEALTH</h3>
              <p className="text-[10px] font-mono text-[#777] uppercase">CAMOUFLAGE TITLE & FAVICON</p>
            </div>
          </div>
          <button
            id="close-cloak-modal-btn"
            onClick={onClose}
            className="p-2 border border-[#333] bg-[#111] text-[#888] hover:text-white hover:border-[#FF3E00] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs font-mono text-[#888] uppercase">
            SELECT DISGUISE PRESET TO CAMOUFLAGE BROWSER TAB:
          </p>

          <div className="space-y-2">
            {CLOAK_PROFILES.map((profile) => {
              const isSelected = activeProfileId === profile.id;
              return (
                <button
                  key={profile.id}
                  id={`cloak-preset-${profile.id}`}
                  onClick={() => {
                    onSelectProfile(profile);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#151515] border-2 border-[#FF3E00] text-white'
                      : 'bg-[#111] border-[#222] text-[#ccc] hover:border-[#444] hover:bg-[#151515]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{profile.icon}</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-white">{profile.name}</div>
                      <div className="text-[10px] font-mono text-[#777] truncate max-w-[220px]">
                        TAB: &ldquo;{profile.title}&rdquo;
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-mono font-bold uppercase text-black bg-[#FF3E00] px-2 py-0.5">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Panic Key Tip */}
          <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between bg-[#111] p-3 border border-[#333]">
            <div>
              <div className="text-xs font-bold uppercase font-mono text-[#FF3E00] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>PANIC HOTKEY</span>
              </div>
              <p className="text-[10px] font-mono text-[#777] uppercase mt-0.5">
                PRESS <code className="text-[#FFBE00] bg-black px-1.5 py-0.5 border border-[#333]">]</code> TO DISGUISE INSTANTLY
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onTriggerPanic();
              }}
              className="px-3 py-1.5 bg-[#FF3E00] hover:bg-[#ff551e] text-black font-black uppercase text-xs italic transition-colors cursor-pointer"
            >
              TEST PANIC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
