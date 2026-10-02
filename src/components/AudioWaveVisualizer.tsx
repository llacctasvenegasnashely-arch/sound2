import React from 'react';

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  activeStep: number | null;
  sequenceLength?: number;
  activeItem?: string | null;
  elapsedSec?: number;
  totalSec?: number;
  isPausedBetweenSteps?: boolean;
  categoryThemeColor?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isPlaying,
  activeStep,
  sequenceLength = 3,
  activeItem,
  elapsedSec = 0,
  totalSec = 3.0,
  isPausedBetweenSteps = false,
  categoryThemeColor = '#06b6d4',
}) => {
  const progressPercent = Math.min(100, Math.max(0, (elapsedSec / totalSec) * 100));
  const stepIndices = Array.from({ length: sequenceLength }, (_, i) => i);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Dynamic Step Sequence Indicator Pills */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-4 flex-wrap max-w-full">
        {stepIndices.map((idx) => {
          const isActive = activeStep === idx && !isPausedBetweenSteps;
          const isDone = activeStep !== null && (activeStep > idx || (activeStep === idx && isPausedBetweenSteps));

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`relative ${
                  sequenceLength >= 5
                    ? 'w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base'
                    : 'w-11 h-11 sm:w-14 sm:h-14 text-base sm:text-lg'
                } rounded-2xl flex items-center justify-center font-black transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-xl shadow-amber-400/50 ring-4 ring-amber-300/60 animate-pulse'
                    : isDone
                    ? 'bg-emerald-500 text-white border-2 border-emerald-400 shadow-md'
                    : 'bg-slate-800/90 text-slate-400 border border-slate-700'
                }`}
              >
                {isActive ? (
                  <span className={`${sequenceLength >= 5 ? 'text-lg' : 'text-2xl'} animate-bounce`}>🔊</span>
                ) : isDone ? (
                  <span className={`${sequenceLength >= 5 ? 'text-base' : 'text-xl'}`}>✓</span>
                ) : (
                  <span>{idx + 1}</span>
                )}

                {/* Duration indicator pill */}
                {isActive && (
                  <span className="absolute -bottom-2 bg-slate-950 text-amber-300 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-400/50 shadow-sm whitespace-nowrap">
                    {totalSec <= 1 ? `${totalSec.toFixed(1)}s (Corto)` : `${Math.max(0, Math.ceil(totalSec - elapsedSec))}s`}
                  </span>
                )}
              </div>

              <span className="text-[10px] sm:text-[11px] font-bold text-slate-300">
                Sonido {idx + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Real-time Dynamic Waveform & Progress Display */}
      <div className="w-full max-w-sm sm:max-w-md bg-slate-950/90 rounded-2xl border-2 border-slate-800 p-3 sm:p-4 flex flex-col gap-2 relative overflow-hidden shadow-inner">
        {/* Ambient subtle glow when playing */}
        {isPlaying && (
          <div
            className="absolute inset-0 opacity-25 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${categoryThemeColor}, transparent 70%)`,
            }}
          />
        )}

        {/* Dynamic Waveform Bars */}
        <div className="h-14 sm:h-16 flex items-center justify-center gap-1 sm:gap-1.5 relative">
          {Array.from({ length: 28 }).map((_, i) => {
            const delay = (i % 8) * 0.08;
            const heightMultiplier = Math.sin((i / 27) * Math.PI);
            const isWaveActive = isPlaying && !isPausedBetweenSteps;

            return (
              <div
                key={i}
                className={`w-1.5 sm:w-2 rounded-full transition-all duration-150 ${
                  isWaveActive
                    ? 'bg-gradient-to-t from-cyan-400 via-sky-300 to-amber-300 shadow-sm'
                    : isPausedBetweenSteps
                    ? 'bg-indigo-500/40'
                    : 'bg-slate-700/60'
                }`}
                style={{
                  height: isWaveActive
                    ? `${Math.max(16, Math.floor(25 + 70 * heightMultiplier * ((i % 3 === 0 ? 0.95 : 0.65) + Math.random() * 0.25)))}%`
                    : isPausedBetweenSteps
                    ? '20%'
                    : '14%',
                  animation: isWaveActive
                    ? `wave-dance ${0.45 + (i % 4) * 0.12}s ease-in-out ${delay}s infinite alternate`
                    : 'none',
                }}
              />
            );
          })}
        </div>

        {/* 5-Second Sound Progress Bar */}
        {isPlaying && activeStep !== null && !isPausedBetweenSteps && (
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 transition-all duration-100 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
              <span className="text-amber-300">
                {activeItem ? activeItem.toUpperCase() : `Sonido ${activeStep + 1}`}
              </span>
              <span>
                {elapsedSec.toFixed(1)}s / {totalSec.toFixed(1)}s (HQ 44.1 kHz)
              </span>
            </div>
          </div>
        )}

        {/* State Banner Text */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-0.5 border-t border-slate-800/80">
          <span className="text-cyan-300">
            {isPausedBetweenSteps
              ? '⏸️ Pausa de 1.0s entre sonidos (memoriza el estímulo)...'
              : isPlaying
              ? `🔊 Reproduciendo ${totalSec <= 1 ? 'Sonido Corto (0.7s rápido)' : 'Sonido Sostenido (3.0s largo)'}`
              : 'Listo para escuchar'}
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-mono">
            44.1 kHz · {totalSec <= 1 ? '0.7s' : '3.0s'}
          </span>
        </div>
      </div>
    </div>
  );
};
