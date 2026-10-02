import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Volume2,
  Headphones,
  RotateCcw,
  Check,
  MoveHorizontal,
  X,
  Square,
} from 'lucide-react';
import {
  CategoryId,
  Challenge,
  PatternItem,
  SoundOption,
  SoundThemeMode,
  UserProfile,
} from '../types/game';
import { CATEGORIES_DATA, getCategoryOptions, findOptionMeta } from '../data/categoriesData';
import { LEVEL_CHALLENGES } from '../data/levelsData';
import { soundManager, SOUND_DURATION_SEC } from '../services/audioEngine';
import { AstroPatty, AstroMood } from './AstroPatty';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';
import { FeedbackModal } from './FeedbackModal';
import { SyntheticLevel3Screen } from './SyntheticLevel3Screen';

interface GameScreenProps {
  categoryId: CategoryId;
  themeMode: SoundThemeMode;
  initialLevel?: number;
  userProfile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
  onBackToMenu: () => void;
  onTriggerAchievementCheck: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  categoryId,
  themeMode,
  initialLevel = 1,
  userProfile,
  onUpdateProfile,
  onBackToMenu,
  onTriggerAchievementCheck,
}) => {
  const categoryInfo = CATEGORIES_DATA[categoryId];
  const [level, setLevel] = useState<number>(initialLevel);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const challenges: Challenge[] =
    LEVEL_CHALLENGES[themeMode]?.[categoryId]?.[level] ||
    LEVEL_CHALLENGES[themeMode]?.[categoryId]?.[1] ||
    LEVEL_CHALLENGES.instruments?.frequency?.[1] ||
    [];

  const currentChallenge = challenges[questionIndex] || challenges[0];
  const sequenceLength = currentChallenge.sequence.length;
  const optionsForMode = getCategoryOptions(categoryId, themeMode, level);

  // Dynamic pause duration based on level (Progressive Difficulty)
  const pauseDurationSec = level === 1 ? 1.0 : level === 2 ? 0.75 : 0.55;

  // User input slots: dynamically matches current challenge sequence length (3, 4, or 5)
  const [userSlots, setUserSlots] = useState<(PatternItem | null)[]>(
    new Array(currentChallenge.sequence.length).fill(null)
  );

  // Audio Playback state (HQ 44.1/48kHz)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activePlaybackStep, setActivePlaybackStep] = useState<number | null>(null);
  const [activePlaybackItem, setActivePlaybackItem] = useState<string | null>(null);
  const [stepElapsedSec, setStepElapsedSec] = useState<number>(0);
  const [stepTotalSec, setStepTotalSec] = useState<number>(3.0);
  const [isPausedBetweenSteps, setIsPausedBetweenSteps] = useState<boolean>(false);
  const [hasListenedAtLeastOnce, setHasListenedAtLeastOnce] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Drag and Drop state
  const [draggedItem, setDraggedItem] = useState<PatternItem | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [recentlyDroppedSlot, setRecentlyDroppedSlot] = useState<number | null>(null);
  const [bouncingOption, setBouncingOption] = useState<string | null>(null);

  // Game attempt tracking and Patty Mascot reaction
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'success' | 'retry'>('idle');
  const [awardedStars, setAwardedStars] = useState<number>(0);
  const [astroMood, setAstroMood] = useState<AstroMood>('happy');
  const [astroSpeech, setAstroSpeech] = useState<string>(
    '¡Presiona "Escuchar Secuencia" para oír cada sonido!'
  );

  // Reset state on question change
  useEffect(() => {
    if (level === 3) return; // Nivel 3 uses its own synthetic audio engine and controls

    const seqLen = currentChallenge.sequence.length;
    setUserSlots(new Array(seqLen).fill(null));
    setFeedbackState('idle');
    setAttemptCount(1);
    setHasListenedAtLeastOnce(false);
    setActivePlaybackStep(null);
    setActivePlaybackItem(null);
    setStepElapsedSec(0);
    setStepTotalSec(3.0);
    setIsPausedBetweenSteps(false);
    setShowHint(false);
    setAstroMood('happy');

    const levelBadgeText =
      level === 1
        ? `Nivel 1 (Fácil · 2 sonidos)`
        : `Nivel 2 (Medio · 3 sonidos)`;

    const opt1 = optionsForMode[0]?.label || 'Sonido 1';
    const opt2 = optionsForMode[1]?.label || 'Sonido 2';

    const promptSpeech =
      currentChallenge.hint ||
      `Desafío ${questionIndex + 1} (${levelBadgeText}): Escucha con atención la secuencia de ${seqLen} sonidos entre ${opt1} y ${opt2}.`;

    setAstroSpeech(promptSpeech);

    const timer = setTimeout(() => {
      handlePlaySequence();
    }, 600);

    return () => {
      clearTimeout(timer);
      soundManager.stopCurrentSequence();
    };
  }, [questionIndex, level, categoryId, themeMode]);

  // Play full sequence (with item-specific duration and level-scaled pause)
  const handlePlaySequence = () => {
    if (isPlayingAudio) return;

    soundManager.stopCurrentSequence();
    setIsPlayingAudio(true);
    setActivePlaybackStep(null);
    setIsPausedBetweenSteps(false);
    setStepElapsedSec(0);
    setAstroMood('listening');
    setAstroSpeech(
      categoryId === 'duration'
        ? `¡Patty se puso sus audífonos! Escuchando patrón de ${sequenceLength} sonidos de Duración (Corto vs Largo)...`
        : `¡Sshhh! Patty se puso sus audífonos dorados. Escuchando secuencia de ${sequenceLength} sonidos (Nivel ${level})...`
    );

    if (hasListenedAtLeastOnce) {
      onUpdateProfile((prev) => ({
        ...prev,
        replaysCount: prev.replaysCount + 1,
      }));
    }
    setHasListenedAtLeastOnce(true);

    soundManager.playSequence(
      currentChallenge.sequence,
      userProfile.playbackSpeed,
      {
        onStepStart: (stepIdx, item, duration) => {
          setActivePlaybackStep(stepIdx);
          setActivePlaybackItem(item);
          setStepTotalSec(duration);
          setIsPausedBetweenSteps(false);
          setStepElapsedSec(0);
          setAstroMood('listening');
          setAstroSpeech(
            categoryId === 'duration'
              ? duration <= 1
                ? `Sonido ${stepIdx + 1} de ${sequenceLength}: ¡Sonido CORTO (${duration.toFixed(1)}s rápido y seco)!`
                : `Sonido ${stepIdx + 1} de ${sequenceLength}: ¡Sonido LARGO (${duration.toFixed(1)}s sostenido en el tiempo)!`
              : `Sonido ${stepIdx + 1} de ${sequenceLength} en reproducción... siente su sonido.`
          );
        },
        onStepProgress: (_stepIdx, elapsedSec) => {
          setStepElapsedSec(elapsedSec);
        },
        onPauseStart: (afterStep) => {
          setIsPausedBetweenSteps(true);
          setAstroMood('thinking');
          setAstroSpeech(
            `Pausa (${pauseDurationSec.toFixed(2)}s)... procesa y recuerda el sonido ${afterStep + 1} de ${sequenceLength}.`
          );
        },
        onStepEnd: () => {
          // Keep active step state handled
        },
        onComplete: () => {
          setIsPlayingAudio(false);
          setActivePlaybackStep(null);
          setActivePlaybackItem(null);
          setIsPausedBetweenSteps(false);
          setStepElapsedSec(0);
          setAstroMood('thinking');
          setAstroSpeech(
            `¿Pudiste distinguir los ${sequenceLength} sonidos? ¡Arrastra cada tarjeta a su casillero en orden!`
          );
        },
      },
      pauseDurationSec
    );
  };

  const handleStopSequence = () => {
    soundManager.stopCurrentSequence();
    setIsPlayingAudio(false);
    setActivePlaybackStep(null);
    setIsPausedBetweenSteps(false);
    setStepElapsedSec(0);
    setAstroMood('happy');
    setAstroSpeech('Reproducción detenida. Puedes escucharla de nuevo cuando estés listo.');
  };

  // Preview an option when touched/clicked
  const handleOptionInteract = (opt: SoundOption) => {
    setBouncingOption(opt.value);
    setTimeout(() => setBouncingOption(null), 400);

    // Play high fidelity 5s sample preview
    soundManager.playPatternSound(opt.value);

    // Touch fallback: auto-place in the first empty slot
    setUserSlots((prev) => {
      const emptyIdx = prev.findIndex((s) => s === null);
      if (emptyIdx !== -1) {
        const next = [...prev];
        next[emptyIdx] = opt.value;
        triggerSlotDropEffect(emptyIdx);
        return next;
      }
      return prev;
    });
  };

  const triggerSlotDropEffect = (slotIndex: number) => {
    soundManager.playDropSound();
    setRecentlyDroppedSlot(slotIndex);
    setTimeout(() => setRecentlyDroppedSlot(null), 600);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, itemValue: PatternItem) => {
    setDraggedItem(itemValue);
    e.dataTransfer.setData('text/plain', itemValue);
    soundManager.playPatternSound(itemValue);
  };

  const handleDragOver = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setDragOverSlot(slotIdx);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDropOnSlot = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    const item = (e.dataTransfer.getData('text/plain') as PatternItem) || draggedItem;

    if (item) {
      setUserSlots((prev) => {
        const next = [...prev];
        next[slotIdx] = item;
        return next;
      });
      triggerSlotDropEffect(slotIdx);
      setDraggedItem(null);

      onUpdateProfile((prev) => ({
        ...prev,
        dragDropSuccessCount: prev.dragDropSuccessCount + 1,
      }));
    }
  };

  const handleRemoveSlotItem = (slotIdx: number) => {
    soundManager.playTap();
    setUserSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
  };

  const handleClearAllSlots = () => {
    soundManager.playTap();
    setUserSlots(new Array(currentChallenge.sequence.length).fill(null));
  };

  // Confirm and validate sequence
  const handleConfirmAnswer = () => {
    if (userSlots.some((s) => s === null)) return;

    soundManager.stopCurrentSequence();
    const correctSeq = currentChallenge.sequence;
    const isCorrect =
      userSlots.length === correctSeq.length &&
      userSlots.every((slot, idx) => slot === correctSeq[idx]);

    if (isCorrect) {
      const stars = attemptCount === 1 ? 3 : 2;
      setAwardedStars(stars);
      setFeedbackState('success');
      setAstroMood('cheering');
      setAstroSpeech(`¡Excelente oído cósmico! ¡La secuencia de ${sequenceLength} sonidos fue descifrada a la perfección!`);

      onUpdateProfile((prev) => {
        const modeStars = {
          ...(prev.starsPerCategory[themeMode] || {}),
          [categoryId]: ((prev.starsPerCategory[themeMode] && prev.starsPerCategory[themeMode][categoryId]) || 0) + stars,
        };

        const isLastQuestion = questionIndex === challenges.length - 1;
        const currentUnlocked = (prev.unlockedLevels[themeMode] && prev.unlockedLevels[themeMode][categoryId]) || 1;
        const nextUnlockedLevel =
          isLastQuestion && level < 3 ? Math.max(currentUnlocked, level + 1) : currentUnlocked;

        return {
          ...prev,
          totalStars: prev.totalStars + stars,
          starsPerCategory: {
            ...prev.starsPerCategory,
            [themeMode]: modeStars,
          },
          completedChallengesCount: prev.completedChallengesCount + 1,
          firstTryWins: attemptCount === 1 ? prev.firstTryWins + 1 : prev.firstTryWins,
          totalPlays: prev.totalPlays + 1,
          unlockedLevels: {
            ...prev.unlockedLevels,
            [themeMode]: {
              ...(prev.unlockedLevels[themeMode] || {}),
              [categoryId]: nextUnlockedLevel,
            },
          },
        };
      });

      soundManager.playVictoryFanfare();
      onTriggerAchievementCheck();
    } else {
      setFeedbackState('retry');
      setAttemptCount((prev) => prev + 1);
      setAstroMood('doubt');
      setAstroSpeech(
        categoryId === 'duration'
          ? themeMode === 'instruments'
            ? 'Mmm... ¿Lo escuchamos de nuevo? ¡Recuerda que la GUITARRA es corta (2s) y el XILÓFONO es largo (4s)!'
            : themeMode === 'voices'
            ? 'Mmm... ¿Lo escuchamos de nuevo? ¡Recuerda que "Hola" es corta y "Hoolaaaaa" es larga sostenida!'
            : themeMode === 'notes'
            ? 'Mmm... ¿Lo escuchamos de nuevo? ¡Recuerda que Staccato es CORTA (0.75s) y Tenuto es LARGA sostenida (3.5s)!'
            : 'Mmm... ¿Lo escuchamos de nuevo? ¡Recuerda que el sonido CORTO termina rápido y el LARGO dura 3 segundos!'
          : categoryId === 'prosody'
          ? themeMode === 'voices'
            ? 'Mmm... ¿Lo escuchamos de nuevo? ¡Presta atención a si la voz sube con curiosidad de PREGUNTA ("¿Vamos a jugar?") o afirma con energía de EXCLAMACIÓN ("¡Vamos a jugar!")!'
            : 'Mmm... ¿Lo escuchamos de nuevo? ¡Presta atención a si la frase sube con curiosidad de PREGUNTA o concluye afirmativa como EXCLAMACIÓN!'
          : 'Mmm... ¿Lo escuchamos de nuevo? ¡Escucha con atención cada sonido de 3 segundos!'
      );
      soundManager.playRetryChime();
    }
  };

  const handleNextQuestion = () => {
    setFeedbackState('idle');
    if (questionIndex < challenges.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      if (level < 3) {
        setLevel((prev) => prev + 1);
        setQuestionIndex(0);
      } else {
        onBackToMenu();
      }
    }
  };

  const handleRetryReplay = () => {
    setFeedbackState('idle');
    handlePlaySequence();
  };

  const isAllFilled = userSlots.every((s) => s !== null);

  const getOptionMeta = (itemValue: PatternItem): SoundOption => {
    return (
      optionsForMode.find((o) => o.value === itemValue) ||
      findOptionMeta(itemValue) || {
        value: itemValue,
        label: String(itemValue),
        helper: '',
        emoji: '🎵',
        color: 'from-cyan-400 to-blue-500',
        description: '',
        tag: 'Sonido',
      }
    );
  };

  // If Level 3 is active, render the dedicated Synthetic Stimulus module with 2 alternatives
  if (level === 3) {
    return (
      <SyntheticLevel3Screen
        categoryId={categoryId}
        themeMode={themeMode}
        userProfile={userProfile}
        onUpdateProfile={onUpdateProfile}
        onBackToMenu={onBackToMenu}
        onChangeLevel={(newLvl) => {
          setLevel(newLvl);
          setQuestionIndex(0);
        }}
        onTriggerAchievementCheck={onTriggerAchievementCheck}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-4 sm:space-y-6 pb-28">
      {/* Top Header Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-md">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm min-h-[44px] transition-colors border border-slate-700 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Misiones</span>
        </button>

        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black">
            <span className="text-cyan-300">{categoryInfo.title}</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-300">
              Nivel {level} ({level === 1 ? 'Fácil · 2 sonidos' : 'Medio · 3 sonidos'})
            </span>
          </div>

          {/* Level Switcher Buttons in Top Bar with sound count */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {[1, 2, 3].map((lvl) => {
              const isCurrent = level === lvl;
              const soundCount = lvl === 3 ? '2, 3 y 4 Opc.' : lvl === 1 ? '2' : '3';
              const difficultyName = lvl === 1 ? 'Fácil' : lvl === 2 ? 'Medio' : '2, 3 y 4 Opciones';
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    if (level !== lvl) {
                      soundManager.stopCurrentSequence();
                      soundManager.playTap();
                      setLevel(lvl);
                      setQuestionIndex(0);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 ${
                    isCurrent
                      ? lvl === 1
                        ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30 ring-2 ring-emerald-300 scale-105'
                        : lvl === 2
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 ring-2 ring-amber-300 scale-105'
                        : 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 ring-2 ring-amber-300 scale-105'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                  title={`Jugar Nivel ${lvl} (${soundCount} · ${difficultyName})`}
                >
                  <span>Nivel {lvl}</span>
                  <span className="text-[9px] opacity-80 font-bold">({soundCount})</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            Desafío {questionIndex + 1} de {challenges.length}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1">
          {challenges.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                i < questionIndex
                  ? 'bg-emerald-400 ring-2 ring-emerald-400/30'
                  : i === questionIndex
                  ? 'bg-amber-400 animate-pulse ring-2 ring-amber-400/40'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Central Zone: Speaker Button + Audio Wave Visualizer with Live Progress */}
      <div className="bg-gradient-to-b from-slate-900/95 via-slate-900 to-indigo-950/70 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center gap-4">
        {/* Dynamic Waveform Visualizer */}
        <AudioWaveVisualizer
          isPlaying={isPlayingAudio}
          activeStep={activePlaybackStep}
          sequenceLength={sequenceLength}
          activeItem={activePlaybackItem}
          elapsedSec={stepElapsedSec}
          totalSec={stepTotalSec}
          isPausedBetweenSteps={isPausedBetweenSteps}
          categoryThemeColor={categoryInfo.themeColor.primary}
        />

        {/* Big "Escuchar Secuencia" Prominent Speaker Button / Stop Button */}
        <div className="flex items-center gap-3 w-full justify-center flex-wrap">
          {!isPlayingAudio ? (
            <button
              onClick={handlePlaySequence}
              className="relative group px-6 sm:px-9 py-3.5 sm:py-4 rounded-3xl font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl min-h-[60px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/30 hover:scale-102 cursor-pointer active:scale-95"
              aria-label="Escuchar Secuencia"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/30 flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5 text-slate-950" />
              </div>

              <span className="tracking-wide">
                {hasListenedAtLeastOnce
                  ? `Volver a Escuchar Secuencia (${sequenceLength} sonidos)`
                  : `Escuchar Secuencia (${sequenceLength} sonidos)`}
              </span>

              {hasListenedAtLeastOnce && (
                <RotateCcw className="w-4 h-4 ml-1 opacity-70 group-hover:rotate-180 transition-transform duration-500" />
              )}
            </button>
          ) : (
            <button
              onClick={handleStopSequence}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-black text-base flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl shadow-amber-400/40 ring-4 ring-amber-300/40 animate-pulse active:scale-95 cursor-pointer min-h-[60px]"
            >
              <div className="w-9 h-9 rounded-2xl bg-slate-950/20 flex items-center justify-center shrink-0">
                <Square className="w-4 h-4 fill-current text-slate-950" />
              </div>
              <span>
                {activePlaybackStep !== null && !isPausedBetweenSteps
                  ? `Sonando ${activePlaybackStep + 1}/${sequenceLength} (${stepTotalSec.toFixed(1)}s natural)... Toca para pausar`
                  : `Pausa (${pauseDurationSec.toFixed(2)}s)... Toca para cancelar`}
              </span>
            </button>
          )}
        </div>

        {/* Quality and Timing Info Specs with Progressive Difficulty Badge */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-[11px] text-slate-400 text-center font-medium max-w-lg">
            {categoryId === 'duration'
              ? `🎧 Misión 2 (Duración): Nivel ${level} con ${sequenceLength} sonidos (tiempo y duración natural de cada sonido) y ${pauseDurationSec.toFixed(2)}s de silencio entre notas.`
              : `🎧 Misión Sonora: Nivel ${level} con ${sequenceLength} sonidos (tiempo y duración natural) y ${pauseDurationSec.toFixed(2)}s de silencio para entrenar tu memoria auditiva.`}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-cyan-300 font-semibold">
            <span>Dificultad:</span>
            <span className={level === 1 ? 'text-emerald-400' : level === 2 ? 'text-amber-400' : 'text-purple-400'}>
              {level === 1 ? 'Nivel 1 (Fácil · 2 sonidos · Ritmo pausado 1.0s)' : level === 2 ? 'Nivel 2 (Medio · 3 sonidos · Ritmo moderado 0.75s)' : 'Nivel 3 (Avanzado · 3 sonidos · Ritmo ágil 0.55s)'}
            </span>
          </div>
        </div>
      </div>

      {/* DRAG AND DROP ZONE: Casilleros Vacíos Numerados Dynamically */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Construye la Secuencia</span>
              <span className="text-cyan-400 text-xs sm:text-sm font-semibold">
                ({sequenceLength} Casilleros)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Coloca los {sequenceLength} sonidos en los casilleros del 1 al {sequenceLength} en el mismo orden que escuchaste.
            </p>
          </div>

          {userSlots.some((s) => s !== null) && (
            <button
              onClick={handleClearAllSlots}
              className="text-xs text-slate-400 hover:text-rose-400 font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-rose-500/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar todo</span>
            </button>
          )}
        </div>

        {/* The Interactive Casilleros with Dynamic Grid */}
        <div
          className={`grid gap-2.5 sm:gap-3.5 ${
            sequenceLength === 2
              ? 'grid-cols-2 max-w-md mx-auto'
              : sequenceLength === 3
              ? 'grid-cols-3'
              : sequenceLength === 4
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
          }`}
        >
          {userSlots.map((slot, slotIdx) => {
            const hasItem = slot !== null;
            const meta = hasItem ? getOptionMeta(slot!) : null;
            const isPlayingThisStep = activePlaybackStep === slotIdx && !isPausedBetweenSteps;
            const isDropTarget = dragOverSlot === slotIdx;
            const justDropped = recentlyDroppedSlot === slotIdx;

            return (
              <div
                key={slotIdx}
                onDragOver={(e) => handleDragOver(e, slotIdx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropOnSlot(e, slotIdx)}
                className={`relative min-h-[125px] sm:min-h-[145px] rounded-3xl border-2 flex flex-col items-center justify-center p-3 transition-all duration-300 select-none ${
                  isPlayingThisStep
                    ? 'bg-amber-400/25 border-amber-300 ring-4 ring-amber-400/60 scale-104 shadow-2xl shadow-amber-400/40'
                    : isDropTarget
                    ? 'bg-cyan-500/20 border-cyan-400 ring-4 ring-cyan-400/40 scale-102'
                    : hasItem
                    ? 'bg-slate-800/90 border-cyan-400/70 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-dashed border-slate-700/80 hover:border-slate-500'
                }`}
              >
                {/* Number Badge 1, 2, 3 */}
                <div
                  className={`absolute top-2 left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    isPlayingThisStep
                      ? 'bg-amber-400 text-slate-950 scale-110 shadow-sm'
                      : hasItem
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {slotIdx + 1}
                </div>

                {/* Remove button if slot is filled */}
                {hasItem && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlotItem(slotIdx)}
                    title="Quitar de este casillero"
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-500 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {hasItem && meta ? (
                  <div
                    className={`flex flex-col items-center gap-1.5 text-center ${
                      justDropped ? 'animate-bounce' : ''
                    }`}
                  >
                    {/* Emoji Card */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${meta.color} flex items-center justify-center text-2xl sm:text-3xl shadow-md transition-transform hover:scale-105 cursor-pointer`}
                      onClick={() => soundManager.playPatternSound(meta.value)}
                      title="Toca para escuchar de nuevo"
                    >
                      {meta.emoji}
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {meta.label}
                    </span>

                    <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {meta.tag}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-500 py-2">
                    <span className="text-2xl opacity-40">📥</span>
                    <span className="text-xs font-bold text-slate-400">
                      Casillero {slotIdx + 1}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Suelta aquí
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DRAGGABLE CARDS TRAY */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <MoveHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Arrastra estas tarjetas hacia los casilleros:</span>
            </span>
            <span className="text-[11px] text-cyan-400 hidden sm:inline">
              (Toca una tarjeta para escuchar su sonido)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {optionsForMode.map((opt) => {
              const isBouncing = bouncingOption === opt.value;

              return (
                <div
                  key={opt.value}
                  draggable
                  onDragStart={(e) => handleDragStart(e, opt.value)}
                  onClick={() => handleOptionInteract(opt)}
                  className={`relative group bg-slate-800/90 border-2 border-slate-700 hover:border-cyan-400 rounded-3xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-md transition-all cursor-grab active:cursor-grabbing hover:shadow-cyan-500/10 active:scale-95 ${
                    isBouncing ? 'animate-bounce ring-4 ring-cyan-400/40' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${opt.color} flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0 transition-transform group-hover:scale-108`}
                    >
                      {opt.emoji}
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-200">
                        {opt.label}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-medium leading-tight">
                        {opt.helper}
                      </p>
                      <span className="text-[10px] text-cyan-300 font-bold">
                        {opt.tag} · {opt.description}
                      </span>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-slate-700/80 group-hover:bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-slate-600 transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Big "Confirmar Respuesta" Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirmAnswer}
            disabled={!isAllFilled}
            className={`w-full h-14 sm:h-16 rounded-3xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-xl min-h-[56px] ${
              isAllFilled
                ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-emerald-500/30 active:scale-98 cursor-pointer ring-4 ring-emerald-400/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>
              {isAllFilled
                ? '¡Confirmar Secuencia!'
                : `Completa los ${sequenceLength} casilleros para comprobar`}
            </span>
          </button>
        </div>
      </div>

      {/* ANIMATED GUIDED MASCOT (PATTY) IN BOTTOM CORNER / COMPANION BAR */}
      <div className="bg-slate-900/90 border-2 border-cyan-500/30 rounded-3xl p-3 sm:p-4 shadow-xl">
        <AstroPatty
          mood={astroMood}
          size="md"
          speechText={astroSpeech}
        />
      </div>

      {/* Interactive Feedback Modal (Success or Retry) */}
      <FeedbackModal
        isOpen={feedbackState !== 'idle'}
        type={feedbackState === 'success' ? 'success' : 'retry'}
        starsAwarded={awardedStars}
        attemptCount={attemptCount}
        categoryTitle={categoryInfo.title}
        isLastQuestionOfLevel={questionIndex === challenges.length - 1}
        currentLevel={level}
        onNext={handleNextQuestion}
        onRetryReplay={handleRetryReplay}
        onClose={() => setFeedbackState('idle')}
      />
    </div>
  );
};
