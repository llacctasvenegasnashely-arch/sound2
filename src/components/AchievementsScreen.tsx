import React, { useState } from 'react';
import {
  Trophy,
  Star,
  Sparkles,
  Award,
  CheckCircle,
  Lock,
  ArrowLeft,
  Volume2,
  Clock,
  Activity,
} from 'lucide-react';
import { UserProfile, Achievement, SoundThemeMode, CategoryId } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import { CATEGORIES_DATA, THEME_MODES } from '../data/categoriesData';
import { AstroPatty } from './AstroPatty';
import { soundManager } from '../services/audioEngine';

interface AchievementsScreenProps {
  userProfile: UserProfile;
  currentMode: SoundThemeMode;
  onBackToHome: () => void;
  onPlayCategory: (categoryId: CategoryId) => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  userProfile,
  currentMode,
  onBackToHome,
  onPlayCategory,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-7 h-7 sm:w-8 sm:h-8 ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`;
    switch (iconName) {
      case 'Trophy':
        return <Trophy className={iconClass} />;
      case 'Star':
        return <Star className={iconClass} />;
      case 'Radio':
        return <Activity className={iconClass} />;
      case 'Clock':
        return <Clock className={iconClass} />;
      case 'Volume2':
        return <Volume2 className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  const handleSelectBadge = (badge: Achievement, isUnlocked: boolean) => {
    setSelectedBadge(badge);
    if (isUnlocked) {
      soundManager.playStarSound();
    } else {
      soundManager.playTap();
    }
  };

  const activeModeInfo = THEME_MODES.find((m) => m.id === currentMode) || THEME_MODES[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm min-h-[44px] transition-colors border border-slate-700 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Misiones</span>
        </button>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-400/30 px-3.5 py-1.5 rounded-2xl text-amber-300 font-bold text-sm">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>{userProfile.totalStars} Estrellas Totales</span>
        </div>
      </div>

      {/* AstroPatty Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-2 border-amber-500/30 rounded-3xl p-5 shadow-xl">
        <AstroPatty
          mood="cheering"
          size="md"
          speechText={`¡Qué gran museo cósmico, ${userProfile.name}! Has completado ${userProfile.completedChallengesCount} desafíos. ¡Sigue afinando tu oído con instrumentos y animales!`}
        />
      </div>

      {/* Category Progress Cards Overview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Progreso en {activeModeInfo.title}</span>
            <span className="text-xl">{activeModeInfo.emoji}</span>
          </h3>
        </div>

        <div
          className={`grid grid-cols-1 ${
            currentMode === 'voices' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'
          } gap-3.5`}
        >
          {Object.values(CATEGORIES_DATA).filter((cat) => {
            const modeData = cat.optionsByMode[currentMode];
            if (!modeData) return false;
            return Object.values(modeData).some((opts) => opts && opts.length > 0);
          }).map((cat) => {
            const stars = userProfile.starsPerCategory[currentMode]?.[cat.id] || 0;
            const level = userProfile.unlockedLevels[currentMode]?.[cat.id] || 1;

            return (
              <div
                key={cat.id}
                className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 flex flex-col justify-between gap-3 shadow-md hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {cat.id === 'frequency' && (currentMode === 'animals' ? '🐤' : currentMode === 'voices' ? '👧' : currentMode === 'notes' ? '🎼' : '🎹')}
                      {cat.id === 'duration' && (currentMode === 'animals' ? '🐶' : currentMode === 'voices' ? '👋' : currentMode === 'notes' ? '⚡' : '🎸')}
                      {cat.id === 'intensity' && (currentMode === 'animals' ? '🐱' : currentMode === 'voices' ? '🤫' : currentMode === 'notes' ? '🌙' : '🪕')}
                      {cat.id === 'prosody' && '❓'}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cat.title}</h4>
                      <p className="text-[11px] text-slate-400">Nivel {level} de 3</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{stars}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (level / 3) * 100)}%` }}
                  />
                </div>

                <button
                  onClick={() => onPlayCategory(cat.id)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-400/40 text-xs font-bold transition-colors min-h-[38px]"
                >
                  Entrenar esta Misión
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Badges, Trophies & Medals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Galería de Medallas y Trofeos</span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              {userProfile.unlockedAchievements.length} de {INITIAL_ACHIEVEMENTS.length} Desbloqueados
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = userProfile.unlockedAchievements.includes(ach.id);

            return (
              <button
                key={ach.id}
                type="button"
                onClick={() => handleSelectBadge(ach, isUnlocked)}
                className={`relative rounded-3xl p-4 border-2 flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-200 cursor-pointer min-h-[145px] ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-900 border-amber-400/60 shadow-lg shadow-amber-500/10 hover:scale-103'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-60'
                }`}
              >
                <div className="absolute top-2.5 right-2.5">
                  {isUnlocked ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-amber-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {getBadgeIcon(ach.icon, isUnlocked)}
                </div>

                <div>
                  <h4
                    className={`text-xs sm:text-sm font-bold leading-tight ${
                      isUnlocked ? 'text-amber-200' : 'text-slate-400'
                    }`}
                  >
                    {ach.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {isUnlocked ? '¡Completado!' : 'Por desbloquear'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badge Detail Drawer Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20">
              {getBadgeIcon(
                selectedBadge.icon,
                userProfile.unlockedAchievements.includes(selectedBadge.id)
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-white">{selectedBadge.title}</h4>
              <p className="text-xs text-slate-300">{selectedBadge.description}</p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-400">Recompensa:</span>
              <span className="font-bold text-amber-300 flex items-center gap-1">
                ⭐ +{selectedBadge.rewardStars} Estrellas
              </span>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-colors min-h-[44px]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
