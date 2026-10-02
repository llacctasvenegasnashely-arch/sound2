import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle,
  XCircle,
  Award,
  Square,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  Flame,
  MessageCircle,
} from 'lucide-react';
import { CategoryId, Level3Exercise, Level3Option, PatternItem, SoundThemeMode, UserProfile } from '../types/game';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { getLevel3Exercises } from '../data/level3Data';
import { soundManager } from '../services/audioEngine';
import { AstroPatty, AstroMood } from './AstroPatty';

interface SyntheticLevel3ScreenProps {
  categoryId: CategoryId;
  themeMode: SoundThemeMode;
  userProfile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
  onBackToMenu: () => void;
  onChangeLevel: (level: number) => void;
  onTriggerAchievementCheck: () => void;
}

export const SyntheticLevel3Screen: React.FC<SyntheticLevel3ScreenProps> = ({
  categoryId,
  themeMode,
  userProfile,
  onUpdateProfile,
  onBackToMenu,
  onChangeLevel,
  onTriggerAchievementCheck,
}) => {
  const categoryInfo = CATEGORIES_DATA[categoryId];
  const exercises: Level3Exercise[] = getLevel3Exercises(themeMode, categoryId);

  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const currentExercise = exercises[exerciseIndex] || exercises[0];

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasListened, setHasListened] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [totalSec, setTotalSec] = useState<number>(1.35);
  const [activeProsodyStep, setActiveProsodyStep] = useState<1 | 2 | null>(null);

  // Interaction & Scoring state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [starsAwardedThisRound, setStarsAwardedThisRound] = useState<number[]>([]);
  const [isRoundCompleted, setIsRoundCompleted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Mascot state
  const [astroMood, setAstroMood] = useState<AstroMood>('happy');
  const [astroSpeech, setAstroSpeech] = useState<string>('');

  const stopAudioRef = useRef<(() => void) | null>(null);

  // Get Category Dynamic Title & Subtitle based on SoundThemeMode
  const getCategoryThemeDetails = () => {
    if (themeMode === 'animals') {
      switch (categoryId) {
        case 'frequency':
          return {
            title: 'Tono / Frecuencia en Animales',
            sub: 'Escucha el sonido del animal y elige: ¿Canario (Agudo) o Búho (Grave)?',
            icon: <Activity className="w-5 h-5 text-cyan-400" />,
            accent: 'cyan',
            gradient: 'from-cyan-500/20 via-sky-900/40 to-slate-900',
          };
        case 'duration':
          return {
            title: 'Duración en Animales',
            sub: 'Escucha el sonido del animal: ¿Perro (Corto) o Vaca (Largo)?',
            icon: <Clock className="w-5 h-5 text-emerald-400" />,
            accent: 'emerald',
            gradient: 'from-emerald-500/20 via-teal-900/40 to-slate-900',
          };
        case 'intensity':
          return {
            title: 'Intensidad en Animales',
            sub: 'Escucha el sonido del animal: ¿Gatito (Suave) o Caballo (Fuerte)?',
            icon: <Flame className="w-5 h-5 text-rose-400" />,
            accent: 'rose',
            gradient: 'from-rose-500/20 via-pink-900/40 to-slate-900',
          };
      }
    } else if (themeMode === 'voices') {
      switch (categoryId) {
        case 'frequency':
          return {
            title: 'Tono / Frecuencia en Voz Humana',
            sub: 'Escucha la voz: ¿Vocal "A" Aguda de niña o Vocal "O" Grave de hombre?',
            icon: <Activity className="w-5 h-5 text-cyan-400" />,
            accent: 'cyan',
            gradient: 'from-cyan-500/20 via-sky-900/40 to-slate-900',
          };
        case 'duration':
          return {
            title: 'Duración en Voz Humana',
            sub: 'Escucha las palabras: ¿Palabra Corta ("Paz") o Palabra Larga ("Paaaazzzzz")?',
            icon: <Clock className="w-5 h-5 text-emerald-400" />,
            accent: 'emerald',
            gradient: 'from-emerald-500/20 via-teal-900/40 to-slate-900',
          };
        case 'intensity':
          return {
            title: 'Intensidad en Voz Humana',
            sub: 'Escucha la voz: ¿Susurro Suave ("Aquí...") o Voz Fuerte ("¡AQUÍ!")?',
            icon: <Flame className="w-5 h-5 text-rose-400" />,
            accent: 'rose',
            gradient: 'from-rose-500/20 via-pink-900/40 to-slate-900',
          };
        case 'prosody':
          return {
            title: 'Prosodia y Entonación en Frases',
            sub: 'Escucha la frase: ¿Pregunta curiosa ("¿Llegó el cohete?") o Exclamación ("¡Llegó el cohete!")?',
            icon: <MessageCircle className="w-5 h-5 text-amber-400" />,
            accent: 'amber',
            gradient: 'from-amber-500/20 via-orange-900/40 to-slate-900',
          };
      }
    } else if (themeMode === 'instruments') {
      switch (categoryId) {
        case 'frequency':
          return {
            title: 'Tono / Frecuencia en Instrumentos',
            sub: 'Escucha el instrumento: ¿Campana de Cristal (Aguda) o Timbal (Grave)?',
            icon: <Activity className="w-5 h-5 text-cyan-400" />,
            accent: 'cyan',
            gradient: 'from-cyan-500/20 via-sky-900/40 to-slate-900',
          };
        case 'duration':
          return {
            title: 'Duración en Instrumentos',
            sub: 'Escucha el instrumento: ¿Claves de Madera (Cortas) u Órgano (Largo)?',
            icon: <Clock className="w-5 h-5 text-emerald-400" />,
            accent: 'emerald',
            gradient: 'from-emerald-500/20 via-teal-900/40 to-slate-900',
          };
        case 'intensity':
          return {
            title: 'Intensidad en Instrumentos',
            sub: 'Escucha el instrumento: ¿Kalimba Suave o Tuba Potente (Fuerte)?',
            icon: <Flame className="w-5 h-5 text-rose-400" />,
            accent: 'rose',
            gradient: 'from-rose-500/20 via-pink-900/40 to-slate-900',
          };
      }
    } else if (themeMode === 'notes') {
      switch (categoryId) {
        case 'frequency':
          return {
            title: 'Tono / Frecuencia en Notas Musicales',
            sub: 'Escucha la nota: ¿Nota Aguda (600 Hz) o Nota Grave profunda?',
            icon: <Activity className="w-5 h-5 text-cyan-400" />,
            accent: 'cyan',
            gradient: 'from-cyan-500/20 via-sky-900/40 to-slate-900',
          };
        case 'duration':
          return {
            title: 'Duración en Notas Musicales',
            sub: 'Escucha la nota: ¿Nota Corta (Staccato) o Nota Larga (Tenuto)?',
            icon: <Clock className="w-5 h-5 text-emerald-400" />,
            accent: 'emerald',
            gradient: 'from-emerald-500/20 via-teal-900/40 to-slate-900',
          };
        case 'intensity':
          return {
            title: 'Intensidad en Notas Musicales',
            sub: 'Escucha la nota: ¿Nota Suave (Pianissimo) o Nota Fuerte (Fortissimo)?',
            icon: <Flame className="w-5 h-5 text-rose-400" />,
            accent: 'rose',
            gradient: 'from-rose-500/20 via-pink-900/40 to-slate-900',
          };
      }
    }

    return {
      title: 'Nivel 3: Discriminación Auditiva',
      sub: 'Escucha el estímulo sonoro y responde con la alternativa correcta.',
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      accent: 'indigo',
      gradient: 'from-indigo-500/20 via-purple-900/40 to-slate-900',
    };
  };

  const themeDetails = getCategoryThemeDetails();

  // Reset exercise state when question index or category changes
  useEffect(() => {
    setSelectedAnswer(null);
    setEvaluation('idle');
    setAttemptCount(1);
    setHasListened(false);
    setIsPlaying(false);
    setElapsedSec(0);
    setActiveProsodyStep(null);
    setShowHint(false);
    setAstroMood('happy');

    // Friendly initial mascot prompt based on current exercise and theme
    const optCount = currentExercise.options.length;
    let initialPrompt = `Presiona "Escuchar sonido". Escucha con atención y elige entre las ${optCount} alternativas de abajo.`;
    if (themeMode === 'animals') {
      initialPrompt = `¡Hola! Presiona "Escuchar sonido" para oír al animal y elige entre las ${optCount} alternativas.`;
    } else if (themeMode === 'voices') {
      initialPrompt = `Presiona "Escuchar sonido" para oír la voz humana y elige entre las ${optCount} alternativas.`;
    } else if (themeMode === 'instruments') {
      initialPrompt = `Presiona "Escuchar sonido" para oír el instrumento y elige entre las ${optCount} alternativas.`;
    } else if (themeMode === 'notes') {
      initialPrompt = `Presiona "Escuchar sonido" para oír la nota (agudos a 600 Hz) y elige entre las ${optCount} alternativas.`;
    }
    setAstroSpeech(initialPrompt);

    return () => {
      soundManager.stopSyntheticStimulus();
    };
  }, [exerciseIndex, categoryId, themeMode]);

  // Handle Play Sound Stimulus (real animal sound, voice word, instrument or 600Hz note)
  const handlePlaySound = () => {
    if (isPlaying) {
      handleStopSound();
      return;
    }

    soundManager.stopSyntheticStimulus();
    setIsPlaying(true);
    setHasListened(true);
    setElapsedSec(0);
    setAstroMood('listening');

    if (themeMode === 'voices') {
      if (categoryId === 'prosody') {
        setActiveProsodyStep(1);
        setAstroSpeech('Escuchando entonación de la frase... siente si sube con duda de pregunta 🛸 o afirma con exclamación 🚀.');
      } else if (categoryId === 'duration') {
        setAstroSpeech('Escuchando la palabra... ¿es la palabra corta ("Paz") o la palabra larga ("Paaaazzzzz")?');
      } else if (categoryId === 'intensity') {
        setAstroSpeech('Escuchando la voz humana... ¿es un susurro tenue ("Aquí...") o un grito fuerte ("¡AQUÍ!")?');
      } else {
        setAstroSpeech('Escuchando la voz humana... ¿es la vocal "A" aguda de niña o la vocal "O" grave de hombre?');
      }
    } else if (themeMode === 'animals') {
      if (categoryId === 'frequency') {
        setAstroSpeech('Escuchando el sonido del animal... ¿es el trino agudo del Canario 🐤 o el ulular grave del Búho 🦉?');
      } else if (categoryId === 'duration') {
        setAstroSpeech('Escuchando el sonido del animal... ¿es el ladrido corto del Perro 🐶 o el mugido largo de la Vaca 🐮?');
      } else {
        setAstroSpeech('Escuchando el sonido del animal... ¿es el maullido suave del Gatito 🐱, el trino tenue del Canario 🐤 o el relincho del Caballo 🐴?');
      }
    } else if (themeMode === 'instruments') {
      if (categoryId === 'frequency') {
        setAstroSpeech('Escuchando el instrumento musical... ¿es la campana aguda brillante 🔔 o el timbal sinfónico grave 🪘?');
      } else if (categoryId === 'duration') {
        setAstroSpeech('Escuchando el instrumento musical... ¿es el golpe corto de claves 🪵 o el acorde largo de órgano 🎹?');
      } else {
        setAstroSpeech('Escuchando el instrumento musical... ¿es la kalimba suave 🪵 o la tuba potente a pleno volumen 📯?');
      }
    } else {
      if (categoryId === 'frequency') {
        setAstroSpeech('Escuchando la nota musical... ¿es la nota aguda afinada en 600 Hz 🎼 o la nota grave profunda 🎻?');
      } else if (categoryId === 'duration') {
        setAstroSpeech('Escuchando la nota musical... ¿es la nota corta staccato ⚡ o la nota larga tenuto ⏳?');
      } else {
        setAstroSpeech('Escuchando la nota musical... ¿es la nota suave pianissimo 🌙 o la nota fuerte fortissimo 💥?');
      }
    }

    let soundItem = currentExercise.soundItem || (currentExercise.correctAnswer as PatternItem);

    // En Nivel 3 Sección Animales: elefante, rana_toro y pato veloz no deben sonar nunca (solo aparecen como alternativas)
    if (themeMode === 'animals') {
      if (soundItem === 'elefante') {
        soundItem = 'caballo';
      } else if (soundItem === 'rana_toro') {
        soundItem = 'buho';
      } else if (soundItem === 'pato') {
        soundItem = 'perro';
      }
    }

    const isSoftItem =
      categoryId === 'intensity' &&
      (soundItem === 'canario' ||
        soundItem === 'gato' ||
        soundItem === 'pajarito_suave' ||
        soundItem === 'kalimba_suave' ||
        soundItem === 'caja_musica_suave' ||
        soundItem === 'nota_sol_pianissimo' ||
        soundItem === 'nota_mi_pianissimo' ||
        soundItem === 'voz_susurro_aqui2' ||
        soundItem === 'voz_susurro_silencio');

    if (soundItem) {
      const { duration, stop } = soundManager.playLevel3Sound(
        soundItem,
        {
          onStart: () => {
            setIsPlaying(true);
          },
          onProgress: (elapsed, total) => {
            setElapsedSec(elapsed);
            setTotalSec(total);
          },
          onEnd: () => {
            setIsPlaying(false);
            setActiveProsodyStep(null);
            setAstroMood('thinking');
            setAstroSpeech(`¿Qué sonido escuchaste? Elige entre las ${currentExercise.options.length} alternativas de abajo.`);
          },
        },
        isSoftItem
      );

      setTotalSec(duration);
      stopAudioRef.current = stop;
    }
  };

  const handleStopSound = () => {
    soundManager.stopSyntheticStimulus();
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    setIsPlaying(false);
    setActiveProsodyStep(null);
    setAstroMood('happy');
    setAstroSpeech('Sonido detenido. Puedes presionar "Escuchar sonido" de nuevo cuando desees.');
  };

  // Handle User Response Selection
  const handleSelectOption = (opt: Level3Option) => {
    if (evaluation === 'correct') return; // Already solved

    if (!hasListened) {
      setAstroMood('doubt');
      setAstroSpeech('¡Primero presiona el botón central "Escuchar sonido" para oír el estímulo antes de responder!');
      soundManager.playTap();
      return;
    }

    setSelectedAnswer(opt.value);
    const isCorrect = opt.value === currentExercise.correctAnswer;

    if (isCorrect) {
      setEvaluation('correct');
      setAstroMood('cheering');
      soundManager.playVictoryFanfare();

      // Confetti burst
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
        });
      } catch {
        // Fallback
      }

      const stars = attemptCount === 1 ? 3 : 2;
      setStarsAwardedThisRound((prev) => [...prev, stars]);

      // Dynamic feedback speech according to chosen option
      setAstroSpeech(
        `¡Excelente! Supiste reconocer con tu superoído: ${opt.label} (${opt.subtitle}). ¡Gran trabajo!`
      );

      // Update user profile stars & achievements
      onUpdateProfile((prev) => {
        const currentCatStars = prev.starsPerCategory?.[themeMode]?.[categoryId] || 0;
        const updatedCatStars = currentCatStars + stars;

        return {
          ...prev,
          totalStars: prev.totalStars + stars,
          starsPerCategory: {
            ...prev.starsPerCategory,
            [themeMode]: {
              ...(prev.starsPerCategory?.[themeMode] || {}),
              [categoryId]: updatedCatStars,
            },
          },
          completedChallengesCount: prev.completedChallengesCount + 1,
          firstTryWins: attemptCount === 1 ? prev.firstTryWins + 1 : prev.firstTryWins,
          totalPlays: prev.totalPlays + 1,
        };
      });

      onTriggerAchievementCheck();
    } else {
      setEvaluation('wrong');
      setAttemptCount((prev) => prev + 1);
      setAstroMood('doubt');
      soundManager.playTap();

      if (categoryId === 'duration') {
        setAstroSpeech(
          '¡Casi lo tienes! Vuelve a presionar "Escuchar sonido". Presta atención a cuántos segundos dura.'
        );
      } else if (categoryId === 'frequency') {
        setAstroSpeech(
          '¡Buen intento! Escucha de nuevo el tono: ¿es brillante y alto (Agudo) o hondo y profundo (Grave)?'
        );
      } else if (categoryId === 'intensity') {
        setAstroSpeech(
          '¡Sigue intentando! Vuelve a escuchar: ¿sonó muy despacio (Suave) o con volumen alto (Fuerte)?'
        );
      } else if (categoryId === 'prosody') {
        setAstroSpeech(
          '¡Escucha una vez más! Compara los dos tonos: ¿el segundo sonido sube hacia arriba o baja?'
        );
      }
    }
  };

  // Move to next exercise
  const handleNextExercise = () => {
    soundManager.playTap();
    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex((prev) => prev + 1);
    } else {
      setIsRoundCompleted(true);
      soundManager.playVictoryFanfare();
    }
  };

  // Replay entire level 3 round
  const handleRestartRound = () => {
    soundManager.playTap();
    setExerciseIndex(0);
    setStarsAwardedThisRound([]);
    setIsRoundCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.stopSyntheticStimulus();
              onBackToMenu();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all text-xs sm:text-sm font-bold min-h-[42px]"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Misiones</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-black">
            {themeDetails.icon}
            <span className="hidden sm:inline">{themeDetails.title}</span>
            <span className="sm:hidden">{categoryInfo.title}</span>
          </div>
        </div>

        {/* Level Switcher (N1, N2, N3 Active) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              soundManager.stopSyntheticStimulus();
              onChangeLevel(1);
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Nivel 1
          </button>
          <button
            onClick={() => {
              soundManager.stopSyntheticStimulus();
              onChangeLevel(2);
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Nivel 2
          </button>
          <div className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md">
            Nivel 3
          </div>
        </div>

        {/* Stars Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{userProfile.totalStars}</span>
        </div>
      </div>

      {/* AstroPatty Mascot Section with Speech */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <AstroPatty mood={astroMood} size="md" speechText={astroSpeech} />
        </div>
      </div>

      {/* MAIN GAME CARD: LEVEL 3 DISCRIMINATION EXERCISE */}
      {!isRoundCompleted ? (
        <div className="bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Exercise Counter, Alternative Count and Progress Dots */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Ejercicio {exerciseIndex + 1} de {exercises.length}
              </span>
              <span className="text-xs text-slate-500 font-mono">|</span>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                {currentExercise.options.length} Alternativas
              </span>
              <span className="text-xs text-slate-500 font-mono">|</span>
              <span className="text-xs text-slate-300 font-medium">
                {themeMode === 'voices'
                  ? categoryId === 'prosody'
                    ? 'Frases y Entonación'
                    : 'Palabras y Vocales'
                  : themeMode === 'animals'
                  ? 'Sonidos Reales de Animales'
                  : themeMode === 'instruments'
                  ? 'Instrumentos Musicales'
                  : 'Notas Musicales (Agudos 600 Hz)'}
              </span>
            </div>

            {/* 5 Progress Dots */}
            <div className="flex items-center gap-1.5">
              {exercises.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === exerciseIndex
                      ? 'bg-amber-400 ring-4 ring-amber-400/30 scale-110'
                      : i < exerciseIndex
                      ? 'bg-emerald-400'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Instruction Prompt */}
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white">
              {currentExercise.prompt}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {currentExercise.hint}
            </p>
          </div>

          {/* ================================================================= */}
          {/* BOTÓN CENTRAL: "Escuchar sonido"                                  */}
          {/* ================================================================= */}
          <div className="flex flex-col items-center justify-center gap-4 py-2 sm:py-4">
            <div className="relative group">
              {/* Outer Pulsing Sound Waves Ring */}
              {isPlaying && (
                <>
                  <div className="absolute -inset-3 rounded-full bg-cyan-400/20 animate-ping" />
                  <div className="absolute -inset-6 rounded-full bg-amber-400/15 animate-pulse" />
                </>
              )}

              <button
                type="button"
                onClick={handlePlaySound}
                className={`relative px-8 sm:px-12 py-5 sm:py-6 rounded-3xl font-black text-lg sm:text-xl flex items-center justify-center gap-3.5 transition-all duration-300 shadow-2xl cursor-pointer active:scale-95 ${
                  isPlaying
                    ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 ring-4 ring-amber-300/50 shadow-amber-400/40 animate-pulse'
                    : hasListened
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/40 hover:scale-103'
                    : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-cyan-500/40 hover:scale-103 ring-4 ring-cyan-400/30'
                }`}
                aria-label="Escuchar sonido"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-950/20 flex items-center justify-center shrink-0">
                  {isPlaying ? (
                    <Square className="w-6 h-6 fill-current text-slate-950" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-slate-950" />
                  )}
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-base sm:text-lg font-black leading-tight">
                    {isPlaying
                      ? 'Reproduciendo sonido...'
                      : hasListened
                      ? 'Volver a escuchar sonido'
                      : 'Escuchar sonido'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-900/80">
                    {isPlaying
                      ? `Tiempo: ${elapsedSec.toFixed(1)}s / ${totalSec.toFixed(1)}s`
                      : hasListened
                      ? 'Toca para oírlo las veces que quieras'
                      : 'Toca aquí para oír el estímulo'}
                  </span>
                </div>

                {hasListened && !isPlaying && (
                  <RotateCcw className="w-5 h-5 ml-1 opacity-80 group-hover:rotate-180 transition-transform duration-500" />
                )}
              </button>
            </div>

            {/* REAL-TIME DYNAMIC WAVEFORM VISUALIZER */}
            <div className="w-full max-w-md bg-slate-950/90 rounded-2xl border-2 border-slate-800 p-3 sm:p-4 flex flex-col items-center gap-2 shadow-inner">
              {/* Prosody 2-step indicator */}
              {categoryId === 'prosody' ? (
                <div className="flex items-center justify-center gap-6 w-full mb-1">
                  {/* Tono 1 */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                      activeProsodyStep === 1
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg scale-105'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold">Tono 1</span>
                    {activeProsodyStep === 1 && <span className="animate-bounce">🔊</span>}
                  </div>

                  {/* Melodic direction hint */}
                  <div className="text-slate-500 font-mono text-xs">➔</div>

                  {/* Tono 2 */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                      activeProsodyStep === 2
                        ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-black shadow-lg scale-105'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold">Tono 2</span>
                    {activeProsodyStep === 2 && <span className="animate-bounce">🔊</span>}
                  </div>
                </div>
              ) : null}

              {/* Animated wave bars */}
              <div className="h-10 flex items-center justify-center gap-1 sm:gap-1.5 w-full">
                {Array.from({ length: 24 }).map((_, i) => {
                  const isBarActive = isPlaying;
                  const factor = Math.sin((i / 23) * Math.PI);
                  return (
                    <div
                      key={i}
                      className={`w-1.5 sm:w-2 rounded-full transition-all duration-150 ${
                        isBarActive
                          ? 'bg-gradient-to-t from-cyan-400 via-sky-300 to-amber-300 shadow-sm'
                          : 'bg-slate-800/80'
                      }`}
                      style={{
                        height: isBarActive
                          ? `${Math.max(15, factor * 90 + Math.sin((elapsedSec * 10 + i) % 10) * 15)}%`
                          : '18%',
                      }}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] text-slate-400 font-semibold px-2">
                <span>
                  {themeMode === 'voices'
                    ? 'Voz Humana'
                    : themeMode === 'animals'
                    ? 'Sonido de Animal'
                    : themeMode === 'instruments'
                    ? 'Instrumento Musical'
                    : 'Nota Musical (600 Hz)'}
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {isPlaying ? `${elapsedSec.toFixed(1)}s` : `${totalSec.toFixed(1)}s total`}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* LAS 2 BOTONES DE ALTERNATIVA PARA QUE EL NIÑO RESPONDA              */}
          {/* ================================================================= */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Selecciona la alternativa correcta:
              </span>
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Ocultar pista' : 'Ver pista'}</span>
              </button>
            </div>

            {showHint && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs leading-relaxed animate-fadeIn">
                💡 <strong>Pista de Patty:</strong> {currentExercise.hint}
              </div>
            )}

            {/* Dynamic Alternative Buttons Grid (2, 3 or 4 alternatives) */}
            <div
              className={`grid gap-3.5 sm:gap-4 ${
                currentExercise.options.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : currentExercise.options.length === 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {currentExercise.options.map((opt) => {
                const isSelected = selectedAnswer === opt.value;
                const isCorrect = opt.value === currentExercise.correctAnswer;
                const isEvaluated = evaluation !== 'idle' && isSelected;

                let buttonStyles =
                  'bg-slate-850 hover:bg-slate-800 border-slate-700 text-white hover:border-slate-500 hover:scale-102';

                if (isEvaluated) {
                  if (isCorrect) {
                    buttonStyles =
                      'bg-emerald-950/80 border-emerald-400 text-emerald-100 ring-4 ring-emerald-400/40 scale-102 shadow-xl shadow-emerald-500/30';
                  } else {
                    buttonStyles =
                      'bg-rose-950/80 border-rose-500 text-rose-100 ring-4 ring-rose-500/40 animate-shake shadow-xl shadow-rose-500/20';
                  }
                }

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    disabled={evaluation === 'correct'}
                    className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col justify-between text-left min-h-[110px] sm:min-h-[135px] relative group cursor-pointer active:scale-95 ${buttonStyles}`}
                  >
                    {/* Top Row: Emoji and Badge */}
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-3xl sm:text-4xl group-hover:scale-115 transition-transform duration-300">
                        {opt.emoji}
                      </span>

                      <span className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 truncate max-w-[140px]">
                        {opt.badge}
                      </span>
                    </div>

                    {/* Middle: Label & Subtitle */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-200">
                          {opt.label}
                        </span>

                        {isEvaluated && isCorrect && (
                          <CheckCircle className="w-6 h-6 text-emerald-400 animate-bounce" />
                        )}
                        {isEvaluated && !isCorrect && (
                          <XCircle className="w-6 h-6 text-rose-400" />
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-300">
                        {opt.subtitle}
                      </p>

                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {opt.detail}
                      </p>
                    </div>

                    {/* Bottom Status bar */}
                    {isEvaluated && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-xs font-extrabold flex items-center gap-1.5">
                        {isCorrect ? (
                          <span className="text-emerald-300 flex items-center gap-1">
                            <span>¡Respuesta Correcta!</span>
                            <span>⭐ +{attemptCount === 1 ? 3 : 2} estrellas</span>
                          </span>
                        ) : (
                          <span className="text-rose-300">
                            No es correcto. ¡Escucha el sonido y vuelve a intentar!
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Correct Evaluation Action Bar */}
          {evaluation === 'correct' && (
            <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-2 border-emerald-400/60 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div>
                  <h4 className="text-base font-black text-emerald-300">
                    ¡Ejercicio descifrado con éxito!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Has demostrado una gran discriminación auditiva y reconocimiento del patrón sonoro.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextExercise}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[48px]"
              >
                <span>
                  {exerciseIndex < exercises.length - 1 ? 'Siguiente Ejercicio' : 'Ver Resultados del Nivel'}
                </span>
                <span>➔</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ROUND COMPLETION CELEBRATION CARD */
        <div className="bg-slate-900 border-2 border-emerald-400/60 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Award className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ¡Misión Nivel 3 Completada!
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Has superado con maestría los {exercises.length} desafíos auditivos de {categoryInfo.title}. Tu memoria y percepción están al máximo nivel.
            </p>
          </div>

          {/* Stars Tally */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 text-amber-300 text-lg font-black shadow-lg">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>
              +{starsAwardedThisRound.reduce((a, b) => a + b, 0)} Estrellas Cósmicas Ganadas
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRestartRound}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all min-h-[48px]"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Jugar Nivel 3 de nuevo</span>
            </button>

            <button
              type="button"
              onClick={onBackToMenu}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 transition-all min-h-[48px]"
            >
              <span>Volver al Menú de Misiones</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
