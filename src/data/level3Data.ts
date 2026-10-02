import { CategoryId, Level3Exercise, Level3Option, PatternItem, SoundThemeMode } from '../types/game';

// ---------------------------------------------------------------------------
// 4 Opciones específicas de Nivel 3 para cada Banco de Sonidos y Categoría
// Permite intercalar ejercicios con 2, 3 y 4 alternativas en el mismo nivel.
// ---------------------------------------------------------------------------

export const LEVEL3_OPTIONS_BY_MODE: Record<
  SoundThemeMode,
  Partial<Record<CategoryId, Record<string, Level3Option>>>
> = {
  // ==========================================
  // 1. SELVA Y GRANJA DE ANIMALES
  // ==========================================
  animals: {
    frequency: {
      canario: {
        value: 'canario',
        label: 'Pajarito Canario',
        subtitle: 'Canto Agudo',
        detail: 'Trino cristalino, alto y agudo de canario',
        badge: 'Canario Agudo',
        emoji: '🐤',
        color: '#06b6d4',
        gradient: 'from-amber-400 to-yellow-500',
      },
      buho: {
        value: 'buho',
        label: 'Búho Sabio',
        subtitle: 'Ulular Grave',
        detail: 'Ulular hondo, profundo y cavernoso de búho',
        badge: 'Búho Grave',
        emoji: '🦉',
        color: '#6366f1',
        gradient: 'from-indigo-600 via-purple-700 to-slate-900',
      },
      grillo: {
        value: 'grillo',
        label: 'Grillo Saltarín',
        subtitle: 'Canto Agudo',
        detail: 'Chirrido cristalino, fino y vibrante en las alturas',
        badge: 'Grillo Agudo',
        emoji: '🦗',
        color: '#10b981',
        gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      },
      rana_toro: {
        value: 'rana_toro',
        label: 'Rana Toro',
        subtitle: 'Croar Grave',
        detail: 'Croar grave y cavernoso en frecuencias muy bajas',
        badge: 'Rana Grave',
        emoji: '🐸',
        color: '#8b5cf6',
        gradient: 'from-violet-700 via-purple-800 to-slate-950',
      },
    },
    duration: {
      perro: {
        value: 'perro',
        label: 'Perro Guardián',
        subtitle: 'Ladrido Corto',
        detail: 'Ladrido rápido, seco y breve (¡Guau!)',
        badge: 'Perro (Corto)',
        emoji: '🐶',
        color: '#f59e0b',
        gradient: 'from-amber-500 to-orange-600',
      },
      vaca: {
        value: 'vaca',
        label: 'Vaca Espacial',
        subtitle: 'Mugido Largo',
        detail: 'Mugido prolongado, continuo y sostenido (¡Muuuuuu!)',
        badge: 'Vaca (Largo)',
        emoji: '🐮',
        color: '#10b981',
        gradient: 'from-emerald-500 to-teal-600',
      },
      pato: {
        value: 'pato',
        label: 'Patito Veloz',
        subtitle: 'Graznido Corto',
        detail: 'Graznido breve, seco y rápido en el agua (¡Cuac!)',
        badge: 'Pato (Corto)',
        emoji: '🦆',
        color: '#06b6d4',
        gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      },
      lobo: {
        value: 'lobo',
        label: 'Lobo Cósmico',
        subtitle: 'Aullido Largo',
        detail: 'Aullido majestuoso que resuena largamente en la noche',
        badge: 'Lobo (Largo)',
        emoji: '🐺',
        color: '#8b5cf6',
        gradient: 'from-indigo-600 via-purple-700 to-slate-900',
      },
    },
    intensity: {
      gato: {
        value: 'gato',
        label: 'Gatito Suave',
        subtitle: 'Maullido Tenue',
        detail: 'Maullido delicado, tierno y con volumen suave (¡Miau!)',
        badge: 'Gatito (Suave)',
        emoji: '🐱',
        color: '#8b5cf6',
        gradient: 'from-purple-500 via-indigo-600 to-blue-700',
      },
      caballo: {
        value: 'caballo',
        label: 'Caballo Fuerte',
        subtitle: 'Relincho Potente',
        detail: 'Relincho enérgico, estruendoso y a todo volumen',
        badge: 'Caballo (Fuerte)',
        emoji: '🐴',
        color: '#f43f5e',
        gradient: 'from-rose-500 via-pink-600 to-red-600',
      },
      canario: {
        value: 'canario',
        label: 'Canario Suave',
        subtitle: 'Gorjeo Delicado',
        detail: 'Trino tierno, suave y delicado de baja intensidad',
        badge: 'Canario (Suave)',
        emoji: '🐤',
        color: '#f59e0b',
        gradient: 'from-amber-400 to-yellow-500',
      },
      elefante: {
        value: 'elefante',
        label: 'Elefante Potente',
        subtitle: 'Bramido Fuerte',
        detail: 'Bramido imponente y retumbante a pleno volumen',
        badge: 'Elefante (Fuerte)',
        emoji: '🐘',
        color: '#06b6d4',
        gradient: 'from-cyan-600 via-blue-700 to-indigo-800',
      },
    },
  },

  // ==========================================
  // 2. VOZ HUMANA (Palabras, Vocales y Prosodia)
  // ==========================================
  voices: {
    frequency: {
      voz_vocal_a_aguda: {
        value: 'voz_vocal_a_aguda',
        label: 'Vocal "A" Aguda',
        subtitle: 'Voz Infantil Femenina',
        detail: 'Voz clara y luminosa de niña entonando la vocal "A"',
        badge: 'Niña: "A" Aguda',
        emoji: '👧',
        color: '#06b6d4',
        gradient: 'from-rose-400 via-orange-400 to-amber-400',
      },
      voz_vocal_o_grave: {
        value: 'voz_vocal_o_grave',
        label: 'Vocal "O" Grave',
        subtitle: 'Voz Honda Masculina',
        detail: 'Voz profunda, cavernosa y grave de hombre entonando la vocal "O"',
        badge: 'Hombre: "O" Grave',
        emoji: '🧔',
        color: '#6366f1',
        gradient: 'from-slate-700 via-purple-950 to-slate-900',
      },
      voz_vocal_i_aguda: {
        value: 'voz_vocal_i_aguda',
        label: 'Vocal "I" Aguda',
        subtitle: 'Voz Aguda Brillante',
        detail: 'Vocal "I" brillante entonada en el registro alto infantil',
        badge: 'Niña: "I" Aguda',
        emoji: '👧',
        color: '#ec4899',
        gradient: 'from-pink-400 via-rose-500 to-fuchsia-600',
      },
      voz_vocal_u_grave: {
        value: 'voz_vocal_u_grave',
        label: 'Vocal "U" Grave',
        subtitle: 'Voz Grave Cavernosa',
        detail: 'Vocal "U" profunda y oscura entonada en registro bajo',
        badge: 'Hombre: "U" Grave',
        emoji: '🧔',
        color: '#3b82f6',
        gradient: 'from-blue-700 via-indigo-900 to-slate-950',
      },
    },
    duration: {
      voz_corta_paz: {
        value: 'voz_corta_paz',
        label: 'Palabra Corta: "Paz"',
        subtitle: 'Monosílabo Rápido',
        detail: 'Palabra concisa, seca y breve: "Paz"',
        badge: 'Corta ("Paz")',
        emoji: '🕊️',
        color: '#f59e0b',
        gradient: 'from-amber-500 to-orange-600',
      },
      voz_larga_paz: {
        value: 'voz_larga_paz',
        label: 'Palabra Larga: "Paaaazzzzz"',
        subtitle: 'Palabra Estirada y Continua',
        detail: 'Vocal y consonante sostenidas largamente en el tiempo',
        badge: 'Larga ("Paaaazzzzz")',
        emoji: '🌌',
        color: '#10b981',
        gradient: 'from-emerald-500 to-teal-600',
      },
      voz_corta_sol: {
        value: 'voz_corta_sol',
        label: 'Palabra Corta: "Sol"',
        subtitle: 'Palabra Breve y Seca',
        detail: 'Palabra corta dicha de forma rápida: "Sol"',
        badge: 'Corta ("Sol")',
        emoji: '☀️',
        color: '#06b6d4',
        gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      },
      voz_larga_sol: {
        value: 'voz_larga_sol',
        label: 'Palabra Larga: "Sooooolllll"',
        subtitle: 'Palabra Prolongada',
        detail: 'Palabra extendida con resonancia continua en el tiempo',
        badge: 'Larga ("Sooooolllll")',
        emoji: '🌞',
        color: '#8b5cf6',
        gradient: 'from-purple-500 via-indigo-600 to-violet-700',
      },
    },
    intensity: {
      voz_susurro_aqui2: {
        value: 'voz_susurro_aqui2',
        label: 'Susurro: "Aquí..."',
        subtitle: 'Volumen Tenue y Suave',
        detail: 'Susurro delicado, íntimo y susurrado (25% volumen)',
        badge: 'Susurro ("Aquí...")',
        emoji: '🤫',
        color: '#8b5cf6',
        gradient: 'from-purple-500 via-indigo-600 to-blue-700',
      },
      voz_fuerte_aqui2: {
        value: 'voz_fuerte_aqui2',
        label: 'Grito: "¡AQUÍ!"',
        subtitle: 'Volumen Potente y Fuerte',
        detail: 'Voz alegre, proyectada y enérgica a pleno volumen (100%)',
        badge: 'Fuerte ("¡AQUÍ!")',
        emoji: '📢',
        color: '#f43f5e',
        gradient: 'from-rose-500 via-pink-600 to-red-600',
      },
      voz_susurro_silencio: {
        value: 'voz_susurro_silencio',
        label: 'Susurro: "Silencio..."',
        subtitle: 'Volumen Tenue y Calmo',
        detail: 'Susurro muy suave, secreto y tenue a bajo volumen',
        badge: 'Susurro ("Silencio...")',
        emoji: '🤫',
        color: '#06b6d4',
        gradient: 'from-cyan-500 via-sky-600 to-blue-700',
      },
      voz_fuerte_silencio: {
        value: 'voz_fuerte_silencio',
        label: 'Voz Fuerte: "¡SILENCIO!"',
        subtitle: 'Volumen Potente y Rotundo',
        detail: 'Voz firme, fuerte y proyectada con gran energía',
        badge: 'Fuerte ("¡SILENCIO!")',
        emoji: '📢',
        color: '#f59e0b',
        gradient: 'from-amber-500 via-orange-600 to-red-600',
      },
    },
    prosody: {
      voz_pregunta_cohete: {
        value: 'voz_pregunta_cohete',
        label: 'Pregunta ("¿Llegó el cohete?")',
        subtitle: 'Inflexión Ascendente ↗️',
        detail: 'Curva melódica interrogativa que sube con curiosidad de duda',
        badge: 'Pregunta ↗️',
        emoji: '🛸',
        color: '#f59e0b',
        gradient: 'from-amber-400 via-orange-500 to-yellow-500',
      },
      voz_exclamacion_cohete: {
        value: 'voz_exclamacion_cohete',
        label: 'Exclamación ("¡Llegó el cohete!")',
        subtitle: 'Inflexión Descendente ↘️',
        detail: 'Entonación afirmativa enérgica y festiva con caída de certeza',
        badge: 'Exclamación ↘️',
        emoji: '🚀',
        color: '#10b981',
        gradient: 'from-rose-500 via-red-500 to-amber-500',
      },
      voz_pregunta_sorpresa: {
        value: 'voz_pregunta_sorpresa',
        label: 'Pregunta ("¿Es una sorpresa?")',
        subtitle: 'Duda Interrogativa ↗️',
        detail: 'Entonación que se eleva al final con intriga y pregunta',
        badge: 'Pregunta ↗️',
        emoji: '❓',
        color: '#06b6d4',
        gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      },
      voz_exclamacion_sorpresa: {
        value: 'voz_exclamacion_sorpresa',
        label: 'Exclamación ("¡Es una sorpresa!")',
        subtitle: 'Alegría Afirmativa ↘️',
        detail: 'Entonación con energía que concluye con firmeza y emoción',
        badge: 'Exclamación ↘️',
        emoji: '🎁',
        color: '#8b5cf6',
        gradient: 'from-purple-500 via-indigo-600 to-violet-700',
      },
    },
  },

  // ==========================================
  // 3. INSTRUMENTOS MUSICALES
  // ==========================================
  instruments: {
    frequency: {
      campana_aguda: {
        value: 'campana_aguda',
        label: 'Campana de Cristal',
        subtitle: 'Sonido Agudo Brillante',
        detail: 'Timbre metálico cristalino y muy agudo de campana',
        badge: 'Campana Aguda',
        emoji: '🔔',
        color: '#06b6d4',
        gradient: 'from-amber-300 via-yellow-400 to-orange-400',
      },
      timbal_grave: {
        value: 'timbal_grave',
        label: 'Timbal Sinfónico',
        subtitle: 'Sonido Grave Profundo',
        detail: 'Golpe masivo, profundo y cavernoso de percusión sinfónica',
        badge: 'Timbal Grave',
        emoji: '🪘',
        color: '#6366f1',
        gradient: 'from-violet-800 via-purple-900 to-slate-950',
      },
      xilofono_agudo: {
        value: 'xilofono_agudo',
        label: 'Xilófono Brillante',
        subtitle: 'Sonido Agudo de Madera',
        detail: 'Campanadas cristalinas y notas altas de barras de palisandro',
        badge: 'Xilófono Agudo',
        emoji: '🎼',
        color: '#10b981',
        gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      },
      tambor_grave: {
        value: 'tambor_grave',
        label: 'Tambor de Cuero',
        subtitle: 'Sonido Grave de Percusión',
        detail: 'Impacto hondo, bajo y resonante sobre parche acústico',
        badge: 'Tambor Grave',
        emoji: '🥁',
        color: '#8b5cf6',
        gradient: 'from-indigo-700 via-slate-800 to-slate-950',
      },
    },
    duration: {
      claves_cortas: {
        value: 'claves_cortas',
        label: 'Claves de Madera',
        subtitle: 'Golpe Corto (0.6s)',
        detail: 'Impacto rápido, seco y muy breve de madera fina',
        badge: 'Claves (Corto)',
        emoji: '🪵',
        color: '#f59e0b',
        gradient: 'from-amber-500 to-orange-600',
      },
      organo_largo: {
        value: 'organo_largo',
        label: 'Órgano Cósmico',
        subtitle: 'Acorde Largo (4.0s)',
        detail: 'Acorde majestuoso y continuo que resuena largamente en el tiempo',
        badge: 'Órgano (Largo)',
        emoji: '🎹',
        color: '#10b981',
        gradient: 'from-emerald-500 to-teal-600',
      },
      maraca_corta: {
        value: 'maraca_corta',
        label: 'Maraca Rápida',
        subtitle: 'Sacudida Corta (0.7s)',
        detail: 'Sacudida rápida y percusiva que termina de inmediato',
        badge: 'Maraca (Corto)',
        emoji: '🪇',
        color: '#06b6d4',
        gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      },
      piano_largo: {
        value: 'piano_largo',
        label: 'Piano Espacial',
        subtitle: 'Acorde Largo (4.0s)',
        detail: 'Nota sostenida con pedal que mantiene su vibración en el tiempo',
        badge: 'Piano (Largo)',
        emoji: '🎹',
        color: '#8b5cf6',
        gradient: 'from-purple-500 via-indigo-600 to-violet-700',
      },
    },
    intensity: {
      kalimba_suave: {
        value: 'kalimba_suave',
        label: 'Kalimba Suave',
        subtitle: 'Volumen Tenue (25%)',
        detail: 'Gotitas de madera suave tocadas con pulsación íntima y delicada',
        badge: 'Kalimba (Suave)',
        emoji: '🪵',
        color: '#8b5cf6',
        gradient: 'from-purple-500 via-indigo-600 to-blue-700',
      },
      tuba_fuerte: {
        value: 'tuba_fuerte',
        label: 'Tuba Potente',
        subtitle: 'Volumen Fuerte (100%)',
        detail: 'Ataque fortissimo enérgico y resonante de bronce a gran volumen',
        badge: 'Tuba (Fuerte)',
        emoji: '📯',
        color: '#f43f5e',
        gradient: 'from-rose-500 via-pink-600 to-red-600',
      },
      caja_musica_suave: {
        value: 'caja_musica_suave',
        label: 'Caja de Música',
        subtitle: 'Volumen Suave (25%)',
        detail: 'Melodía suave, íntima y celestial a volumen muy bajo',
        badge: 'Caja Música (Suave)',
        emoji: '🧸',
        color: '#06b6d4',
        gradient: 'from-cyan-400 via-sky-500 to-teal-600',
      },
      trompeta_fuerte: {
        value: 'trompeta_fuerte',
        label: 'Trompeta Triunfal',
        subtitle: 'Volumen Fuerte (100%)',
        detail: 'Fanfarria brillante y enérgica a todo volumen resonante',
        badge: 'Trompeta (Fuerte)',
        emoji: '🎺',
        color: '#f59e0b',
        gradient: 'from-amber-500 via-orange-600 to-red-600',
      },
    },
  },

  // ==========================================
  // 4. NOTAS MUSICALES (Agudos calibrados a 600 Hz)
  // ==========================================
  notes: {
    frequency: {
      nota_si_agudo: {
        value: 'nota_si_agudo',
        label: 'Nota Si Agudo (600 Hz)',
        subtitle: 'Frecuencia 600 Hz',
        detail: 'Nota alta, dulce y clara afinada exactamente en 600 Hz',
        badge: 'Agudo 600 Hz',
        emoji: '✨',
        color: '#06b6d4',
        gradient: 'from-amber-300 via-yellow-400 to-sky-400',
      },
      nota_la_grave: {
        value: 'nota_la_grave',
        label: 'Nota La Grave',
        subtitle: 'Frecuencia Baja (La1)',
        detail: 'Subgrave profundo y cálido de la escala baja (55.0 Hz)',
        badge: 'La Grave (55 Hz)',
        emoji: '🎻',
        color: '#6366f1',
        gradient: 'from-purple-900 via-indigo-950 to-slate-950',
      },
      nota_sol_agudo: {
        value: 'nota_sol_agudo',
        label: 'Nota Sol Agudo (600 Hz)',
        subtitle: 'Frecuencia 600 Hz',
        detail: 'Nota brillante y dulce afinada exactamente en 600 Hz',
        badge: 'Agudo 600 Hz',
        emoji: '🎶',
        color: '#10b981',
        gradient: 'from-teal-300 via-cyan-400 to-blue-500',
      },
      nota_mi_grave: {
        value: 'nota_mi_grave',
        label: 'Nota Mi Grave',
        subtitle: 'Frecuencia Baja (Mi2)',
        detail: 'Bajo orquestal resonante de la escala baja (82.4 Hz)',
        badge: 'Mi Grave (82 Hz)',
        emoji: '🎸',
        color: '#8b5cf6',
        gradient: 'from-slate-700 via-indigo-950 to-slate-900',
      },
    },
    duration: {
      nota_fa_staccato: {
        value: 'nota_fa_staccato',
        label: 'Nota Fa Corta',
        subtitle: 'Staccato (0.7s)',
        detail: 'Nota atacada con rapidez, picada y corte inmediato',
        badge: 'Fa Staccato (Corto)',
        emoji: '⚡',
        color: '#f59e0b',
        gradient: 'from-amber-500 to-orange-600',
      },
      nota_fa_tenuto: {
        value: 'nota_fa_tenuto',
        label: 'Nota Fa Larga',
        subtitle: 'Tenuto (4.0s)',
        detail: 'Nota con pedal sostenido que vibra largamente en el espacio',
        badge: 'Fa Tenuto (Largo)',
        emoji: '⏳',
        color: '#10b981',
        gradient: 'from-emerald-500 to-teal-600',
      },
      nota_re_staccato: {
        value: 'nota_re_staccato',
        label: 'Nota Re Corta',
        subtitle: 'Staccato Breve (0.7s)',
        detail: 'Nota tocada de golpe seco y corte rápido',
        badge: 'Re Staccato (Corto)',
        emoji: '⚡',
        color: '#06b6d4',
        gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      },
      nota_re_tenuto: {
        value: 'nota_re_tenuto',
        label: 'Nota Re Larga',
        subtitle: 'Tenuto Prolongado (3.5s)',
        detail: 'Nota sostenida con resonancia continuada en el tiempo',
        badge: 'Re Tenuto (Largo)',
        emoji: '⏳',
        color: '#8b5cf6',
        gradient: 'from-purple-500 via-indigo-600 to-violet-700',
      },
    },
    intensity: {
      nota_sol_pianissimo: {
        value: 'nota_sol_pianissimo',
        label: 'Nota Sol Suave',
        subtitle: 'Pianissimo (25%)',
        detail: 'Nota acariciada con suavidad celestial y volumen íntimo',
        badge: 'Pianissimo (Suave)',
        emoji: '🌙',
        color: '#8b5cf6',
        gradient: 'from-purple-500 via-indigo-600 to-blue-700',
      },
      nota_sol_fortissimo: {
        value: 'nota_sol_fortissimo',
        label: 'Nota Sol Fuerte',
        subtitle: 'Fortissimo (100%)',
        detail: 'Nota golpeada con potencia, garra y volumen resonante total',
        badge: 'Fortissimo (Fuerte)',
        emoji: '💥',
        color: '#f43f5e',
        gradient: 'from-rose-500 via-pink-600 to-red-600',
      },
      nota_mi_pianissimo: {
        value: 'nota_mi_pianissimo',
        label: 'Nota Mi Suave',
        subtitle: 'Pianissimo Delicado (25%)',
        detail: 'Vibración delicada y dulce a muy bajo volumen',
        badge: 'Mi Suave (25%)',
        emoji: '🌙',
        color: '#06b6d4',
        gradient: 'from-cyan-400 via-sky-500 to-teal-600',
      },
      nota_mi_fortissimo: {
        value: 'nota_mi_fortissimo',
        label: 'Nota Mi Fuerte',
        subtitle: 'Fortissimo Potente (100%)',
        detail: 'Golpe orquestal rotundo con máxima energía acústica',
        badge: 'Mi Fuerte (100%)',
        emoji: '💥',
        color: '#f59e0b',
        gradient: 'from-amber-500 via-orange-600 to-red-600',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Generador dinámico de ejercicios de Nivel 3 para cada Tema y Categoría
// Intercala: Ejercicio 1 (2 opciones) -> Ejercicio 2 (3 opciones) ->
//           Ejercicio 3 (4 opciones) -> Ejercicio 4 (2 opciones) ->
//           Ejercicio 5 (3 opciones)
// ---------------------------------------------------------------------------

export function getLevel3Exercises(
  themeMode: SoundThemeMode,
  categoryId: CategoryId
): Level3Exercise[] {
  const modeOptions = LEVEL3_OPTIONS_BY_MODE[themeMode]?.[categoryId];

  if (!modeOptions) {
    // Si no está disponible en este modo, retornar fallback seguro
    const fallbackMode = LEVEL3_OPTIONS_BY_MODE.voices[categoryId] || LEVEL3_OPTIONS_BY_MODE.animals.frequency;
    const keys = Object.keys(fallbackMode || {});
    const optA = fallbackMode![keys[0]];
    const optB = fallbackMode![keys[1]];
    return [
      {
        id: `l3-fallback-1`,
        category: categoryId,
        questionNumber: 1,
        correctAnswer: optA.value,
        soundItem: optA.value as any,
        prompt: `Presiona "Escuchar sonido" e identifica si corresponde a ${optA.label} o ${optB.label}.`,
        hint: `Presta atención al estímulo acústico.`,
        options: [optA, optB],
      },
    ];
  }

  const optionKeys = Object.keys(modeOptions);
  const optA = modeOptions[optionKeys[0]];
  const optB = modeOptions[optionKeys[1]];
  const optC = modeOptions[optionKeys[2]] || optA;
  const optD = modeOptions[optionKeys[3]] || optB;

  // Secuencia de alternativas intercaladas por ejercicio:
  // Para el Banco de Animales: el elefante, la rana toro y el pato veloz NUNCA deben sonar como estímulo
  // (solo aparecen como opciones/alternativas de respuesta múltiple).
  let exerciseConfigs: {
    options: Level3Option[];
    target: Level3Option;
  }[];

  if (themeMode === 'animals') {
    if (categoryId === 'frequency') {
      // optD (rana_toro) nunca es target / estímulo sonoro, pero aparece como alternativa
      exerciseConfigs = [
        { options: [optA, optB], target: optA }, // Canario agudo
        { options: [optA, optB, optC], target: optB }, // Búho grave
        { options: [optA, optB, optC, optD], target: optB }, // Búho grave (Rana Toro como alternativa)
        { options: [optC, optD], target: optC }, // Grillo agudo (Rana Toro como alternativa)
        { options: [optA, optC, optD], target: optA }, // Canario agudo (Rana Toro como alternativa)
        { options: [optA, optB, optC, optD], target: optC }, // Grillo agudo (Rana Toro como alternativa)
      ];
    } else if (categoryId === 'duration') {
      // optC (pato) nunca es target / estímulo sonoro, pero aparece como alternativa
      exerciseConfigs = [
        { options: [optA, optB], target: optA }, // Perro corto
        { options: [optA, optB, optC], target: optB }, // Vaca largo (Pato como alternativa)
        { options: [optA, optB, optC, optD], target: optD }, // Lobo largo (Pato como alternativa)
        { options: [optC, optD], target: optD }, // Lobo largo (Pato como alternativa)
        { options: [optA, optC, optD], target: optA }, // Perro corto (Pato como alternativa)
        { options: [optA, optB, optC, optD], target: optB }, // Vaca largo (Pato como alternativa)
      ];
    } else if (categoryId === 'intensity') {
      // optD (elefante) nunca es target / estímulo sonoro, pero aparece como alternativa
      exerciseConfigs = [
        { options: [optA, optB], target: optA }, // Gatito suave
        { options: [optA, optB, optC], target: optB }, // Caballo fuerte
        { options: [optA, optB, optC, optD], target: optB }, // Caballo fuerte (Elefante como alternativa)
        { options: [optC, optD], target: optC }, // Canario suave (Elefante como alternativa)
        { options: [optA, optC, optD], target: optA }, // Gatito suave (Elefante como alternativa)
        { options: [optA, optB, optC, optD], target: optC }, // Canario suave (Elefante como alternativa)
      ];
    } else {
      exerciseConfigs = [
        { options: [optA, optB], target: optA },
        { options: [optA, optB, optC], target: optB },
        { options: [optA, optB, optC, optD], target: optA },
        { options: [optC, optD], target: optC },
        { options: [optA, optC, optD], target: optA },
        { options: [optA, optB, optC, optD], target: optC },
      ];
    }
  } else {
    // Otros modos (voces, instrumentos, notas)
    exerciseConfigs = [
      { options: [optA, optB], target: optA },
      { options: [optA, optB, optC], target: optB },
      { options: [optA, optB, optC, optD], target: optD },
      { options: [optC, optD], target: optC },
      { options: [optA, optC, optD], target: optA },
      { options: [optA, optB, optC, optD], target: optC },
    ];
  }

  return exerciseConfigs.map((cfg, i) => {
    const targetOpt = cfg.target;
    const optCount = cfg.options.length;

    let prompt = `Presiona "Escuchar sonido". ¿Qué sonido escuchaste? Elige entre las ${optCount} alternativas de abajo.`;
    let hint = `Presta atención a las características sonoras de ${targetOpt.label}.`;

    if (themeMode === 'animals') {
      if (categoryId === 'frequency') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué animal cantó?`;
        hint = `Escucha el tono: ¿es agudo brillante como el Canario/Grillo o grave profundo como el Búho? Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'duration') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué sonido de animal escuchaste?`;
        hint = `Escucha el tiempo: ¿es corto y seco como el Perro o largo y prolongado como la Vaca/Lobo? Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'intensity') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué animal emitió el sonido?`;
        hint = `Escucha el volumen: ¿es tenue y suave como el Gatito/Canario o fuerte y potente como el Caballo? Corresponde a ${targetOpt.label}.`;
      }
    } else if (themeMode === 'voices') {
      if (categoryId === 'frequency') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué voz y vocal escuchaste?`;
        hint = `Escucha el registro vocal: ¿es aguda y clara de niña ("A"/"I") o honda y grave de hombre ("O"/"U")? Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'duration') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué palabra escuchaste?`;
        hint = `Escucha la duración: ¿es una palabra corta y concisa ("Paz"/"Sol") o larga y continua ("Paaaazzzzz"/"Sooooolllll")? Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'intensity') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué intensidad tuvo la voz?`;
        hint = `Escucha la fuerza vocal: ¿es un susurro suave ("Aquí..."/"Silencio...") o una voz fuerte ("¡AQUÍ!"/"¡SILENCIO!")? Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'prosody') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué entonación tiene la frase?`;
        hint = `Escucha la inflexión: ¿sube con duda de pregunta (↗️) o afirma con energía y certeza de exclamación (↘️)? Corresponde a ${targetOpt.label}.`;
      }
    } else if (themeMode === 'instruments') {
      if (categoryId === 'frequency') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué instrumento sonó?`;
        hint = `Escucha el tono: ¿es agudo brillante (Campana/Xilófono) o grave profundo (Timbal/Tambor)? Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'duration') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué instrumento sonó?`;
        hint = `Escucha la duración: ¿es un golpe corto (Claves/Maraca) o un sonido largo y sostenido (Órgano/Piano)? Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'intensity') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué instrumento sonó?`;
        hint = `Escucha la intensidad: ¿es un volumen suave y delicado (Kalimba/Caja de Música) o fuerte y potente (Tuba/Trompeta)? Corresponde a ${targetOpt.label}.`;
      }
    } else if (themeMode === 'notes') {
      if (categoryId === 'frequency') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué nota musical sonó?`;
        hint = `Escucha la afinación: notas agudas están afinadas en 600 Hz exactos, frente a las notas graves profundas. Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'duration') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué nota musical sonó?`;
        hint = `Escucha la duración: ¿es staccato corto picado (Fa/Re) o tenuto largo sostenido (Fa/Re)? Corresponde a ${targetOpt.label}.`;
      } else if (categoryId === 'intensity') {
        prompt = `Presiona "Escuchar sonido". Elige entre las ${optCount} alternativas: ¿Qué nota musical sonó?`;
        hint = `Escucha el volumen: ¿es pianissimo suave (Sol/Mi al 25%) o fortissimo fuerte (Sol/Mi al 100%)? Corresponde a ${targetOpt.label}.`;
      }
    }

    return {
      id: `l3-${themeMode}-${categoryId}-${i + 1}`,
      category: categoryId,
      questionNumber: i + 1,
      correctAnswer: targetOpt.value,
      soundItem: targetOpt.value as any,
      prompt,
      hint,
      options: cfg.options,
    };
  });
}

// Retrocompatibilidad con la exportación antigua de LEVEL3_OPTIONS y LEVEL3_EXERCISES
export const LEVEL3_OPTIONS: Record<CategoryId, { [key: string]: Level3Option }> = {
  duration: LEVEL3_OPTIONS_BY_MODE.instruments.duration!,
  frequency: LEVEL3_OPTIONS_BY_MODE.notes.frequency!,
  intensity: LEVEL3_OPTIONS_BY_MODE.instruments.intensity!,
  prosody: LEVEL3_OPTIONS_BY_MODE.voices.prosody!,
};

export const LEVEL3_EXERCISES: Record<CategoryId, Level3Exercise[]> = {
  duration: getLevel3Exercises('instruments', 'duration'),
  frequency: getLevel3Exercises('notes', 'frequency'),
  intensity: getLevel3Exercises('instruments', 'intensity'),
  prosody: getLevel3Exercises('voices', 'prosody'),
};
