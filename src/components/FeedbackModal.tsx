import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw, Volume2, Award } from 'lucide-react';
import { AstroPatty } from './AstroPatty';

interface FeedbackModalProps {
  isOpen: boolean;
  type: 'success' | 'retry';
  starsAwarded: number;
  attemptCount: number;
  categoryTitle: string;
  isLastQuestionOfLevel?: boolean;
  currentLevel?: number;
  onNext: () => void;
  onRetryReplay: () => void;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  type,
  starsAwarded,
  attemptCount,
  categoryTitle,
  isLastQuestionOfLevel = false,
  currentLevel = 1,
  onNext,
  onRetryReplay,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && type === 'success') {
      // Fire confetti burst
      try {
        confetti({
          particleCount: isLastQuestionOfLevel ? 120 : 80,
          spread: isLastQuestionOfLevel ? 90 : 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#ffffff'],
        });
      } catch {
        // Fallback gracefully if canvas-confetti is unsupported
      }
    }
  }, [isOpen, type, isLastQuestionOfLevel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-2 transition-all transform animate-scaleUp ${
          type === 'success'
            ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-amber-400/60 shadow-amber-500/20'
            : 'bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-cyan-400/50 shadow-cyan-500/10'
        }`}
      >
        {/* Astronaut Companion */}
        <div className="flex justify-center mb-2">
          <AstroPatty
            mood={type === 'success' ? 'cheering' : 'encouraging'}
            size="md"
            showSpeech={false}
          />
        </div>

        {type === 'success' ? (
          /* SUCCESS STATE */
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{categoryTitle} · Nivel {currentLevel}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {isLastQuestionOfLevel
                  ? currentLevel === 3
                    ? '¡Misión Completada al 100%! 🏆'
                    : `¡Nivel ${currentLevel} Completado! 🚀`
                  : '¡Excelente Oído! 🌟'}
              </h3>
              <p className="text-sm text-cyan-200">
                {isLastQuestionOfLevel
                  ? currentLevel === 3
                    ? '¡Increíble! Has dominado todos los desafíos de los 3 niveles con tu superoído cósmico.'
                    : `¡Genial! Has superado todos los desafíos del Nivel ${currentLevel}. ¡Listo para el Nivel ${currentLevel + 1}!`
                  : attemptCount === 1
                  ? '¡Asombroso! Lo descifraste en el primer intento.'
                  : '¡Muy bien hecho! Escuchaste con paciencia y lo lograste.'}
              </p>
            </div>

            {/* Stars Award Display */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3].map((starNum) => {
                const isEarned = starNum <= starsAwarded;
                return (
                  <div
                    key={starNum}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${
                      isEarned
                        ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg shadow-amber-400/40 animate-bounce'
                        : 'bg-slate-800 text-slate-600 opacity-40'
                    }`}
                    style={{ animationDelay: `${starNum * 150}ms` }}
                  >
                    ⭐
                  </div>
                );
              })}
            </div>

            <p className="text-xs font-bold text-amber-300">
              +{starsAwarded} Estrellas acumuladas en tu diario estelar
            </p>

            {/* Action Button: Next */}
            <button
              onClick={onNext}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-98 transition-all cursor-pointer"
            >
              <span>
                {isLastQuestionOfLevel
                  ? currentLevel === 3
                    ? '¡Finalizar Misión!'
                    : `¡Avanzar al Nivel ${currentLevel + 1}! 🚀`
                  : '¡Siguiente Desafío!'}
              </span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        ) : (
          /* RETRY STATE */
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold">
              <span>{categoryTitle}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ¡Casi lo logras! 👂
              </h3>
              <p className="text-sm text-cyan-200">
                ¡Escucha con atención una vez más! No te preocupes, los mejores astronautas afinan su oído con práctica.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 text-xs text-slate-300">
              💡 <strong>Pista de Patty:</strong> Cierra los ojos un segundo al escuchar la secuencia para concentrarte únicamente en los tonos.
            </div>

            <div className="space-y-2 pt-2">
              {/* Option to automatically replay sequence */}
              <button
                onClick={onRetryReplay}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-98 transition-all min-h-[50px]"
              >
                <Volume2 className="w-5 h-5" />
                <span>Volver a Escuchar Secuencia</span>
              </button>

              {/* Option to change answer without replaying */}
              <button
                onClick={onClose}
                className="w-full h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Corregir mi Selección</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
