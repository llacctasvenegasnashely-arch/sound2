import React from 'react';
import { Sparkles, Trophy, BookOpen, Settings } from 'lucide-react';
import { UserProfile } from '../types/game';

interface HeaderNavProps {
  userProfile: UserProfile;
  currentScreen: 'home' | 'game' | 'achievements';
  onNavigate: (screen: 'home' | 'game' | 'achievements') => void;
  onOpenTherapyGuide: () => void;
  onOpenSettings: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  userProfile,
  currentScreen,
  onNavigate,
  onOpenTherapyGuide,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Zone 1: Brand Title Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group text-left transition-transform active:scale-95"
          aria-label="Ir al inicio de SoundPatty"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              SoundPatty
            </h1>
            <p className="text-[10px] text-cyan-300 font-medium hidden sm:block">
              Aventura de Patrones Auditivos
            </p>
          </div>
        </button>

        {/* Zone 2: Navigation Links & Kid Player Stats */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Navigation Buttons */}
          <nav className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap min-h-[36px] flex items-center gap-1.5 ${
                currentScreen === 'home'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Misiones</span>
            </button>

            <button
              onClick={() => onNavigate('achievements')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap min-h-[36px] flex items-center gap-1.5 ${
                currentScreen === 'achievements'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Trofeos</span>
            </button>
          </nav>

          {/* Child Total Stars Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-amber-300 min-h-[40px]">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-sm sm:text-base font-bold tabular-nums">
              {userProfile.totalStars}
            </span>
            <span className="text-[11px] font-medium hidden md:inline">estrellas</span>
          </div>
        </div>

        {/* Zone 3: Primary Utility Actions (Fonoaudiology Guide & Settings) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Fonoaudiology Guide button */}
          <button
            onClick={onOpenTherapyGuide}
            title="Guía de Fonoaudiología y Estimulación"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 text-xs font-semibold min-h-[42px] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Guía Terapéutica</span>
          </button>

          {/* Settings & Profile button */}
          <button
            onClick={onOpenSettings}
            title="Ajustes y Perfil de Astronauta"
            className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
