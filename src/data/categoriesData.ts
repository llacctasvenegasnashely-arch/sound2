import { CategoryId, CategoryThemeInfo, PatternItem, SoundOption, SoundThemeMode } from '../types/game';

export const THEME_MODES: {
  id: SoundThemeMode;
  title: string;
  subtitle: string;
  emoji: string;
  badge: string;
}[] = [
  {
    id: 'instruments',
    title: 'Instrumentos Musicales',
    subtitle: 'N1: Xilófono/Tambor · N2: Flauta/Tuba · N3: Campana/Timbal',
    emoji: '🎵',
    badge: 'Sonidos Reales (44.1/48 kHz)',
  },
  {
    id: 'animals',
    title: 'Selva y Granja de Animales',
    subtitle: 'N1: Canario/Búho · N2: Grillo/Rana Toro · N3: Delfín/León',
    emoji: '🦉',
    badge: 'Naturaleza Real (44.1/48 kHz)',
  },
  {
    id: 'voices',
    title: 'Voz Humana',
    subtitle: 'N1: Niña/Hombre · N2: Vocales I/U · N3: Prosodia y Frases',
    emoji: '🗣️',
    badge: 'Estimulación Fonoaudiológica (1 vez)',
  },
  {
    id: 'notes',
    title: 'Notas Musicales',
    subtitle: 'N1: Agudo 600Hz/Do2 · N2: Agudo 600Hz/Mi2 · N3: Agudo 600Hz/La1',
    emoji: '🎹',
    badge: 'Escala y Armónicos (44.1 kHz)',
  },
];

export const CATEGORIES_DATA: Record<CategoryId, CategoryThemeInfo> = {
  frequency: {
    id: 'frequency',
    title: 'Tono y Frecuencia',
    subtitle: 'Sonidos Agudos vs. Graves',
    description: 'Distingue notas altas y brillantes de notas profundas y graves con timbres diferentes en cada nivel.',
    iconName: 'Activity',
    themeColor: {
      primary: '#06b6d4', // cyan-500
      secondary: '#6366f1', // indigo-500
      bgGradient: 'from-cyan-900/60 via-slate-900 to-indigo-950/70',
      border: 'border-cyan-500/40 hover:border-cyan-400',
    },
    optionsByMode: {
      instruments: {
        1: [
          {
            value: 'xilofono_agudo',
            label: 'Xilófono',
            helper: 'Campanadas cristalinas y notas agudas brillantes de madera',
            emoji: '🎼',
            color: 'from-cyan-400 to-sky-500',
            description: 'Notas agudas brillantes (C6) · 3.0s',
            tag: 'Agudo (3s)',
          },
          {
            value: 'tambor_grave',
            label: 'Tambor',
            helper: 'Golpe hondo, muy grave, nítido y con ataque claro',
            emoji: '🥁',
            color: 'from-indigo-600 via-purple-700 to-slate-900',
            description: 'Golpe muy grave y claro (42 Hz) · 3.0s',
            tag: 'Grave (3s)',
          },
        ],
        2: [
          {
            value: 'campana_aguda',
            label: 'Campana de Cristal',
            helper: 'Timbre metálico brillante, cristalino y muy agudo de campana',
            emoji: '🔔',
            color: 'from-amber-300 via-yellow-400 to-orange-400',
            description: 'Campana aguda de cristal · 3.0s',
            tag: 'Agudo (3s)',
          },
          {
            value: 'tuba_grave',
            label: 'Tuba Profunda',
            helper: 'Resonancia metálica muy grave, cavernosa y profunda',
            emoji: '📯',
            color: 'from-amber-700 via-orange-800 to-slate-900',
            description: 'Tuba muy grave (55 Hz) · 3.0s',
            tag: 'Grave (3s)',
          },
        ],
        3: [
          {
            value: 'campana_aguda',
            label: 'Campana de Cristal',
            helper: 'Timbre metálico ultra agudo con brillo estelar y resonancia alta',
            emoji: '🔔',
            color: 'from-yellow-300 via-amber-400 to-orange-400',
            description: 'Campana aguda metálica (D6 2349 Hz) · 3.0s',
            tag: 'Agudo (3s)',
          },
          {
            value: 'timbal_grave',
            label: 'Timbal Sinfónico',
            helper: 'Pulsación orquestal masiva, subgrave profunda y envolvente',
            emoji: '🪘',
            color: 'from-violet-800 via-purple-900 to-slate-950',
            description: 'Timbal grave resonante (48 Hz) · 3.0s',
            tag: 'Grave (3s)',
          },
        ],
      },
      animals: {
        1: [
          {
            value: 'canario',
            label: 'Pajarito Canario',
            helper: 'Canto agudo, trino cristalino y brillante',
            emoji: '🐤',
            color: 'from-amber-300 via-yellow-400 to-amber-500',
            description: 'Pajarito agudo (4.5 kHz) · 2.0s',
            tag: 'Pajarito Agudo (2.0s)',
          },
          {
            value: 'buho',
            label: 'Búho Sabio',
            helper: 'Ulular hondo, muy grave y resonante (¡Huuu!)',
            emoji: '🦉',
            color: 'from-indigo-600 via-purple-700 to-slate-900',
            description: 'Ulular muy grave (125 Hz) · 2.0s',
            tag: 'Búho Grave (2.0s)',
          },
        ],
        2: [
          {
            value: 'canario',
            label: 'Pajarito Canario',
            helper: 'Trino alegre, cristalino y cantarín en las alturas',
            emoji: '🐤',
            color: 'from-amber-300 via-yellow-400 to-amber-500',
            description: 'Pajarito agudo (4.5 kHz) · 2.0s',
            tag: 'Pajarito Agudo (2.0s)',
          },
          {
            value: 'buho',
            label: 'Búho Sabio',
            helper: 'Ulular hondo, misterioso y cavernoso',
            emoji: '🦉',
            color: 'from-indigo-600 via-purple-700 to-slate-900',
            description: 'Ulular muy grave (125 Hz) · 2.0s',
            tag: 'Búho Grave (2.0s)',
          },
        ],
        3: [
          {
            value: 'canario',
            label: 'Pajarito Canario',
            helper: 'Canto celestial ultra agudo y nítido',
            emoji: '🐤',
            color: 'from-amber-300 via-yellow-400 to-amber-500',
            description: 'Pajarito agudo (4.5 kHz) · 2.0s',
            tag: 'Pajarito Agudo (2.0s)',
          },
          {
            value: 'buho',
            label: 'Búho Sabio',
            helper: 'Ulular ancestral profundo y majestuoso',
            emoji: '🦉',
            color: 'from-indigo-600 via-purple-700 to-slate-900',
            description: 'Ulular muy grave (125 Hz) · 2.0s',
            tag: 'Búho Grave (2.0s)',
          },
        ],
      },
      voices: {
        1: [
          {
            value: 'voz_nina_agudo',
            label: 'Niña: Vocal "E"',
            helper: 'Voz alegre y cristalina de niña pequeña diciendo la vocal "E" (1 sola vez)',
            emoji: '👧',
            color: 'from-pink-400 via-rose-500 to-amber-300',
            description: 'Vocal "E" aguda y brillante (1 vez) · 2.5s',
            tag: 'Voz Aguda (1 vez)',
          },
          {
            value: 'voz_hombre_grave',
            label: 'Hombre: Vocal "E"',
            helper: 'Voz honda, profunda y resonante de hombre adulto diciendo la vocal "E" (1 sola vez)',
            emoji: '🧔',
            color: 'from-indigo-600 via-slate-800 to-cyan-900',
            description: 'Vocal "E" grave y profunda (1 vez) · 2.5s',
            tag: 'Voz Grave (1 vez)',
          },
        ],
        2: [
          {
            value: 'voz_vocal_i_aguda',
            label: 'Vocal Aguda: "I"',
            helper: 'Voz infantil brillante entonando la vocal alta y aguda "¡Iiii!"',
            emoji: '👧',
            color: 'from-fuchsia-400 via-pink-500 to-purple-600',
            description: 'Vocal aguda "I" (F2 ~2600 Hz) · 2.5s',
            tag: 'Vocal "I" Aguda',
          },
          {
            value: 'voz_vocal_u_grave',
            label: 'Vocal Grave: "U"',
            helper: 'Voz profunda entonando la vocal oscura y grave "¡Uuuu!"',
            emoji: '🧔',
            color: 'from-blue-700 via-indigo-900 to-slate-950',
            description: 'Vocal grave "U" (F1/F2 bajas ~350 Hz) · 2.5s',
            tag: 'Vocal "U" Grave',
          },
        ],
        3: [
          {
            value: 'voz_vocal_a_aguda',
            label: 'Vocal Clara: "A"',
            helper: 'Vocal abierta, luminosa y aguda "¡Aaaa!" entonada con brillo',
            emoji: '👧',
            color: 'from-rose-400 via-orange-400 to-amber-400',
            description: 'Vocal abierta aguda "A" · 2.5s',
            tag: 'Vocal "A" Aguda',
          },
          {
            value: 'voz_vocal_o_grave',
            label: 'Vocal Honda: "O"',
            helper: 'Vocal cavernosa, redondeada y grave "¡Oooo!" entonada con peso',
            emoji: '🧔',
            color: 'from-slate-700 via-purple-950 to-slate-900',
            description: 'Vocal honda grave "O" · 2.5s',
            tag: 'Vocal "O" Grave',
          },
        ],
      },
      notes: {
        1: [
          {
            value: 'nota_aguda',
            label: 'Nota Aguda (600 Hz)',
            helper: 'Nota clara, suave y brillante afinada exactamente en 600 Hz para el oído infantil',
            emoji: '🎼',
            color: 'from-cyan-400 via-sky-500 to-blue-600',
            description: 'Nota aguda afinada en 600 Hz · 3.0s',
            tag: 'Agudo 600 Hz (3s)',
          },
          {
            value: 'nota_grave',
            label: 'Nota Do Grave',
            helper: 'Nota honda, profunda y resonante de la escala baja (Do2 - 65.4 Hz)',
            emoji: '🎹',
            color: 'from-indigo-600 via-purple-700 to-slate-900',
            description: 'Do grave profundo (65.4 Hz) · 3.0s',
            tag: 'Do Grave (3s)',
          },
        ],
        2: [
          {
            value: 'nota_sol_agudo',
            label: 'Nota Sol Agudo (600 Hz)',
            helper: 'Nota clara, suave y brillante afinada en 600 Hz para el oído infantil',
            emoji: '🎶',
            color: 'from-teal-300 via-cyan-400 to-blue-500',
            description: 'Sol agudo calibrado a 600 Hz · 3.0s',
            tag: 'Agudo 600 Hz (3s)',
          },
          {
            value: 'nota_mi_grave',
            label: 'Nota Mi Grave',
            helper: 'Bajo orquestal resonante de la escala grave (Mi2 - 82.4 Hz)',
            emoji: '🎸',
            color: 'from-slate-700 via-indigo-950 to-slate-900',
            description: 'Mi grave bajo (82.4 Hz) · 3.0s',
            tag: 'Mi Grave (3s)',
          },
        ],
        3: [
          {
            value: 'nota_si_agudo',
            label: 'Nota Si Agudo (600 Hz)',
            helper: 'Nota alta, dulce y clara afinada en 600 Hz para el oído infantil',
            emoji: '✨',
            color: 'from-amber-300 via-yellow-400 to-sky-400',
            description: 'Si agudo calibrado a 600 Hz · 3.0s',
            tag: 'Agudo 600 Hz (3s)',
          },
          {
            value: 'nota_la_grave',
            label: 'Nota La Grave',
            helper: 'Subgrave profundo y cálido (La1 - 55.0 Hz)',
            emoji: '🎻',
            color: 'from-purple-900 via-indigo-950 to-slate-950',
            description: 'La grave profundo (55.0 Hz) · 3.0s',
            tag: 'La Grave (3s)',
          },
        ],
      },
    },
  },
  duration: {
    id: 'duration',
    title: 'Duración y Tiempo',
    subtitle: 'Sonidos Cortos vs. Largos',
    description: 'Distingue sonidos cortos y secos frente a sonidos alargados y sostenidos con instrumentos y timbres nuevos en cada nivel.',
    iconName: 'Clock',
    themeColor: {
      primary: '#10b981', // emerald-500
      secondary: '#f59e0b', // amber-500
      bgGradient: 'from-emerald-900/60 via-slate-900 to-amber-950/70',
      border: 'border-emerald-500/40 hover:border-emerald-400',
    },
    optionsByMode: {
      instruments: {
        1: [
          {
            value: 'guitarra_corta',
            label: 'Guitarra Corta',
            helper: 'Rasgueo corto y seco de guitarra acústica (2 segundos)',
            emoji: '🎸',
            color: 'from-amber-400 to-orange-500',
            description: 'Rasgueo corto · 2.0s',
            tag: 'Corto (2s)',
          },
          {
            value: 'xilofono_largo',
            label: 'Xilófono Largo',
            helper: 'Melodía suave de 4 campanas con eco sostenido largo (4 segundos)',
            emoji: '🎼',
            color: 'from-emerald-400 via-teal-500 to-cyan-600',
            description: 'Melodía larga y sostenida · 4.0s',
            tag: 'Largo (4s)',
          },
        ],
        2: [
          {
            value: 'maraca_corta',
            label: 'Maraca Seca',
            helper: 'Sacudida corta, percusiva y staccato de maraca (0.7 segundos)',
            emoji: '🪇',
            color: 'from-yellow-400 to-amber-600',
            description: 'Golpe seco de maraca · 0.7s',
            tag: 'Corto (0.7s)',
          },
          {
            value: 'xilofono_largo',
            label: 'Xilófono Largo',
            helper: 'Melodía suave de xilófono con resonancia continua y sostenida (4 segundos)',
            emoji: '🎼',
            color: 'from-emerald-400 via-teal-500 to-cyan-600',
            description: 'Melodía sostenida de xilófono · 4.0s',
            tag: 'Largo (4.0s)',
          },
        ],
        3: [
          {
            value: 'claves_cortas',
            label: 'Claves de Madera',
            helper: 'Impacto rápido y muy seco de madera fina (0.6 segundos)',
            emoji: '🪵',
            color: 'from-orange-400 to-amber-700',
            description: 'Golpe de madera corto · 0.6s',
            tag: 'Corto (0.6s)',
          },
          {
            value: 'organo_largo',
            label: 'Órgano Cósmico',
            helper: 'Acorde majestuoso de órgano sostenido en el tiempo (4 segundos)',
            emoji: '🎹',
            color: 'from-blue-600 via-indigo-600 to-purple-800',
            description: 'Acorde continuo sostenido · 4.0s',
            tag: 'Largo (4s)',
          },
        ],
      },
      animals: {
        1: [
          {
            value: 'perro',
            label: 'Perro Guardián',
            helper: 'Ladrido rápido, corto y seco (¡Guau!)',
            emoji: '🐶',
            color: 'from-amber-400 to-orange-500',
            description: 'Ladrido corto y seco · 0.8s',
            tag: 'Corto (0.8s)',
          },
          {
            value: 'vaca',
            label: 'Vaca Espacial',
            helper: 'Mugido largo, continuo y sostenido (¡Muuuuuu!)',
            emoji: '🐮',
            color: 'from-emerald-400 via-teal-500 to-cyan-600',
            description: 'Mugido sostenido · 2.0s',
            tag: 'Largo (2.0s)',
          },
        ],
        2: [
          {
            value: 'perro',
            label: 'Perro Guardián',
            helper: 'Ladrido enérgico, breve y staccato (¡Guau!)',
            emoji: '🐶',
            color: 'from-amber-400 to-orange-500',
            description: 'Ladrido corto y seco · 0.8s',
            tag: 'Corto (0.8s)',
          },
          {
            value: 'vaca',
            label: 'Vaca Espacial',
            helper: 'Mugido largo, continuo y sostenido (¡Muuuuuu!)',
            emoji: '🐮',
            color: 'from-emerald-400 via-teal-500 to-cyan-600',
            description: 'Mugido sostenido · 2.0s',
            tag: 'Largo (2.0s)',
          },
        ],
        3: [
          {
            value: 'perro',
            label: 'Perro Guardián',
            helper: 'Ladrido rápido y seco de guardia (¡Guau!)',
            emoji: '🐶',
            color: 'from-amber-400 to-orange-500',
            description: 'Ladrido corto y seco · 0.8s',
            tag: 'Corto (0.8s)',
          },
          {
            value: 'vaca',
            label: 'Vaca Espacial',
            helper: 'Mugido largo, continuo y sostenido (¡Muuuuuu!)',
            emoji: '🐮',
            color: 'from-emerald-400 via-teal-500 to-cyan-600',
            description: 'Mugido sostenido · 2.0s',
            tag: 'Largo (2.0s)',
          },
        ],
      },
      voices: {
        1: [
          {
            value: 'voz_corta_hola',
            label: 'Palabra Corta: "Hola"',
            helper: 'Palabra "Hola" dicha de forma rápida, clara y breve (1 sola vez)',
            emoji: '👋',
            color: 'from-amber-400 to-orange-500',
            description: '"Hola" corto y claro (1 vez) · 1.2s',
            tag: 'Palabra Corta (1 vez)',
          },
          {
            value: 'voz_larga_hola',
            label: 'Palabra Larga: "Hoooolaaaa"',
            helper: 'Palabra "Hola" dicha de forma muy alargada, estirada y sostenida (1 sola vez)',
            emoji: '🗣️',
            color: 'from-emerald-400 via-teal-500 to-cyan-600',
            description: '"Hoooolaaaa" alargado continuo (1 vez) · 3.5s',
            tag: 'Palabra Larga (1 vez)',
          },
        ],
        2: [
          {
            value: 'voz_corta_sol',
            label: 'Palabra Corta: "Sol"',
            helper: 'Monosílabo rápido y seco "Sol" (1 sola vez)',
            emoji: '☀️',
            color: 'from-yellow-400 to-amber-500',
            description: '"Sol" pronunciado corto · 0.85s',
            tag: 'Palabra Corta "Sol"',
          },
          {
            value: 'voz_larga_sol',
            label: 'Palabra Larga: "Sooooolllll"',
            helper: 'Palabra alargada y cantada de manera sostenida: "Sooooolllll" (1 sola vez)',
            emoji: '🌅',
            color: 'from-orange-500 via-amber-600 to-yellow-600',
            description: '"Sooooolllll" sostenido largo · 3.5s',
            tag: 'Palabra Larga "Sol"',
          },
        ],
        3: [
          {
            value: 'voz_corta_paz',
            label: 'Palabra Corta: "Paz"',
            helper: 'Palabra monosilábica rápida y concisa: "Paz" (1 sola vez)',
            emoji: '🕊️',
            color: 'from-sky-400 to-blue-500',
            description: '"Paz" pronunciado corto · 0.85s',
            tag: 'Palabra Corta "Paz"',
          },
          {
            value: 'voz_larga_paz',
            label: 'Palabra Larga: "Paaaazzzzz"',
            helper: 'Vocal y consonante estirada suavemente en el tiempo: "Paaaazzzzz" (1 sola vez)',
            emoji: '🌌',
            color: 'from-indigo-400 via-purple-500 to-pink-500',
            description: '"Paaaazzzzz" alargado continuo · 3.5s',
            tag: 'Palabra Larga "Paz"',
          },
        ],
      },
      notes: {
        1: [
          {
            value: 'nota_corta',
            label: 'Nota Corta (Staccato)',
            helper: 'Nota de piano Do tocada de forma picada, breve y seca (0.75 segundos)',
            emoji: '⚡',
            color: 'from-amber-400 to-orange-500',
            description: 'Do Staccato corto picado · 0.75s',
            tag: 'Staccato (0.75s)',
          },
          {
            value: 'nota_larga',
            label: 'Nota Larga (Tenuto)',
            helper: 'Nota de piano Do pulsada con pedal y sostenida en el tiempo (3.5 segundos)',
            emoji: '⏳',
            color: 'from-emerald-400 via-teal-500 to-cyan-600',
            description: 'Do Tenuto largo sostenido · 3.5s',
            tag: 'Tenuto (3.5s)',
          },
        ],
        2: [
          {
            value: 'nota_re_staccato',
            label: 'Nota Re Corta',
            helper: 'Nota Re atacada de manera rápida, staccato y enérgica (0.65 segundos)',
            emoji: '🎵',
            color: 'from-yellow-400 to-amber-600',
            description: 'Re Staccato corto · 0.65s',
            tag: 'Re Corto (0.65s)',
          },
          {
            value: 'nota_re_tenuto',
            label: 'Nota Re Larga',
            helper: 'Nota Re que resuena largamente en el espacio sin apagarse (3.5 segundos)',
            emoji: '🪐',
            color: 'from-teal-400 via-emerald-500 to-blue-600',
            description: 'Re Tenuto sostenido · 3.5s',
            tag: 'Re Largo (3.5s)',
          },
        ],
        3: [
          {
            value: 'nota_fa_staccato',
            label: 'Nota Fa Corta',
            helper: 'Nota Fa golpeada con ligereza y corte inmediato (0.65 segundos)',
            emoji: '⭐',
            color: 'from-orange-400 to-rose-500',
            description: 'Fa Staccato corto · 0.65s',
            tag: 'Fa Corto (0.65s)',
          },
          {
            value: 'nota_fa_tenuto',
            label: 'Nota Fa Larga',
            helper: 'Acorde y nota Fa en vibración sinfónica prolongada (4.0 segundos)',
            emoji: '🌌',
            color: 'from-purple-500 via-indigo-600 to-blue-700',
            description: 'Fa sostenido sinfónico · 4.0s',
            tag: 'Fa Largo (4s)',
          },
        ],
      },
    },
  },
  intensity: {
    id: 'intensity',
    title: 'Intensidad y Volumen',
    subtitle: 'Sonidos Suaves vs. Fuertes',
    description: 'Distingue caricias suaves (pianissimo) de golpes fuertes (fortissimo) con timbres renovados en cada nivel.',
    iconName: 'Volume2',
    themeColor: {
      primary: '#ec4899', // pink-500
      secondary: '#8b5cf6', // purple-500
      bgGradient: 'from-pink-900/60 via-slate-900 to-purple-950/70',
      border: 'border-pink-500/40 hover:border-pink-400',
    },
    optionsByMode: {
      instruments: {
        1: [
          {
            value: 'arpa_suave',
            label: 'Arpa Suave',
            helper: 'Melodía suave, dulce, relajante y delicada de arpa celestial',
            emoji: '🪕',
            color: 'from-indigo-400 to-purple-500',
            description: 'Arpegio suave pianissimo (25% vol) · 3.0s',
            tag: 'Suave (3s)',
          },
          {
            value: 'guitarra_fuerte',
            label: 'Guitarra Fuerte',
            helper: 'Acorde potente, enérgico y con mucho volumen de guitarra eléctrica',
            emoji: '⚡',
            color: 'from-rose-500 via-pink-600 to-red-600',
            description: 'Acorde eléctrico fortissimo (100% vol) · 3.0s',
            tag: 'Fuerte (3s)',
          },
        ],
        2: [
          {
            value: 'caja_musica_suave',
            label: 'Caja de Música Suave',
            helper: 'Campanitas diminutas, muy suaves y susurradas como de cuna',
            emoji: '🧸',
            color: 'from-teal-300 via-cyan-400 to-blue-400',
            description: 'Caja de música suave íntima (25% vol) · 3.0s',
            tag: 'Suave (3s)',
          },
          {
            value: 'trompeta_fuerte',
            label: 'Trompeta Fuerte',
            helper: 'Fanfarria brillante, enérgica y potente de bronce al máximo volumen',
            emoji: '🎺',
            color: 'from-amber-400 via-orange-500 to-red-600',
            description: 'Trompeta potente fortissimo (100% vol) · 3.0s',
            tag: 'Fuerte (3s)',
          },
        ],
        3: [
          {
            value: 'kalimba_suave',
            label: 'Kalimba Suave',
            helper: 'Gotitas de madera suave tocadas con los pulgares con volumen tenue',
            emoji: '🪵',
            color: 'from-sky-300 to-indigo-400',
            description: 'Kalimba tenue delicada (25% vol) · 3.0s',
            tag: 'Suave (3s)',
          },
          {
            value: 'tuba_fuerte',
            label: 'Tuba Potente',
            helper: 'Ataque fortissimo enérgico y resonante de tuba a gran volumen (100%)',
            emoji: '📯',
            color: 'from-amber-600 via-orange-700 to-red-800',
            description: 'Tuba fortissimo potente (100% vol) · 3.0s',
            tag: 'Fuerte (3s)',
          },
        ],
      },
      animals: {
        1: [
          {
            value: 'gato',
            label: 'Gatito Suave',
            helper: 'Maullido y ronroneo tierno, suave y delicado (¡Miau!)',
            emoji: '🐱',
            color: 'from-indigo-400 to-purple-500',
            description: 'Ronroneo suave delicado · 2.0s',
            tag: 'Suave (2.0s)',
          },
          {
            value: 'caballo',
            label: 'Caballo Fuerte',
            helper: 'Relincho enérgico, resonante y potente a gran volumen (¡Hiiigh!)',
            emoji: '🐴',
            color: 'from-rose-500 via-pink-600 to-red-600',
            description: 'Relincho potente con volumen fuerte · 1.0s',
            tag: 'Fuerte (1.0s)',
          },
        ],
        2: [
          {
            value: 'gato',
            label: 'Gatito Suave',
            helper: 'Maullido dulce y ronroneo suave en calma (¡Miau!)',
            emoji: '🐱',
            color: 'from-indigo-400 to-purple-500',
            description: 'Ronroneo suave delicado · 2.0s',
            tag: 'Suave (2.0s)',
          },
          {
            value: 'caballo',
            label: 'Caballo Fuerte',
            helper: 'Relincho enérgico y potente a gran volumen (¡Hiiigh!)',
            emoji: '🐴',
            color: 'from-rose-500 via-pink-600 to-red-600',
            description: 'Relincho potente con volumen fuerte · 1.0s',
            tag: 'Fuerte (1.0s)',
          },
        ],
        3: [
          {
            value: 'gato',
            label: 'Gatito Suave',
            helper: 'Ronroneo muy tenue, tierno y relajante (¡Miau!)',
            emoji: '🐱',
            color: 'from-indigo-400 to-purple-500',
            description: 'Ronroneo suave delicado · 2.0s',
            tag: 'Suave (2.0s)',
          },
          {
            value: 'caballo',
            label: 'Caballo Fuerte',
            helper: 'Relincho triunfal masivo y estruendoso (¡Hiiigh!)',
            emoji: '🐴',
            color: 'from-rose-500 via-pink-600 to-red-600',
            description: 'Relincho potente con volumen fuerte · 1.0s',
            tag: 'Fuerte (1.0s)',
          },
        ],
      },
      voices: {
        1: [
          {
            value: 'voz_susurro_suave',
            label: 'Susurro Suave: "Secreto"',
            helper: 'Voz en susurro suave, íntimo y delicado diciendo: "secreto..." (1 sola vez)',
            emoji: '🤫',
            color: 'from-indigo-400 to-purple-500',
            description: 'Susurro íntimo (25% vol) · 2.2s',
            tag: 'Susurro Suave (1 vez)',
          },
          {
            value: 'voz_fuerte_aqui',
            label: 'Voz Fuerte: "¡AQUÍ ESTOY!"',
            helper: 'Voz enérgica, firme y proyectada con mucho volumen: "¡AQUÍ ESTOY!" (1 sola vez)',
            emoji: '📢',
            color: 'from-rose-500 via-pink-600 to-red-600',
            description: 'Voz potente fortissimo (100% vol) · 2.2s',
            tag: 'Voz Fuerte (1 vez)',
          },
        ],
        2: [
          {
            value: 'voz_susurro_silencio',
            label: 'Susurro: "Silencio..."',
            helper: 'Susurro tenue que invita a guardar calma: "Silencio..." (1 sola vez)',
            emoji: '🤫',
            color: 'from-cyan-400 to-blue-500',
            description: 'Susurro tenue "Silencio..." · 2.2s',
            tag: 'Susurro Suave',
          },
          {
            value: 'voz_fuerte_silencio',
            label: 'Voz Firme: "¡SILENCIO!"',
            helper: 'Voz rotunda, enérgica y proyectada a todo volumen: "¡SILENCIO!" (1 sola vez)',
            emoji: '📣',
            color: 'from-amber-500 via-orange-600 to-red-600',
            description: 'Voz firme fuerte · 2.2s',
            tag: 'Voz Fuerte',
          },
        ],
        3: [
          {
            value: 'voz_susurro_aqui2',
            label: 'Susurro: "Aquí..."',
            helper: 'Susurro secreto y delicado diciendo suavemente: "Aquí..." (1 sola vez)',
            emoji: '🕯️',
            color: 'from-teal-300 via-sky-400 to-indigo-400',
            description: 'Susurro íntimo suave · 2.2s',
            tag: 'Susurro Suave',
          },
          {
            value: 'voz_fuerte_aqui2',
            label: 'Grito Alegre: "¡AQUÍ!"',
            helper: 'Voz alegre, luminosa y muy fuerte diciendo: "¡AQUÍ!" (1 sola vez)',
            emoji: '🎉',
            color: 'from-fuchsia-500 via-rose-600 to-red-600',
            description: 'Grito festivo fuerte · 2.2s',
            tag: 'Voz Fuerte',
          },
        ],
      },
      notes: {
        1: [
          {
            value: 'nota_suave',
            label: 'Nota Suave (Pianissimo)',
            helper: 'Nota pulsada con toque delicado, íntimo y suave a bajo volumen (25% vol)',
            emoji: '🌙',
            color: 'from-indigo-400 to-purple-500',
            description: 'Volumen suave 25% · 3.0s',
            tag: 'Suave: Pianissimo (3s)',
          },
          {
            value: 'nota_fuerte',
            label: 'Nota Fuerte (Fortissimo)',
            helper: 'Nota pulsada con ataque enérgico, brillante y resonante a pleno volumen (100% vol)',
            emoji: '💥',
            color: 'from-rose-500 via-pink-600 to-red-600',
            description: 'Volumen fuerte 100% · 3.0s',
            tag: 'Fuerte: Fortissimo (3s)',
          },
        ],
        2: [
          {
            value: 'nota_mi_pianissimo',
            label: 'Nota Mi Suave',
            helper: 'Nota Mi pulsada como una caricia ligera pianissimo (25% volumen)',
            emoji: '🪶',
            color: 'from-teal-300 to-blue-400',
            description: 'Mi Pianissimo suave · 3.0s',
            tag: 'Mi Suave (25%)',
          },
          {
            value: 'nota_mi_fortissimo',
            label: 'Nota Mi Fuerte',
            helper: 'Nota Mi golpeada con fuerza, garra y volumen resonante total',
            emoji: '⚡',
            color: 'from-amber-400 via-orange-500 to-red-600',
            description: 'Mi Fortissimo potente · 3.0s',
            tag: 'Mi Fuerte (100%)',
          },
        ],
        3: [
          {
            value: 'nota_sol_pianissimo',
            label: 'Nota Sol Suave',
            helper: 'Nota Sol acariciada con suavidad celestial y volumen íntimo',
            emoji: '🕊️',
            color: 'from-sky-300 to-indigo-400',
            description: 'Sol Pianissimo suave · 3.0s',
            tag: 'Sol Suave (25%)',
          },
          {
            value: 'nota_sol_fortissimo',
            label: 'Nota Sol Fuerte',
            helper: 'Nota Sol atacada con toda la potencia del piano sinfónico',
            emoji: '🌟',
            color: 'from-rose-500 via-red-600 to-purple-700',
            description: 'Sol Fortissimo estruendoso · 3.0s',
            tag: 'Sol Fuerte (100%)',
          },
        ],
      },
    },
  },
  prosody: {
    id: 'prosody',
    title: 'Prosodia y Entonación',
    subtitle: 'Pregunta vs. Exclamación',
    description: 'Entrena la melodía y entonación de la voz: descubre si la frase sube con curiosidad de pregunta o afirma con energía alegre.',
    iconName: 'MessageCircle',
    themeColor: {
      primary: '#f59e0b', // amber-500
      secondary: '#8b5cf6', // purple-500
      bgGradient: 'from-amber-900/60 via-slate-900 to-purple-950/70',
      border: 'border-amber-500/40 hover:border-amber-400',
    },
    // La misión de Prosodia y Entonación pertenece exclusivamente al banco de Voz Humana
    optionsByMode: {
      voices: {
        1: [
          {
            value: 'voz_pregunta_frase',
            label: 'Pregunta ("¿Vamos a jugar?")',
            helper: 'Voz con entonación melódica ascendente de duda o pregunta: "¿Vamos a jugar?" (1 sola vez)',
            emoji: '❓',
            color: 'from-sky-400 via-blue-500 to-indigo-600',
            description: 'Entonación interrogativa "¿Vamos a jugar?" (1 vez) · 2.2s',
            tag: 'Pregunta: ¿Vamos a jugar?',
          },
          {
            value: 'voz_exclamacion_frase',
            label: 'Exclamación ("¡Vamos a jugar!")',
            helper: 'Voz con entonación firme, entusiasta y afirmativa: "¡Vamos a jugar!" (1 sola vez)',
            emoji: '❗',
            color: 'from-amber-400 via-orange-500 to-red-500',
            description: 'Entonación exclamativa "¡Vamos a jugar!" (1 vez) · 2.2s',
            tag: 'Exclamación: ¡Vamos a jugar!',
          },
        ],
        2: [
          {
            value: 'voz_pregunta_sorpresa',
            label: 'Pregunta ("¿Es una sorpresa?")',
            helper: 'Curva interrogativa con inflexión curiosa hacia arriba: "¿Es una sorpresa?" (1 sola vez)',
            emoji: '🎁',
            color: 'from-teal-400 via-cyan-500 to-blue-600',
            description: 'Entonación interrogativa "¿Es una sorpresa?" · 2.2s',
            tag: 'Pregunta: ¿Es sorpresa?',
          },
          {
            value: 'voz_exclamacion_sorpresa',
            label: 'Exclamación ("¡Es una sorpresa!")',
            helper: 'Remate alegre, enérgico y festivo con caída afirmativa: "¡Es una sorpresa!" (1 sola vez)',
            emoji: '🎉',
            color: 'from-yellow-400 via-amber-500 to-orange-500',
            description: 'Entonación exclamativa "¡Es una sorpresa!" · 2.2s',
            tag: 'Exclamación: ¡Es sorpresa!',
          },
        ],
        3: [
          {
            value: 'voz_pregunta_cohete',
            label: 'Pregunta ("¿Llegó el cohete?")',
            helper: 'Melodía de duda inquisitiva con tono flotante: "¿Llegó el cohete?" (1 sola vez)',
            emoji: '🛸',
            color: 'from-purple-400 via-indigo-500 to-sky-600',
            description: 'Entonación interrogativa "¿Llegó el cohete?" · 2.2s',
            tag: 'Pregunta: ¿Llegó el cohete?',
          },
          {
            value: 'voz_exclamacion_cohete',
            label: 'Exclamación ("¡Llegó el cohete!")',
            helper: 'Grito de emoción triunfal y certeza cósmica: "¡Llegó el cohete!" (1 sola vez)',
            emoji: '🚀',
            color: 'from-rose-500 via-red-500 to-amber-500',
            description: 'Entonación exclamativa "¡Llegó el cohete!" · 2.2s',
            tag: 'Exclamación: ¡Llegó cohete!',
          },
        ],
      },
    },
  },
};

/**
 * Helper to obtain options for a specific level, falling back safely.
 */
export function getCategoryOptions(
  categoryId: CategoryId,
  themeMode: SoundThemeMode,
  level: number = 1
): SoundOption[] {
  const cat = CATEGORIES_DATA[categoryId];
  if (!cat || !cat.optionsByMode) return [];
  const modeData = cat.optionsByMode[themeMode];
  if (!modeData) return [];
  if (Array.isArray(modeData)) return modeData;
  if (modeData[level]) return modeData[level];
  return modeData[1] || [];
}

/**
 * Helper to look up metadata for any sound item across all categories and levels.
 */
export function findOptionMeta(itemValue: PatternItem): SoundOption | undefined {
  for (const cat of Object.values(CATEGORIES_DATA)) {
    for (const modeData of Object.values(cat.optionsByMode)) {
      if (!modeData) continue;
      if (Array.isArray(modeData)) {
        const found = modeData.find((o) => o.value === itemValue);
        if (found) return found;
      } else {
        for (const opts of Object.values(modeData)) {
          const found = opts.find((o) => o.value === itemValue);
          if (found) return found;
        }
      }
    }
  }
  return undefined;
}
