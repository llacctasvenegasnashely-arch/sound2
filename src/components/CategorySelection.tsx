import React, { useState } from 'react';
import { Play, Sparkles, Volume2, Clock, Activity, Award, ChevronRight, MessageCircle, CheckCircle } from 'lucide-react';
import { CategoryId, SoundThemeMode, UserProfile } from '../types/game';
import { CATEGORIES_DATA, THEME_MODES, getCategoryOptions } from '../data/categoriesData';
import { AstroPatty } from './AstroPatty';
import { soundManager } from '../services/audioEngine';

interface CategorySelectionProps {
  userProfile: UserProfile;
  currentMode: SoundThemeMode;
  onSelectMode: (mode: SoundThemeMode) => void;
  onSelectCategory: (categoryId: CategoryId, level?: number) => void;
  onViewAchievements: () => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  userProfile,
  currentMode,
  onSelectMode,
  onSelectCategory,
  onViewAchievements,
}) => {
  const [selectedLevels, setSelectedLevels] = useState<Record<string, number>>({});

  const categoriesList = Object.values(CATEGORIES_DATA).filter((cat) => {
    const modeData = cat.optionsByMode[currentMode];
    if (!modeData) return false;
    return Object.values(modeData).some((opts) => opts && opts.length > 0);
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-8 h-8 text-cyan-400" />;
      case 'Clock':
        return <Clock className="w-8 h-8 text-emerald-400" />;
      case 'Volume2':
        return <Volume2 className="w-8 h-8 text-pink-400" />;
      case 'MessageCircle':
        return <MessageCircle className="w-8 h-8 text-amber-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-amber-400" />;
    }
  };

  const handleTestSound = (e: React.MouseEvent, optionVal: string) => {
    e.stopPropagation();
    soundManager.playPatternSound(optionVal as any);
  };

  const activeModeInfo = THEME_MODES.find((m) => m.id === currentMode) || THEME_MODES[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Astronaut Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Background stars */}
        <div className="absolute top-2 right-12 w-2 h-2 rounded-full bg-cyan-300 animate-twinkle" />
        <div
          className="absolute bottom-4 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-300 animate-twinkle"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-6 left-1/3 w-2 h-2 rounded-full bg-pink-300 animate-twinkle"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <AstroPatty
            mood="happy"
            size="md"
            speechText={`¡Hola ${userProfile.name}! Soy Patty. Explora Instrumentos, Animales, Voz Humana o Notas Musicales y entrena tu superoído cósmico.`}
          />

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onViewAchievements}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/10 min-h-[46px]"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Mis Trofeos ({userProfile.unlockedAchievements.length}/10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selector Toggle: Instrumentos 🎵 vs Animales 🦉 vs Voz Humana 🗣️ vs Notas Musicales 🎹 */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center sm:text-left">
          Elige el Banco de Sonidos:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto sm:mx-0">
          {THEME_MODES.map((mode) => {
            const isSelected = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  soundManager.playTap();
                  onSelectMode(mode.id);
                }}
                className={`p-3.5 sm:p-4 rounded-3xl border-2 transition-all flex items-center gap-3 text-left relative min-h-[72px] ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-102 ring-2 ring-cyan-400/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <span className="text-3xl shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>
                  {mode.emoji}
                </span>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-base font-extrabold text-white truncate">
                      {mode.title}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded-full shrink-0">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{mode.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center sm:text-left space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
          <span>Misiones en {activeModeInfo.title}</span>
          <span className="text-2xl">{activeModeInfo.emoji}</span>
        </h2>
        <p className="text-sm text-slate-300">
          Entrena tu superoído con dificultad progresiva: Nivel 1 (2 sonidos) y Niveles 2 y 3 (secuencias de 3 sonidos), con timbres únicos y su duración natural.
        </p>
      </div>

      {/* Category Cards (3 or 4 depending on mode) */}
      <div
        className={`grid ${
          categoriesList.length === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-3'
        } gap-5`}
      >
        {categoriesList.map((cat, idx) => {
          const unlockedMax = userProfile.unlockedLevels[currentMode][cat.id] || 3;
          const starsEarned = userProfile.starsPerCategory[currentMode][cat.id] || 0;
          const activeLevel = selectedLevels[cat.id] || 1;
          const optionsForMode = getCategoryOptions(cat.id, currentMode, activeLevel);

          return (
            <div
              key={cat.id}
              className={`group relative bg-gradient-to-b ${cat.themeColor.bgGradient} rounded-3xl p-5 border-2 ${cat.themeColor.border} shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1`}
            >
              {/* Top Card Bar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center shadow-md">
                    {getCategoryIcon(cat.iconName)}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-extrabold text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-xl border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>3 Niveles Listos</span>
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{starsEarned} estrellas</span>
                    </div>
                  </div>
                </div>

                {/* Number & Title */}
                <div className="space-y-1 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Misión 0{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-300">
                    {cat.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {cat.description}
                </p>

                {/* Sound Demonstration Samples */}
                <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-2 mb-4">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                    <span>Muestra:</span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      ⏱️ Duración real
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {optionsForMode.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={(e) => handleTestSound(e, opt.value)}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 active:scale-95 transition-all text-center min-h-[56px] group/sample"
                      >
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <span className="text-lg group-hover/sample:scale-110 transition-transform">
                            {opt.emoji}
                          </span>
                          <span className="truncate max-w-[80px]">{opt.label.split(' ')[0]}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                          {opt.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Area: Level Selector Tabs & Play Button with Progressive Difficulty */}
              <div className="space-y-2.5 pt-2">
                {/* 3 Level Pills with Progressive sound counts */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                    <span>Dificultad progresiva:</span>
                    <span className="text-amber-400 font-semibold">
                      {activeLevel === 1
                        ? 'N1 (Fácil · 2 sonidos)'
                        : activeLevel === 2
                        ? 'N2 (Medio · 3 sonidos)'
                        : 'N3 (Desafío · 2, 3 y 4 Opc.)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
                    {[1, 2, 3].map((lvl) => {
                      const isSelected = activeLevel === lvl;
                      const isUnlocked = lvl <= unlockedMax;
                      const countText = lvl === 3 ? '2, 3 y 4 Opc.' : lvl === 1 ? '2 sonidos' : '3 sonidos';
                      const diffTag = lvl === 1 ? 'Fácil' : lvl === 2 ? 'Medio' : '2, 3 y 4 Opc.';
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundManager.playTap();
                            setSelectedLevels((prev) => ({ ...prev, [cat.id]: lvl }));
                          }}
                          className={`py-1.5 px-1.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? lvl === 1
                                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md shadow-emerald-400/20 scale-102 ring-1 ring-emerald-300'
                                : lvl === 2
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md shadow-amber-400/20 scale-102 ring-1 ring-amber-300'
                                : 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/30 scale-102 ring-2 ring-amber-300'
                              : isUnlocked
                              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
                              : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <span className="text-[11px]">Nivel {lvl}</span>
                          <span className="text-[9px] font-bold opacity-90">{countText}</span>
                          <span className="text-[8px] opacity-75">{diffTag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => onSelectCategory(cat.id, activeLevel)}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-98 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {activeLevel === 3
                      ? 'Jugar Nivel 3 (Discriminación: 2 Opciones)'
                      : `Jugar Nivel ${activeLevel} (${activeLevel === 1 ? '2 sonidos' : '3 sonidos'})`}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Therapy Tip */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <p>
            <strong className="text-slate-200">Estimulación fonoaudiológica:</strong> Alternar entre instrumentos, animales, voz humana y notas musicales estimula la discriminación tímbrica, la prosodia del habla y la percepción fonológica.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-cyan-300 font-semibold">
          <span>Modo {userProfile.playbackSpeed === 'normal' ? 'Normal (0.5s)' : 'Lento (0.85s)'}</span>
        </div>
      </div>
    </div>
  );
};
