import React from 'react';
import { X, BookOpen, Brain, Sparkles, Heart, Activity, Clock, Volume2 } from 'lucide-react';

interface TherapyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TherapyGuideModal: React.FC<TherapyGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Guía de Fonoaudiología y Estimulación
              </h3>
              <p className="text-xs text-indigo-300">
                Fundamentos neurocognitivos para terapeutas y familias
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors min-h-[36px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="py-4 space-y-4 overflow-y-auto pr-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Introductory Card */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>¿Por qué entrenar patrones auditivos en la infancia?</span>
            </div>
            <p>
              El procesamiento auditivo temporal y la discriminación acústica son las bases del desarrollo fonológico, la comprensión del habla, la fluidez léxica y el aprendizaje de la lectoescritura. "SoundPatty" estimula el ordenamiento temporal (temporal ordering) y la memoria secuencial auditiva.
            </p>
          </div>

          {/* The 4 Acoustic Dimensions */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">
              Las 4 Dimensiones Estimuladas:
            </h4>

            {/* Dimension 1 */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-cyan-300 text-xs sm:text-sm">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>1. Tono y Frecuencia (Agudo / Grave)</span>
              </div>
              <p className="text-slate-300 text-xs">
                Favorece la entonación prosódica, la discriminación de formantes vocálicos y consonánticos, y la modulación de la voz en niños con dificultades articulatorias o hipoacusias leves.
              </p>
            </div>

            {/* Dimension 2 */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>2. Duración y Tiempo (Corto / Largo)</span>
              </div>
              <p className="text-slate-300 text-xs">
                Fundamental para segmentación silábica, ritmo del habla, velocidad de procesamiento auditivo y diferenciación de vocales prolongadas o consonantes oclusivas.
              </p>
            </div>

            {/* Dimension 3 */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-pink-300 text-xs sm:text-sm">
                <Volume2 className="w-4 h-4 text-pink-400" />
                <span>3. Intensidad y Volumen (Suave / Fuerte)</span>
              </div>
              <p className="text-slate-300 text-xs">
                Entrena el control del volumen conversacional, la localización de fuentes sonoras y la figura-fondo auditiva en entornos ruidosos (como el aula escolar).
              </p>
            </div>

            {/* Dimension 4 */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>4. Prosodia y Entonación (Pregunta / Afirmación)</span>
              </div>
              <p className="text-slate-300 text-xs">
                Desarrolla la competencia pragmática y lingüística reconociendo la inflexión ascendente (el segundo tono sube de frecuencia como una pregunta curiosa ↗️) frente a la inflexión descendente (el segundo tono baja con certeza de afirmación ↘️).
              </p>
            </div>

            {/* Level 3 Special Feature */}
            <div className="bg-gradient-to-r from-amber-500/15 via-indigo-900/30 to-purple-900/30 border border-amber-400/40 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>Nivel 3: Discriminación Auditiva Sintética (2 Alternativas)</span>
              </div>
              <p className="text-slate-300 text-xs">
                En cada sección, el Nivel 3 activa un módulo de discriminación pura con botón central "Escuchar sonido" y 2 alternativas de respuesta:
                <strong> Duración</strong> (Largo vs Corto),
                <strong> Tono/Frecuencia</strong> (Agudo vs Grave),
                <strong> Intensidad</strong> (Fuerte vs Suave) y
                <strong> Prosodia</strong> (Pregunta con segundo tono ascendente vs Afirmación con segundo tono descendente).
              </p>
            </div>
          </div>

          {/* Practical Tips */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 space-y-2">
            <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Estrategias de Aplicación Clínica y en el Hogar</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
              <li>
                <strong>Verbalizar o cantar:</strong> Pide al niño que cante el patrón con la voz (ej: "¡ti-to-ti!" o "¡pum-pa-pum!") antes de tocar la pantalla.
              </li>
              <li>
                <strong>Usar audífonos:</strong> Si es posible, utiliza auriculares circumaurales para aislar ruidos ambientales y enfocar la atención auditiva.
              </li>
              <li>
                <strong>Duración amplia de 5 segundos:</strong> Cada estímulo se extiende durante 5 segundos para que la corteza auditiva procese los armónicos, la envolvente acústica y la resonancia sin apremio ni sobrecarga cognitiva.
              </li>
              <li>
                <strong>Pausa de 1.25s a 1.5s:</strong> El silencio entre cada sonido permite a la memoria de trabajo fonológica retener y comparar la secuencia mentalmente.
              </li>
              <li>
                <strong>Calibración acústica infantil (8 años):</strong> En la sección de notas musicales, los tonos agudos (Do, Sol y Si agudo) cuentan con un filtro acústico suavizado y volumen calibrado para proteger la sensibilidad auditiva infantil, garantizando una experiencia dulce, clara y libre de molestias o estridencias.
              </li>
              <li>
                <strong>Sesiones cortas:</strong> 10 a 15 minutos diarios son suficientes para consolidar la plasticidad neuronal sin fatiga cognitiva.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm transition-colors min-h-[44px]"
          >
            Entendido, volver a jugar
          </button>
        </div>
      </div>
    </div>
  );
};
