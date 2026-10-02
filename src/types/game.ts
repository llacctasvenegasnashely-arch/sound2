/**
 * SoundPatty - Types and Data Models (Updated with Instruments, Animals & Human Voice)
 */

export type SoundThemeMode = 'instruments' | 'animals' | 'voices' | 'notes';

export type CategoryId = 'frequency' | 'duration' | 'intensity' | 'prosody';

// Frequency items
export type FrequencyItem = 
  | 'agudo' | 'grave'
  | 'xilofono_agudo' | 'tambor_grave' | 'piano_grave' | 'xilofono' | 'tambor'
  | 'flauta_aguda' | 'tuba_grave' | 'campana_aguda' | 'campana' | 'timbal_grave' | 'tuba'
  | 'canario' | 'buho' | 'rana_toro' | 'pajaro' | 'pajarito' | 'leon' | 'grillo' | 'delfin'
  | 'voz_nina_agudo' | 'voz_hombre_grave' | 'voz_vocal_i_aguda' | 'voz_vocal_u_grave' | 'voz_vocal_a_aguda' | 'voz_vocal_o_grave'
  | 'nota_aguda' | 'nota_grave' | 'nota_do_agudo' | 'nota_do_grave'
  | 'nota_sol_agudo' | 'nota_mi_grave' | 'nota_si_agudo' | 'nota_la_grave';

// Duration items
export type DurationItem = 
  | 'corto' | 'largo'
  | 'guitarra_corta' | 'xilofono_largo' | 'piano_largo' | 'tambor_corto' | 'triangulo_largo' | 'guitarra' | 'piano'
  | 'maraca_corta' | 'violin_largo' | 'claves_cortas' | 'organo_largo'
  | 'perro' | 'vaca' | 'pato' | 'lobo' | 'rana' | 'ballena'
  | 'voz_corta_sol' | 'voz_corta_hola' | 'voz_larga_hola' | 'voz_corta_sol2' | 'voz_larga_sol' | 'voz_corta_paz' | 'voz_larga_paz'
  | 'nota_corta' | 'nota_larga' | 'nota_staccato' | 'nota_tenuto'
  | 'nota_re_staccato' | 'nota_re_tenuto' | 'nota_fa_staccato' | 'nota_fa_tenuto';

// Intensity items
export type IntensityItem = 
  | 'suave' | 'fuerte'
  | 'arpa_suave' | 'guitarra_electrica_fuerte' | 'maraca_suave' | 'guitarra_fuerte' | 'arpa' | 'guitarra_electrica'
  | 'caja_musica_suave' | 'trompeta_fuerte' | 'kalimba_suave' | 'bateria_fuerte' | 'tuba_fuerte' | 'tuba'
  | 'gato' | 'caballo' | 'elefante' | 'pajarito_suave' | 'canario' | 'abeja' | 'oso_fuerte' | 'oso'
  | 'voz_susurro_suave' | 'voz_susurro_secreto' | 'voz_fuerte_aqui' | 'voz_fuerte_secreto'
  | 'voz_susurro_silencio' | 'voz_fuerte_silencio' | 'voz_susurro_aqui2' | 'voz_fuerte_aqui2'
  | 'nota_suave' | 'nota_fuerte' | 'nota_pianissimo' | 'nota_fortissimo'
  | 'nota_mi_pianissimo' | 'nota_mi_fortissimo' | 'nota_sol_pianissimo' | 'nota_sol_fortissimo';

// Prosody items (Pregunta vs Exclamación)
export type ProsodyItem = 
  | 'pregunta' | 'exclamacion'
  | 'voz_pregunta_si' | 'voz_pregunta_que' | 'voz_pregunta_frase'
  | 'voz_exclamacion_si' | 'voz_exclamacion_que' | 'voz_exclamacion_frase'
  | 'voz_pregunta_jugar' | 'voz_exclamacion_jugar'
  | 'voz_pregunta_sorpresa' | 'voz_exclamacion_sorpresa'
  | 'voz_pregunta_cohete' | 'voz_exclamacion_cohete'
  | 'nota_pregunta' | 'nota_exclamacion';

export type PatternItem = FrequencyItem | DurationItem | IntensityItem | ProsodyItem;

export interface SoundOption {
  value: PatternItem;
  label: string;
  helper: string;
  emoji: string;
  color: string;
  description: string;
  tag: string;
}

export interface CategoryThemeInfo {
  id: CategoryId;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  themeColor: {
    primary: string;
    secondary: string;
    bgGradient: string;
    border: string;
  };
  optionsByMode: Partial<Record<SoundThemeMode, Record<number, SoundOption[]>>>;
}

export interface Challenge {
  id: string;
  themeMode: SoundThemeMode;
  category: CategoryId;
  level: number;
  questionNumber: number;
  sequence: PatternItem[];
  hint?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: CategoryId | 'general';
  unlocked: boolean;
  unlockedAt?: string;
  rewardStars: number;
}

export interface Level3Option {
  value: string;
  label: string;
  subtitle: string;
  detail: string;
  badge: string;
  emoji: string;
  color: string;
  gradient: string;
}

export interface Level3Exercise {
  id: string;
  category: CategoryId;
  questionNumber: number;
  correctAnswer: string;
  prompt: string;
  hint: string;
  options: Level3Option[];
  soundItem?: PatternItem;
}

export interface UserProfile {
  name: string;
  avatarId: string;
  currentThemeMode: SoundThemeMode;
  totalStars: number;
  unlockedLevels: {
    instruments: Partial<Record<CategoryId, number>>;
    animals: Partial<Record<CategoryId, number>>;
    voices: Record<CategoryId, number>;
    notes: Partial<Record<CategoryId, number>>;
  };
  starsPerCategory: {
    instruments: Partial<Record<CategoryId, number>>;
    animals: Partial<Record<CategoryId, number>>;
    voices: Record<CategoryId, number>;
    notes: Partial<Record<CategoryId, number>>;
  };
  completedChallengesCount: number;
  firstTryWins: number;
  totalPlays: number;
  replaysCount: number;
  dragDropSuccessCount: number;
  unlockedAchievements: string[];
  playbackSpeed: 'normal' | 'lento';
  soundVolume: number;
}
