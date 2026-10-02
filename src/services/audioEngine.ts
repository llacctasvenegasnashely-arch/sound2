/**
 * SoundPatty - High-Fidelity Studio Audio Engine
 *
 * Technical Specifications:
 * - Sampling Rate: 48,000 Hz / 44,100 Hz high-resolution AudioContext
 * - Duration: >= 3.0 seconds per sound with natural repeats for short sounds & smooth fade-out
 * - Inter-sound spacing: 1.0 second pause between sequence elements
 * - Studio Signal Chain: High-Pass Rumble Filter (35Hz) -> Master Dynamics Compressor & Limiter -> Master Output
 * - Realistic Studio Models: Grand Piano, Orchestral Flute/Xylophone, Wooden Drum, Triangle, Maracas, Acoustic Guitar
 * - Authentic Animal Vocalizations:
 *    * Frecuencia (Agudo vs Grave): Pájaro Canario (3.8 kHz) vs. Búho Sabio (125 Hz)
 *    * Duración (Corto vs Largo): Perro Pastor Alemán (barks) vs. Vaca Lechera (moo continuo)
 *    * Intensidad (Suave vs Fuerte): Gato Doméstico (maullido/ronroneo suave) vs. Caballo (relincho potente)
 */

import { CategoryId, PatternItem } from '../types/game';

export interface SyntheticAudioCallbacks {
  onStart?: () => void;
  onProgress?: (elapsedSec: number, totalSec: number) => void;
  onToneStep?: (step: 1 | 2) => void;
  onEnd?: () => void;
}

export interface SequenceCallbacks {
  onStepStart?: (stepIndex: number, item: PatternItem, duration: number) => void;
  onStepProgress?: (stepIndex: number, elapsedSec: number, totalSec: number) => void;
  onPauseStart?: (afterStep: number, pauseDuration: number) => void;
  onStepEnd?: (stepIndex: number, item: PatternItem) => void;
  onComplete?: () => void;
}

export const SOUND_DURATION_SEC = 3.0; // 3.0s minimum duration for standard/long sounds (Mission 1, 3, and Mission 2 Largo)
export const SOUND_DURATION_SHORT_SEC = 0.75; // 0.75s for short sounds in Mission 2 (clearly distinguishable from 3.0s!)
export const STEP_INTERVAL_SEC = 1.0; // 1.0s pause between sequence sounds

export const REAL_AUDIO_MAP: Record<string, { path: string; duration: number; gain: number }> = {
  // --- REAL ANIMALS ---
  // L1-L3 Freq: Pajarito Canario (2.03s) vs Búho (2.03s)
  canario: { path: '/audio/canario.mp3', duration: 2.03, gain: 0.95 },
  pajaro: { path: '/audio/canario.mp3', duration: 2.03, gain: 0.95 },
  pajarito: { path: '/audio/canario.mp3', duration: 2.03, gain: 0.95 },
  buho: { path: '/audio/buho.mp3?v=3', duration: 2.03, gain: 1.05 },
  // L2 Freq (alternative / historical): Grillo vs Rana Toro
  grillo: { path: '/audio/grillo.mp3?v=l2', duration: 3.06, gain: 0.95 },
  rana_toro: { path: '/audio/rana_toro.mp3?v=real', duration: 1.40, gain: 1.10 },
  // L3 Freq (alternative / historical): Delfín vs León
  delfin: { path: '/audio/delfin.mp3?v=l3', duration: 3.06, gain: 0.95 },
  leon: { path: '/audio/leon.mp3?v=l3', duration: 3.06, gain: 1.10 },

  // L1-L3 Dur: Perro guardián corto (0.84s) vs Vaca mugido largo (2.03s)
  perro: { path: '/audio/perro.mp3', duration: 0.84, gain: 0.95 },
  vaca: { path: '/audio/vaca.mp3', duration: 2.03, gain: 1.0 },
  // Alternative animals
  pato: { path: '/audio/pato.mp3?v=real', duration: 1.50, gain: 1.0 },
  lobo: { path: '/audio/lobo.mp3?v=l2', duration: 3.55, gain: 1.0 },
  rana: { path: '/audio/rana.mp3?v=l3', duration: 0.65, gain: 0.95 },
  ballena: { path: '/audio/ballena.mp3?v=l3', duration: 3.55, gain: 1.0 },

  // L1-L3 Int: Gatito suave (2.03s) vs Caballo relincho fuerte (1.02s)
  gato: { path: '/audio/gato.mp3', duration: 2.03, gain: 0.35 },
  caballo: { path: '/audio/caballo.mp3?v=2', duration: 1.02, gain: 1.0 },
  // Alternative animals
  pajarito_suave: { path: '/audio/pajarito_suave.mp3?v=l2', duration: 3.06, gain: 0.35 },
  elefante: { path: '/audio/elefante.mp3?v=real', duration: 2.45, gain: 1.15 },
  canario_suave: { path: '/audio/canario.mp3?v=soft', duration: 2.03, gain: 0.30 },
  abeja: { path: '/audio/canario.mp3?v=soft', duration: 2.03, gain: 0.30 },
  oso_fuerte: { path: '/audio/oso.mp3?v=l3', duration: 3.06, gain: 1.10 },
  oso: { path: '/audio/oso.mp3?v=l3', duration: 3.06, gain: 1.10 },

  // --- REAL INSTRUMENTS ---
  // L1 Freq: Xilófono vs Tambor
  xilofono_agudo: { path: '/audio/xilofono.mp3?v=2', duration: 3.06, gain: 1.0 },
  xilofono: { path: '/audio/xilofono.mp3?v=2', duration: 3.06, gain: 1.0 },
  agudo: { path: '/audio/xilofono.mp3?v=2', duration: 3.06, gain: 1.0 },
  tambor_grave: { path: '/audio/tambor.mp3?v=4', duration: 3.06, gain: 1.15 },
  tambor: { path: '/audio/tambor.mp3?v=4', duration: 3.06, gain: 1.15 },
  piano_grave: { path: '/audio/tambor.mp3?v=4', duration: 3.06, gain: 1.15 },
  grave: { path: '/audio/tambor.mp3?v=4', duration: 3.06, gain: 1.15 },

  // L2 Freq: Campana de cristal vs Tuba grave (sustituye flauta por campana)
  campana_aguda: { path: '/audio/campana_aguda.mp3?v=l3', duration: 3.06, gain: 1.0 },
  campana: { path: '/audio/campana_aguda.mp3?v=l3', duration: 3.06, gain: 1.0 },
  tuba_grave: { path: '/audio/tuba_grave.mp3?v=l2', duration: 3.06, gain: 1.10 },
  tuba: { path: '/audio/tuba_grave.mp3?v=l2', duration: 3.06, gain: 1.10 },
  flauta_aguda: { path: '/audio/campana_aguda.mp3?v=l3', duration: 3.06, gain: 1.0 }, // compatibilidad
  // L3 Freq: Campana de cristal vs Timbal grave
  timbal_grave: { path: '/audio/timbal_grave.mp3?v=l3', duration: 3.06, gain: 1.15 },

  // L1 Dur: Guitarra corta (2.07s) vs Xilófono largo (4.08s)
  guitarra_corta: { path: '/audio/guitarra_corta.mp3?v=2', duration: 2.07, gain: 0.95 },
  guitarra: { path: '/audio/guitarra_corta.mp3?v=2', duration: 2.07, gain: 0.95 },
  tambor_corto: { path: '/audio/guitarra_corta.mp3?v=2', duration: 2.07, gain: 0.95 },
  corto: { path: '/audio/guitarra_corta.mp3?v=2', duration: 2.07, gain: 0.95 },
  xilofono_largo: { path: '/audio/xilofono_largo.mp3?v=2', duration: 4.08, gain: 1.0 },
  piano_largo: { path: '/audio/xilofono_largo.mp3?v=2', duration: 4.08, gain: 1.0 },
  piano: { path: '/audio/xilofono_largo.mp3?v=2', duration: 4.08, gain: 1.0 },
  triangulo_largo: { path: '/audio/xilofono_largo.mp3?v=2', duration: 4.08, gain: 1.0 },
  largo: { path: '/audio/xilofono_largo.mp3?v=2', duration: 4.08, gain: 1.0 },
  // L2 Dur: Maraca seca corta (0.76s) vs Xilófono largo (4.08s) (sustituye violin por xilofono)
  maraca_corta: { path: '/audio/maraca_corta.mp3?v=l2', duration: 0.76, gain: 1.0 },
  violin_largo: { path: '/audio/xilofono_largo.mp3?v=2', duration: 4.08, gain: 1.0 }, // compatibilidad
  // L3 Dur: Claves cortas (0.65s) vs Órgano largo (4.08s)
  claves_cortas: { path: '/audio/claves_cortas.mp3?v=l3', duration: 0.65, gain: 1.0 },
  organo_largo: { path: '/audio/organo_largo.mp3?v=l3', duration: 4.08, gain: 0.95 },

  // L1 Int: Arpa suave (3.06s) vs Guitarra eléctrica fuerte (3.06s)
  arpa_suave: { path: '/audio/arpa.mp3?v=2', duration: 3.06, gain: 0.8 },
  arpa: { path: '/audio/arpa.mp3?v=2', duration: 3.06, gain: 0.8 },
  maraca_suave: { path: '/audio/arpa.mp3?v=2', duration: 3.06, gain: 0.8 },
  suave: { path: '/audio/arpa.mp3?v=2', duration: 3.06, gain: 0.8 },
  guitarra_electrica_fuerte: { path: '/audio/guitarra_electrica.mp3?v=4', duration: 3.06, gain: 1.15 },
  guitarra_electrica: { path: '/audio/guitarra_electrica.mp3?v=4', duration: 3.06, gain: 1.15 },
  guitarra_fuerte: { path: '/audio/guitarra_electrica.mp3?v=4', duration: 3.06, gain: 1.15 },
  fuerte: { path: '/audio/guitarra_electrica.mp3?v=4', duration: 3.06, gain: 1.15 },
  // L2 Int: Caja de música suave (3.06s) vs Trompeta fuerte (3.06s)
  caja_musica_suave: { path: '/audio/caja_musica_suave.mp3?v=l2', duration: 3.06, gain: 0.8 },
  trompeta_fuerte: { path: '/audio/trompeta_fuerte.mp3?v=l2', duration: 3.06, gain: 1.15 },
  // L3 Int: Kalimba suave (3.06s) vs Tuba potente fuerte (3.06s) (sustituye bateria por tuba)
  kalimba_suave: { path: '/audio/kalimba_suave.mp3?v=l3', duration: 3.06, gain: 0.8 },
  tuba_fuerte: { path: '/audio/tuba_grave.mp3?v=fuerte', duration: 3.06, gain: 1.35 },
  bateria_fuerte: { path: '/audio/tuba_grave.mp3?v=fuerte', duration: 3.06, gain: 1.35 }, // compatibilidad

  // --- HUMAN VOICES ---
  // L1 Freq: Vocal E Niña vs Vocal E Hombre
  voz_nina_agudo: { path: '/audio/voz_nina_agudo.mp3?v=e2', duration: 2.56, gain: 1.05 },
  voz_hombre_grave: { path: '/audio/voz_hombre_grave.mp3?v=e2', duration: 2.56, gain: 1.10 },
  // L2 Freq: Vocal I Niña vs Vocal U Hombre
  voz_vocal_i_aguda: { path: '/audio/voz_vocal_i_aguda.mp3?v=l2', duration: 2.56, gain: 1.05 },
  voz_vocal_u_grave: { path: '/audio/voz_vocal_u_grave.mp3?v=l2', duration: 2.56, gain: 1.10 },
  // L3 Freq: Vocal A Niña vs Vocal O Hombre
  voz_vocal_a_aguda: { path: '/audio/voz_vocal_a_aguda.mp3?v=l3', duration: 2.56, gain: 1.05 },
  voz_vocal_o_grave: { path: '/audio/voz_vocal_o_grave.mp3?v=l3', duration: 2.56, gain: 1.10 },

  // L1 Dur: Hola corta (1.26s) vs Hoolaaaaa larga (3.55s)
  voz_corta_hola: { path: '/audio/voz_corta_hola.mp3?v=h2', duration: 1.26, gain: 1.05 },
  voz_larga_hola: { path: '/audio/voz_larga_hola.mp3?v=h2', duration: 3.55, gain: 1.05 },
  // L2 Dur: Sol corta (0.92s) vs Sooooolllll larga (3.55s)
  voz_corta_sol: { path: '/audio/voz_corta_sol2.mp3?v=l2', duration: 0.92, gain: 1.05 },
  voz_corta_sol2: { path: '/audio/voz_corta_sol2.mp3?v=l2', duration: 0.92, gain: 1.05 },
  voz_larga_sol: { path: '/audio/voz_larga_sol.mp3?v=l2', duration: 3.55, gain: 1.05 },
  // L3 Dur: Paz corta (0.92s) vs Paaaazzzzz larga (3.55s)
  voz_corta_paz: { path: '/audio/voz_corta_paz.mp3?v=l3', duration: 0.92, gain: 1.05 },
  voz_larga_paz: { path: '/audio/voz_larga_paz.mp3?v=l3', duration: 3.55, gain: 1.05 },

  // L1 Int: Susurro secreto vs Fuerte SECRETO
  voz_susurro_suave: { path: '/audio/voz_susurro_suave.mp3?v=s2', duration: 2.27, gain: 0.75 },
  voz_susurro_secreto: { path: '/audio/voz_susurro_secreto.mp3?v=s2', duration: 2.27, gain: 0.75 },
  voz_fuerte_aqui: { path: '/audio/voz_fuerte_aqui.mp3?v=s2', duration: 2.27, gain: 1.20 },
  voz_fuerte_secreto: { path: '/audio/voz_fuerte_secreto.mp3?v=s2', duration: 2.27, gain: 1.20 },
  // L2 Int: Susurro silencio vs Fuerte SILENCIO
  voz_susurro_silencio: { path: '/audio/voz_susurro_silencio.mp3?v=l2', duration: 2.27, gain: 0.75 },
  voz_fuerte_silencio: { path: '/audio/voz_fuerte_silencio.mp3?v=l2', duration: 2.27, gain: 1.20 },
  // L3 Int: Susurro aquí vs Fuerte AQUÍ
  voz_susurro_aqui2: { path: '/audio/voz_susurro_aqui.mp3?v=l3', duration: 2.27, gain: 0.75 },
  voz_fuerte_aqui2: { path: '/audio/voz_fuerte_aqui2.mp3?v=l3', duration: 2.27, gain: 1.20 },

  // Misión 4: Prosodia y Entonación (Exclusivo de Voz Humana)
  // L1: "¿Vamos a jugar?" vs "¡Vamos a jugar!"
  voz_pregunta_si: { path: '/audio/voz_pregunta_frase.mp3?v=phrase2', duration: 2.27, gain: 1.05 },
  voz_pregunta_que: { path: '/audio/voz_pregunta_frase.mp3?v=phrase2', duration: 2.27, gain: 1.05 },
  voz_pregunta_frase: { path: '/audio/voz_pregunta_frase.mp3?v=phrase2', duration: 2.27, gain: 1.05 },
  voz_pregunta_jugar: { path: '/audio/voz_pregunta_frase.mp3?v=phrase2', duration: 2.27, gain: 1.05 },
  pregunta: { path: '/audio/voz_pregunta_frase.mp3?v=phrase2', duration: 2.27, gain: 1.05 },
  voz_exclamacion_si: { path: '/audio/voz_exclamacion_frase.mp3?v=phrase2', duration: 2.27, gain: 1.10 },
  voz_exclamacion_que: { path: '/audio/voz_exclamacion_frase.mp3?v=phrase2', duration: 2.27, gain: 1.10 },
  voz_exclamacion_frase: { path: '/audio/voz_exclamacion_frase.mp3?v=phrase2', duration: 2.27, gain: 1.10 },
  voz_exclamacion_jugar: { path: '/audio/voz_exclamacion_frase.mp3?v=phrase2', duration: 2.27, gain: 1.10 },
  exclamacion: { path: '/audio/voz_exclamacion_frase.mp3?v=phrase2', duration: 2.27, gain: 1.10 },
  // L2: "¿Es una sorpresa?" vs "¡Es una sorpresa!"
  voz_pregunta_sorpresa: { path: '/audio/voz_pregunta_sorpresa.mp3?v=l2', duration: 2.27, gain: 1.05 },
  voz_exclamacion_sorpresa: { path: '/audio/voz_exclamacion_sorpresa.mp3?v=l2', duration: 2.27, gain: 1.10 },
  // L3: "¿Llegó el cohete?" vs "¡Llegó el cohete!"
  voz_pregunta_cohete: { path: '/audio/voz_pregunta_cohete.mp3?v=l3', duration: 2.27, gain: 1.05 },
  voz_exclamacion_cohete: { path: '/audio/voz_exclamacion_cohete.mp3?v=l3', duration: 2.27, gain: 1.10 },

  // --- MUSICAL NOTES (Misiones 1 a 3 - Sin prosodia) ---
  // L1 Freq: Do agudo (C6) vs Do grave (C2) - Calibrado suave y sin estridencias para niños de 8 años
  nota_aguda: { path: '/audio/nota_aguda.mp3?v=kid8', duration: 3.06, gain: 0.58 },
  nota_do_agudo: { path: '/audio/nota_aguda.mp3?v=kid8', duration: 3.06, gain: 0.58 },
  nota_grave: { path: '/audio/nota_grave.mp3?v=n1', duration: 3.06, gain: 1.10 },
  nota_do_grave: { path: '/audio/nota_grave.mp3?v=n1', duration: 3.06, gain: 1.10 },
  // L2 Freq: Sol agudo (G5) vs Mi grave (E2) - Calibrado suave y agradable para niños de 8 años
  nota_sol_agudo: { path: '/audio/nota_sol_agudo.mp3?v=kid8', duration: 3.06, gain: 0.60 },
  nota_mi_grave: { path: '/audio/nota_mi_grave.mp3?v=l2', duration: 3.06, gain: 1.10 },
  // L3 Freq: Si agudo (B5) vs La grave (A1) - Calibrado suave y agradable para niños de 8 años
  nota_si_agudo: { path: '/audio/nota_si_agudo.mp3?v=kid8', duration: 3.06, gain: 0.55 },
  nota_la_grave: { path: '/audio/nota_la_grave.mp3?v=l3', duration: 3.06, gain: 1.15 },

  // L1 Dur: Staccato corto (0.81s) vs Tenuto largo (3.55s)
  nota_corta: { path: '/audio/nota_corta.mp3?v=n1', duration: 0.81, gain: 1.0 },
  nota_staccato: { path: '/audio/nota_corta.mp3?v=n1', duration: 0.81, gain: 1.0 },
  nota_larga: { path: '/audio/nota_larga.mp3?v=n1', duration: 3.55, gain: 1.0 },
  nota_tenuto: { path: '/audio/nota_larga.mp3?v=n1', duration: 3.55, gain: 1.0 },
  // L2 Dur: Re Staccato (0.71s) vs Re Tenuto (3.55s)
  nota_re_staccato: { path: '/audio/nota_re_staccato.mp3?v=l2', duration: 0.71, gain: 1.0 },
  nota_re_tenuto: { path: '/audio/nota_re_tenuto.mp3?v=l2', duration: 3.55, gain: 1.0 },
  // L3 Dur: Fa Staccato (0.71s) vs Fa Tenuto (4.08s)
  nota_fa_staccato: { path: '/audio/nota_fa_staccato.mp3?v=l3', duration: 0.71, gain: 1.0 },
  nota_fa_tenuto: { path: '/audio/nota_fa_tenuto.mp3?v=l3', duration: 4.08, gain: 1.0 },

  // L1 Int: Pianissimo suave (25%) vs Fortissimo fuerte (100%)
  nota_suave: { path: '/audio/nota_suave.mp3?v=n1', duration: 3.06, gain: 0.8 },
  nota_pianissimo: { path: '/audio/nota_suave.mp3?v=n1', duration: 3.06, gain: 0.8 },
  nota_fuerte: { path: '/audio/nota_fuerte.mp3?v=n1', duration: 3.06, gain: 1.15 },
  nota_fortissimo: { path: '/audio/nota_fuerte.mp3?v=n1', duration: 3.06, gain: 1.15 },
  // L2 Int: Mi Pianissimo (25%) vs Mi Fortissimo (100%)
  nota_mi_pianissimo: { path: '/audio/nota_mi_pianissimo.mp3?v=l2', duration: 3.06, gain: 0.8 },
  nota_mi_fortissimo: { path: '/audio/nota_mi_fortissimo.mp3?v=l2', duration: 3.06, gain: 1.15 },
  // L3 Int: Sol Pianissimo (25%) vs Sol Fortissimo (100%)
  nota_sol_pianissimo: { path: '/audio/nota_sol_pianissimo.mp3?v=l3', duration: 3.06, gain: 0.8 },
  nota_sol_fortissimo: { path: '/audio/nota_sol_fortissimo.mp3?v=l3', duration: 3.06, gain: 1.15 },
};

export const REAL_ANIMAL_AUDIO_MAP = REAL_AUDIO_MAP;

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private activeSources: { stop: () => void }[] = [];
  private activeAudioElements: HTMLAudioElement[] = [];
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private pendingLoads: Map<string, Promise<AudioBuffer | null>> = new Map();
  private sequenceTimeouts: number[] = [];
  private progressInterval: number | null = null;
  private isPlayingSequence = false;
  private volume = 0.85;

  /**
   * Preload all authentic recorded animal audio files into memory
   */
  public async preloadAllAudio(): Promise<void> {
    const ctx = this.initContext();
    const uniquePaths = Array.from(new Set(Object.values(REAL_ANIMAL_AUDIO_MAP).map((c) => c.path)));

    await Promise.all(
      uniquePaths.map(async (path) => {
        if (this.audioBuffers.has(path)) return;
        try {
          const resp = await fetch(path);
          if (!resp.ok) return;
          const arrayBuf = await resp.arrayBuffer();
          const decoded = await ctx.decodeAudioData(arrayBuf);
          this.audioBuffers.set(path, decoded);
        } catch (err) {
          console.warn(`Could not preload audio from ${path}`, err);
        }
      })
    );
  }

  private async loadAudioBuffer(path: string): Promise<AudioBuffer | null> {
    if (this.audioBuffers.has(path)) return this.audioBuffers.get(path)!;
    if (this.pendingLoads.has(path)) return this.pendingLoads.get(path)!;

    const promise = (async () => {
      try {
        const ctx = this.initContext();
        const resp = await fetch(path);
        if (!resp.ok) return null;
        const arrayBuf = await resp.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        this.audioBuffers.set(path, decoded);
        return decoded;
      } catch {
        return null;
      } finally {
        this.pendingLoads.delete(path);
      }
    })();

    this.pendingLoads.set(path, promise);
    return promise;
  }

  /**
   * Plays the authentic real audio recording of the animal.
   */
  private playRealAnimalSample(item: PatternItem, customGain?: number): number | null {
    const config = REAL_ANIMAL_AUDIO_MAP[item];
    if (!config) return null;

    const ctx = this.initContext();
    const buffer = this.audioBuffers.get(config.path);
    const targetGain = customGain !== undefined ? customGain : config.gain;

    if (buffer) {
      const { gainNode, now } = this.createSoundBus(targetGain);
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Enhance deep chest warmth and low-frequency gravitas for owl
      if (item === 'buho' || item === 'rana_toro' || item === 'leon') {
        const bassBoost = ctx.createBiquadFilter();
        bassBoost.type = 'lowshelf';
        bassBoost.frequency.setValueAtTime(150, now);
        bassBoost.gain.setValueAtTime(4.0, now);

        const softHighCut = ctx.createBiquadFilter();
        softHighCut.type = 'lowpass';
        softHighCut.frequency.setValueAtTime(2200, now);

        source.connect(bassBoost);
        bassBoost.connect(softHighCut);
        softHighCut.connect(gainNode);
      } else if (
        item === 'nota_aguda' ||
        item === 'nota_do_agudo' ||
        item === 'nota_sol_agudo' ||
        item === 'nota_si_agudo'
      ) {
        // Calibración auditiva infantil para niños de 8 años:
        // Filtro cálido suave y atenuación de agudos punzantes para evitar molestias y proteger oídos sensibles
        const warmLowpass = ctx.createBiquadFilter();
        warmLowpass.type = 'lowpass';
        warmLowpass.frequency.setValueAtTime(2400, now);
        warmLowpass.Q.setValueAtTime(0.707, now);

        const gentleHighCut = ctx.createBiquadFilter();
        gentleHighCut.type = 'highshelf';
        gentleHighCut.frequency.setValueAtTime(1100, now);
        gentleHighCut.gain.setValueAtTime(-4.0, now);

        source.connect(gentleHighCut);
        gentleHighCut.connect(warmLowpass);
        warmLowpass.connect(gainNode);
      } else {
        source.connect(gainNode);
      }

      const duration = (buffer.duration && buffer.duration > 0) ? buffer.duration : config.duration;
      source.start(now);
      this.activeSources.push(source);
      this.applySoundFadeOut(gainNode, now, duration);
      return duration;
    }

    // Immediate playback using HTMLAudioElement if WebAudio buffer is still loading
    try {
      const audio = new Audio(config.path);
      audio.volume = Math.max(0, Math.min(1, targetGain * this.volume));
      audio.currentTime = 0;
      audio.play().catch(() => {});
      this.activeAudioElements.push(audio);

      // Trigger background buffer load for subsequent plays
      this.loadAudioBuffer(config.path);

      return config.duration;
    } catch {
      return null;
    }
  }

  /**
   * Initializes 48 kHz or 44.1 kHz Studio AudioContext
   */
  public initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      try {
        this.ctx = new AudioCtxClass({
          sampleRate: 48000,
          latencyHint: 'interactive',
        });
      } catch {
        this.ctx = new AudioCtxClass();
      }

      // Studio Mastering Chain:
      // Highpass (35Hz, eliminates DC & sub-rumble) -> Lowpass (18.5kHz) -> Dynamics Compressor -> Master Gain -> Destination
      const subFilter = this.ctx.createBiquadFilter();
      subFilter.type = 'highpass';
      subFilter.frequency.setValueAtTime(35, this.ctx.currentTime);
      subFilter.Q.setValueAtTime(0.707, this.ctx.currentTime);

      const airFilter = this.ctx.createBiquadFilter();
      airFilter.type = 'lowpass';
      airFilter.frequency.setValueAtTime(18500, this.ctx.currentTime);

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Wire master chain
      subFilter.connect(airFilter);
      airFilter.connect(this.compressor);
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  public getSampleRate(): number {
    return this.ctx ? this.ctx.sampleRate : 44100;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Helper to create a sub-bus connected to the master studio compressor
   */
  private createSoundBus(targetGain = 1.0): { gainNode: GainNode; now: number } {
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(targetGain, now);

    if (this.compressor) {
      gainNode.connect(this.compressor);
    } else if (this.masterGain) {
      gainNode.connect(this.masterGain);
    } else {
      gainNode.connect(ctx.destination);
    }

    return { gainNode, now };
  }

  /**
   * Applies smooth master fade-out on the bus to avoid clicks or abrupt cuts
   */
  private applySoundFadeOut(gainNode: GainNode, now: number, duration: number = SOUND_DURATION_SEC) {
    // Micro fade at the very end of the natural duration (last 50ms) to prevent audio clicks without cutting the sound short
    const fadeWindow = Math.min(0.06, duration * 0.05);
    const fadeStart = now + Math.max(0, duration - fadeWindow);
    try {
      gainNode.gain.setValueAtTime(gainNode.gain.value, fadeStart);
      gainNode.gain.linearRampToValueAtTime(0.0001, now + duration);
    } catch {
      // Ignored
    }
  }

  // =========================================================================
  // HIGH-FIDELITY STUDIO INSTRUMENT MODELS
  // =========================================================================

  /**
   * 1. Xilófono de Concierto (Agudo - Misión 1 - 3.0s)
   * Notas cristalinas y brillantes de madera de palisandro (C6, E6, G6)
   * con golpe seco de mazo de madera y armónicos resonantes de barra afinada.
   */
  private playStudioXylophone(): number {
    const { gainNode, now } = this.createSoundBus(0.9);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    const strikes = [
      { time: now + 0.10, f0: 1046.5 }, // C6
      { time: now + 0.85, f0: 1318.5 }, // E6
      { time: now + 1.65, f0: 1567.9 }, // G6
    ];

    strikes.forEach(({ time, f0 }) => {
      // Mallet wood click transient
      const clickBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.02), ctx.sampleRate);
      const clickData = clickBuf.getChannelData(0);
      for (let i = 0; i < clickData.length; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.003));
      }
      const clickSrc = ctx.createBufferSource();
      clickSrc.buffer = clickBuf;
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(3200, time);
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.35, time);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);

      clickSrc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(gainNode);
      clickSrc.start(time);

      // Rosewood bar modes (1.0, 3.0, 5.9)
      const modes = [
        { mult: 1.0, gain: 0.75, decay: 1.8 },
        { mult: 3.0, gain: 0.35, decay: 0.8 },
        { mult: 5.9, gain: 0.15, decay: 0.35 },
      ];

      modes.forEach(({ mult, gain: mGain, decay }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = mult === 1.0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f0 * mult, time);

        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(mGain, time + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, time + decay);

        osc.connect(g);
        g.connect(gainNode);
        osc.start(time);
        osc.stop(now + duration);
        this.activeSources.push(osc);
      });
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 2. Tambor Grave Acústico (Grave - Misión 1 - 3.0s)
   * Golpe de mazo sobre parche de tambor grave de cuero y madera
   * con caída a frecuencia grave (64 Hz) y ataque percusivo nítido.
   */
  private playStudioDrum(): number {
    const { gainNode, now } = this.createSoundBus(1.10);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    const strikes = [now + 0.12, now + 1.45];

    strikes.forEach((strikeTime) => {
      // 1. High-clarity stick / leather impact transient (1.8 kHz)
      const snapBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
      const snapData = snapBuf.getChannelData(0);
      for (let i = 0; i < snapData.length; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
      }
      const snapSrc = ctx.createBufferSource();
      snapSrc.buffer = snapBuf;
      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(1850, strikeTime);
      snapFilter.Q.setValueAtTime(1.8, strikeTime);
      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.45, strikeTime);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + 0.05);

      snapSrc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(gainNode);
      snapSrc.start(strikeTime);

      // 2. Drum membrane fundamental pitch drop: 125 Hz down to 64 Hz
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(125, strikeTime);
      osc.frequency.exponentialRampToValueAtTime(64, strikeTime + 0.15);

      oscGain.gain.setValueAtTime(0.0001, strikeTime);
      oscGain.gain.linearRampToValueAtTime(0.95, strikeTime + 0.006);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + 1.35);

      // 3. Sub-harmonic low warmth at 60 Hz
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(62, strikeTime);
      subGain.gain.setValueAtTime(0.0001, strikeTime);
      subGain.gain.linearRampToValueAtTime(0.55, strikeTime + 0.012);
      subGain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + 1.25);

      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start(strikeTime);
      osc.stop(strikeTime + 1.45);
      this.activeSources.push(osc);

      subOsc.connect(subGain);
      subGain.connect(gainNode);
      subOsc.start(strikeTime);
      subOsc.stop(strikeTime + 1.45);
      this.activeSources.push(subOsc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 3. Guitarra Acústica Corta (Corto - Misión 2 - EXACTAMENTE 2.0s)
   * Rasgueo cálido de cuerdas de guitarra acústica (Em9)
   * con corte natural exactamente a los 2 segundos de duración.
   */
  private playStudioGuitarShort(): number {
    const { gainNode, now } = this.createSoundBus(0.9);
    const ctx = this.initContext();
    const duration = 2.0; // EXACT 2.0s as requested

    const strings = [82.41, 123.47, 164.81, 196.0, 246.94, 329.63];

    strings.forEach((f0, idx) => {
      const stringTime = now + idx * 0.012; // Realistic downstroke roll

      [1, 2, 3].forEach((h) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = h === 1 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(f0 * h, stringTime);

        const bodyFilter = ctx.createBiquadFilter();
        bodyFilter.type = 'lowpass';
        bodyFilter.frequency.setValueAtTime(2800, stringTime);
        bodyFilter.frequency.exponentialRampToValueAtTime(600, stringTime + 1.8);

        const hGain = (0.35 / h) * (1 - idx * 0.08);
        g.gain.setValueAtTime(0.0001, stringTime);
        g.gain.linearRampToValueAtTime(hGain, stringTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, stringTime + 1.95);

        osc.connect(bodyFilter);
        bodyFilter.connect(g);
        g.connect(gainNode);

        osc.start(stringTime);
        osc.stop(now + duration);
        this.activeSources.push(osc);
      });
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 4. Xilófono Largo Melodioso (Largo - Misión 2 - EXACTAMENTE 4.0s)
   * Melodía continuada y brillante en barras de xilófono de palisandro
   * que se extiende y resuena a lo largo de 4 segundos completos.
   */
  private playStudioXylophoneLong(): number {
    const { gainNode, now } = this.createSoundBus(0.92);
    const ctx = this.initContext();
    const duration = 4.0; // EXACT 4.0s as requested

    const notes = [
      { time: now + 0.10, f0: 1046.5 }, // C6
      { time: now + 0.60, f0: 1318.5 }, // E6
      { time: now + 1.15, f0: 1567.9 }, // G6
      { time: now + 1.70, f0: 1760.0 }, // A6
      { time: now + 2.25, f0: 2093.0 }, // C7
      { time: now + 2.80, f0: 1567.9 }, // G6
      { time: now + 3.25, f0: 1318.5 }, // E6
      { time: now + 3.55, f0: 1046.5 }, // C6
    ];

    notes.forEach(({ time, f0 }) => {
      // Wood mallet impact
      const clickBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.02), ctx.sampleRate);
      const clickData = clickBuf.getChannelData(0);
      for (let i = 0; i < clickData.length; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.003));
      }
      const clickSrc = ctx.createBufferSource();
      clickSrc.buffer = clickBuf;
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(3200, time);
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.3, time);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);

      clickSrc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(gainNode);
      clickSrc.start(time);

      // Rosewood bar modes
      const modes = [
        { mult: 1.0, gain: 0.72, decay: 1.6 },
        { mult: 3.0, gain: 0.28, decay: 0.7 },
        { mult: 5.9, gain: 0.12, decay: 0.3 },
      ];

      modes.forEach(({ mult, gain: mGain, decay }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = mult === 1.0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f0 * mult, time);

        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(mGain, time + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, time + decay);

        osc.connect(g);
        g.connect(gainNode);
        osc.start(time);
        osc.stop(now + duration);
        this.activeSources.push(osc);
      });
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 5. Arpa Clásica Delicada (Suave - Misión 3 - 3.0s)
   * Punteo dulce y suave de arpa celestial (C4, E4, G4, B4, D5)
   * a volumen delicado y suave (20%) durante 3 segundos.
   */
  private playStudioHarp(): number {
    const { gainNode, now } = this.createSoundBus(0.22); // Delicately soft volume
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    const notes = [
      { time: now + 0.05, f0: 261.63 },
      { time: now + 0.20, f0: 329.63 },
      { time: now + 0.35, f0: 392.00 },
      { time: now + 0.50, f0: 493.88 },
      { time: now + 0.65, f0: 587.33 },
    ];

    notes.forEach(({ time, f0 }) => {
      // Pure crystalline harp harmonics
      [1, 2, 3].forEach((h) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f0 * h, time);

        const hGain = (0.55 / Math.pow(h, 1.2));
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(hGain, time + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, time + (2.8 - (h - 1) * 0.4));

        osc.connect(g);
        g.connect(gainNode);
        osc.start(time);
        osc.stop(now + duration);
        this.activeSources.push(osc);
      });
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 6. Guitarra Eléctrica Clara y Fuerte (Fuerte - Misión 3 - 3.0s)
   * Power chord electrizante de rock con distorsión overdrive armónica,
   * ataque nítido con presencia (3 kHz) a volumen fuerte y claro (100%) durante 3 segundos.
   */
  private playStudioElectricGuitar(): number {
    const { gainNode, now } = this.createSoundBus(0.98); // Loud, clear, powerful volume
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    // Rock power chord: E2 (82.4), B2 (123.5), E3 (164.8), G#3 (207.6), B3 (246.9)
    const powerChord = [82.41, 123.47, 164.81, 207.65, 246.94];

    // Create overdrive waveshaper curve
    const waveShaper = ctx.createWaveShaper();
    const curveSamples = 1024;
    const curve = new Float32Array(curveSamples);
    const deg = Math.PI / 180;
    const k = 35; // Open tube distortion factor
    for (let i = 0; i < curveSamples; i++) {
      const x = (i * 2) / curveSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    waveShaper.curve = curve;
    waveShaper.oversample = '4x';

    // High presence filter for maximum clarity
    const cabFilter = ctx.createBiquadFilter();
    cabFilter.type = 'peaking';
    cabFilter.frequency.setValueAtTime(3000, now);
    cabFilter.gain.setValueAtTime(4.0, now);
    cabFilter.Q.setValueAtTime(1.5, now);

    waveShaper.connect(cabFilter);
    cabFilter.connect(gainNode);

    powerChord.forEach((f0, idx) => {
      const stringTime = now + idx * 0.007;

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f0, stringTime);

      // Subtle vibrato
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.frequency.setValueAtTime(5.4, stringTime);
      vibGain.gain.setValueAtTime(1.6, stringTime);
      vib.connect(osc.frequency);
      vib.start(stringTime);
      vib.stop(now + duration);

      g.gain.setValueAtTime(0.0001, stringTime);
      g.gain.linearRampToValueAtTime(0.45, stringTime + 0.008);
      g.gain.setValueAtTime(0.40, stringTime + 1.5);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(g);
      g.connect(waveShaper);

      osc.start(stringTime);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  // =========================================================================
  // HIGH-FIDELITY STUDIO MUSICAL NOTE MODELS
  // =========================================================================

  /**
   * 1. Nota Agudo (Calibrado a 600 Hz - 3.0s)
   * Calibrado suave, dulce y cálido para niños a 600 Hertz exactos
   */
  private playStudioNoteHigh(): number {
    const { gainNode, now } = this.createSoundBus(0.55);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;
    const f0 = 600.0;

    // Filtro cálido para eliminar armónicos punzantes
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(0.707, now);
    filter.connect(gainNode);

    // Fundamental sinusoidal pura y dulce + muy sutil segundo armónico suave
    [1, 2].forEach((n) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0 * n, now + 0.08);

      const amp = n === 1 ? 0.65 : 0.12;
      g.gain.setValueAtTime(0.0001, now + 0.08);
      g.gain.linearRampToValueAtTime(amp, now + 0.13); // Ataque suave, no golpe seco
      g.gain.exponentialRampToValueAtTime(0.0001, now + (duration - 0.25));

      osc.connect(g);
      g.connect(filter);
      osc.start(now + 0.08);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 1b. Nota Sol Agudo (Calibrado a 600 Hz - 3.0s)
   */
  private playStudioNoteSolHigh(): number {
    const { gainNode, now } = this.createSoundBus(0.58);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;
    const f0 = 600.0;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.connect(gainNode);

    [1, 2].forEach((n) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0 * n, now + 0.08);

      const amp = n === 1 ? 0.68 : 0.14;
      g.gain.setValueAtTime(0.0001, now + 0.08);
      g.gain.linearRampToValueAtTime(amp, now + 0.13);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (duration - 0.25));

      osc.connect(g);
      g.connect(filter);
      osc.start(now + 0.08);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 1c. Nota Si Agudo (Calibrado a 600 Hz - 3.0s)
   */
  private playStudioNoteSiHigh(): number {
    const { gainNode, now } = this.createSoundBus(0.52);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;
    const f0 = 600.0;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.connect(gainNode);

    [1, 2].forEach((n) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0 * n, now + 0.08);

      const amp = n === 1 ? 0.60 : 0.10;
      g.gain.setValueAtTime(0.0001, now + 0.08);
      g.gain.linearRampToValueAtTime(amp, now + 0.13);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (duration - 0.25));

      osc.connect(g);
      g.connect(filter);
      osc.start(now + 0.08);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 2. Nota Do Grave (C2 - 65.4 Hz - 3.0s)
   */
  private playStudioNoteLow(): number {
    const { gainNode, now } = this.createSoundBus(1.10);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    [65.41, 130.81, 196.0].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now + 0.08);

      g.gain.setValueAtTime(0.0001, now + 0.08);
      g.gain.linearRampToValueAtTime(0.7 / (idx + 1), now + 0.095);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (duration - 0.25));

      osc.connect(g);
      g.connect(gainNode);
      osc.start(now + 0.08);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 3. Nota Staccato Corta (0.75s)
   */
  private playStudioNoteShort(): number {
    const { gainNode, now } = this.createSoundBus(0.92);
    const ctx = this.initContext();
    const duration = 0.75;
    const f0 = 523.25;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f0, now + 0.05);

    g.gain.setValueAtTime(0.0001, now + 0.05);
    g.gain.linearRampToValueAtTime(0.9, now + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(g);
    g.connect(gainNode);
    osc.start(now + 0.05);
    osc.stop(now + duration);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 4. Nota Tenuto Larga (3.5s)
   */
  private playStudioNoteLong(): number {
    const { gainNode, now } = this.createSoundBus(0.92);
    const ctx = this.initContext();
    const duration = 3.5;
    const f0 = 523.25;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, now + 0.08);

    g.gain.setValueAtTime(0.0001, now + 0.08);
    g.gain.linearRampToValueAtTime(0.85, now + 0.12);
    g.gain.setValueAtTime(0.75, now + 2.5);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

    osc.connect(g);
    g.connect(gainNode);
    osc.start(now + 0.08);
    osc.stop(now + duration);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 5. Nota Pianissimo Suave (20% volumen - 3.0s)
   */
  private playStudioNoteSoft(): number {
    const { gainNode, now } = this.createSoundBus(0.24);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;
    const f0 = 440.0;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, now + 0.08);

    g.gain.setValueAtTime(0.0001, now + 0.08);
    g.gain.linearRampToValueAtTime(0.65, now + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (duration - 0.3));

    osc.connect(g);
    g.connect(gainNode);
    osc.start(now + 0.08);
    osc.stop(now + duration);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 6. Nota Fortissimo Fuerte (100% volumen - 3.0s)
   */
  private playStudioNoteLoud(): number {
    const { gainNode, now } = this.createSoundBus(1.10);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;
    const chord = [220.0, 329.63, 440.0, 554.37];

    chord.forEach((f) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + 0.08);

      g.gain.setValueAtTime(0.0001, now + 0.08);
      g.gain.linearRampToValueAtTime(0.6, now + 0.095);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (duration - 0.2));

      osc.connect(g);
      g.connect(gainNode);
      osc.start(now + 0.08);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 7. Pregunta Musical Ascendente (2.5s)
   */
  private playStudioNoteQuestion(): number {
    const { gainNode, now } = this.createSoundBus(0.92);
    const ctx = this.initContext();
    const duration = 2.5;
    const melody = [
      { t: 0.10, f: 261.63 },
      { t: 0.55, f: 329.63 },
      { t: 1.00, f: 392.00 },
      { t: 1.45, f: 493.88 },
    ];

    melody.forEach(({ t, f }, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);

      g.gain.setValueAtTime(0.0001, now + t);
      g.gain.linearRampToValueAtTime(0.7 + idx * 0.05, now + t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.85);

      osc.connect(g);
      g.connect(gainNode);
      osc.start(now + t);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 8. Exclamación Musical Afirmativa (2.5s)
   */
  private playStudioNoteExclamation(): number {
    const { gainNode, now } = this.createSoundBus(1.05);
    const ctx = this.initContext();
    const duration = 2.5;

    const notes = [
      { t: 0.10, f: 392.00 },
      { t: 0.50, f: 329.63 },
    ];
    notes.forEach(({ t, f }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);
      g.gain.setValueAtTime(0.0001, now + t);
      g.gain.linearRampToValueAtTime(0.65, now + t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.6);
      osc.connect(g);
      g.connect(gainNode);
      osc.start(now + t);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    // Concluding C Major chord
    [261.63, 329.63, 392.00, 523.25].forEach((f) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + 0.95);
      g.gain.setValueAtTime(0.0001, now + 0.95);
      g.gain.linearRampToValueAtTime(0.55, now + 0.97);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(g);
      g.connect(gainNode);
      osc.start(now + 0.95);
      osc.stop(now + duration);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  // =========================================================================
  // HUMAN VOICE FORMANT SYNTHESIS (FALLBACKS)
  // =========================================================================
  // HIGH-FIDELITY STUDIO HUMAN VOICE MODELS (VOCAL "E", "Hola", "Hoolaaaaa", "secreto", "¿Qué?", "¡Qué!")
  // DICHAS EXACTAMENTE UNA SOLA VEZ (SIN REPETICIONES)
  // =========================================================================

  /**
   * Misión 1 (Agudo): Vocal "E" con voz de Niña aguda y alegre (~380 Hz) - Dicha 1 sola vez
   */
  private playStudioChildVoice(): number {
    const { gainNode, now } = this.createSoundBus(0.95);
    const ctx = this.initContext();
    const duration = 2.5;
    const startTime = 0.15;

    // Vocal "E" (F1: 490Hz, F2: 2150Hz en tracto vocal infantil/agudo)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(370, now + startTime);
    osc.frequency.exponentialRampToValueAtTime(390, now + startTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(360, now + startTime + 0.9);

    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(490, now + startTime);
    f1.Q.setValueAtTime(3.5, now + startTime);

    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(2150, now + startTime);
    f2.Q.setValueAtTime(4.2, now + startTime);

    oscGain.gain.setValueAtTime(0.0001, now + startTime);
    oscGain.gain.linearRampToValueAtTime(0.75, now + startTime + 0.08);
    oscGain.gain.setValueAtTime(0.70, now + startTime + 0.8);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + startTime + 1.2);

    osc.connect(f1);
    osc.connect(f2);
    f1.connect(oscGain);
    f2.connect(oscGain);
    oscGain.connect(gainNode);

    osc.start(now + startTime);
    osc.stop(now + startTime + 1.25);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * Misión 1 (Grave): Vocal "E" con voz de Hombre grave y profunda (~105 Hz) - Dicha 1 sola vez
   */
  private playStudioManVoice(): number {
    const { gainNode, now } = this.createSoundBus(1.05);
    const ctx = this.initContext();
    const duration = 2.5;
    const startTime = 0.15;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(105, now + startTime);
    osc.frequency.linearRampToValueAtTime(100, now + startTime + 1.0);

    // Formantes de resonancia torácica y faríngea para vocal "E" masculina
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(440, now + startTime);
    f1.Q.setValueAtTime(3.8, now + startTime);

    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(1850, now + startTime);
    f2.Q.setValueAtTime(4.0, now + startTime);

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(105, now + startTime);
    subGain.gain.setValueAtTime(0.0001, now + startTime);
    subGain.gain.linearRampToValueAtTime(0.55, now + startTime + 0.15);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + startTime + 1.3);

    oscGain.gain.setValueAtTime(0.0001, now + startTime);
    oscGain.gain.linearRampToValueAtTime(0.85, now + startTime + 0.12);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + startTime + 1.3);

    osc.connect(f1);
    osc.connect(f2);
    f1.connect(oscGain);
    f2.connect(oscGain);
    oscGain.connect(gainNode);

    sub.connect(subGain);
    subGain.connect(gainNode);

    osc.start(now + startTime);
    osc.stop(now + startTime + 1.35);
    sub.start(now + startTime);
    sub.stop(now + startTime + 1.35);
    this.activeSources.push(osc);
    this.activeSources.push(sub);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * Misión 2 (Corta): Palabra "Hola" (rápida, seca, clara) - Dicha 1 sola vez (~1.2s)
   */
  private playStudioShortWord(): number {
    const { gainNode, now } = this.createSoundBus(0.95);
    const ctx = this.initContext();
    const duration = 1.2;
    const st = 0.12;

    // 1. Suave aspiración inicial de "H"
    const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
    const hSrc = ctx.createBufferSource();
    hSrc.buffer = noiseBuf;
    const hFilt = ctx.createBiquadFilter();
    hFilt.type = 'bandpass';
    hFilt.frequency.setValueAtTime(1200, now + st);
    const hGain = ctx.createGain();
    hGain.gain.setValueAtTime(0.3, now + st);
    hSrc.connect(hFilt);
    hFilt.connect(hGain);
    hGain.connect(gainNode);
    hSrc.start(now + st);

    // 2. Núcleo vocálico "O - LA" (dicho 1 sola vez de forma rápida y corta)
    const osc = ctx.createOscillator();
    const oGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(230, now + st + 0.05);
    osc.frequency.linearRampToValueAtTime(210, now + st + 0.25);
    osc.frequency.linearRampToValueAtTime(190, now + st + 0.55);

    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(650, now + st + 0.05);
    f1.frequency.linearRampToValueAtTime(800, now + st + 0.35);
    f1.Q.setValueAtTime(2.8, now + st);

    oGain.gain.setValueAtTime(0.0001, now + st + 0.05);
    oGain.gain.linearRampToValueAtTime(0.85, now + st + 0.12);
    oGain.gain.setValueAtTime(0.75, now + st + 0.40);
    oGain.gain.exponentialRampToValueAtTime(0.0001, now + st + 0.70);

    osc.connect(f1);
    f1.connect(oGain);
    oGain.connect(gainNode);

    osc.start(now + st + 0.05);
    osc.stop(now + st + 0.75);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * Misión 2 (Larga): Palabra "Hoolaaaaa" sostenida en el tiempo - Dicha 1 sola vez (~3.5s)
   */
  private playStudioLongWord(): number {
    const { gainNode, now } = this.createSoundBus(0.95);
    const ctx = this.initContext();
    const duration = 3.5;
    const st = 0.12;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now + st);
    osc.frequency.linearRampToValueAtTime(230, now + st + 1.2);
    osc.frequency.linearRampToValueAtTime(210, now + st + 2.8);

    // Formante prolongado y abierto para "Hoolaaaaa"
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(700, now + st);
    f1.frequency.linearRampToValueAtTime(850, now + st + 0.8);
    f1.Q.setValueAtTime(2.5, now + st);

    oscGain.gain.setValueAtTime(0.0001, now + st);
    oscGain.gain.linearRampToValueAtTime(0.85, now + st + 0.25);
    oscGain.gain.setValueAtTime(0.75, now + st + 2.5);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + st + 3.1);

    osc.connect(f1);
    f1.connect(oscGain);
    oscGain.connect(gainNode);

    osc.start(now + st);
    osc.stop(now + st + 3.15);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * Misión 3 (Suave): Susurro suave "secreto" (~25% volumen, aireado) - Dicho 1 sola vez (~2.2s)
   */
  private playStudioWhisper(): number {
    const { gainNode, now } = this.createSoundBus(0.30);
    const ctx = this.initContext();
    const duration = 2.2;
    const st = 0.15;

    // Susurro continuo modelado como fricativa y formantes de aire
    const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.5), ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);

    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2400, now + st);
    bandpass.Q.setValueAtTime(2.2, now + st);

    const filterGain = ctx.createGain();
    filterGain.gain.setValueAtTime(0.0001, now + st);
    filterGain.gain.linearRampToValueAtTime(0.40, now + st + 0.25);
    filterGain.gain.setValueAtTime(0.35, now + st + 0.90);
    filterGain.gain.exponentialRampToValueAtTime(0.0001, now + st + 1.45);

    src.connect(bandpass);
    bandpass.connect(filterGain);
    filterGain.connect(gainNode);

    src.start(now + st);
    src.stop(now + st + 1.5);
    this.activeSources.push(src);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * Misión 3 (Fuerte): "¡SECRETO!" con voz fuerte, potente y llena de energía - Dicho 1 sola vez (~2.2s)
   */
  private playStudioLoudVoice(): number {
    const { gainNode, now } = this.createSoundBus(1.15);
    const ctx = this.initContext();
    const duration = 2.2;
    const st = 0.15;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now + st);
    osc.frequency.linearRampToValueAtTime(295, now + st + 0.2);
    osc.frequency.exponentialRampToValueAtTime(235, now + st + 0.9);

    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(950, now + st);
    f1.Q.setValueAtTime(2.5, now + st);

    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(2450, now + st);
    f2.Q.setValueAtTime(3.2, now + st);

    oscGain.gain.setValueAtTime(0.0001, now + st);
    oscGain.gain.linearRampToValueAtTime(1.0, now + st + 0.08); // Volumen fuerte 100%
    oscGain.gain.setValueAtTime(0.85, now + st + 0.65);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + st + 1.15);

    osc.connect(f1);
    osc.connect(f2);
    f1.connect(oscGain);
    f2.connect(oscGain);
    oscGain.connect(gainNode);

    osc.start(now + st);
    osc.stop(now + st + 1.2);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * Misión 4 (Pregunta): "¿Qué?" con entonación ascendente interrogativa - Dicha 1 sola vez (~2.0s)
   */
  private playStudioQuestionVoice(): number {
    const { gainNode, now } = this.createSoundBus(0.95);
    const ctx = this.initContext();
    const duration = 2.0;
    const st = 0.15;

    // Ataque oclusivo velar "K" + subida melódica de "¿Qué?"
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(215, now + st);
    osc.frequency.exponentialRampToValueAtTime(360, now + st + 0.65); // Sube con tono de pregunta

    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(1450, now + st);
    f1.Q.setValueAtTime(2.8, now + st);

    oscGain.gain.setValueAtTime(0.0001, now + st);
    oscGain.gain.linearRampToValueAtTime(0.85, now + st + 0.08);
    oscGain.gain.setValueAtTime(0.80, now + st + 0.45);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + st + 0.85);

    osc.connect(f1);
    f1.connect(oscGain);
    oscGain.connect(gainNode);

    osc.start(now + st);
    osc.stop(now + st + 0.9);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * Misión 4 (Exclamación): "¡Qué!" con entonación firme, afirmativa y enérgica - Dicha 1 sola vez (~2.0s)
   */
  private playStudioExclamationVoice(): number {
    const { gainNode, now } = this.createSoundBus(1.05);
    const ctx = this.initContext();
    const duration = 2.0;
    const st = 0.15;

    // Golpe afirmativo descendente "¡Qué!"
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, now + st);
    osc.frequency.exponentialRampToValueAtTime(210, now + st + 0.50); // Cae firme y enérgico

    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(1650, now + st);
    f1.Q.setValueAtTime(2.5, now + st);

    oscGain.gain.setValueAtTime(0.0001, now + st);
    oscGain.gain.linearRampToValueAtTime(0.95, now + st + 0.05);
    oscGain.gain.setValueAtTime(0.80, now + st + 0.35);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + st + 0.65);

    osc.connect(f1);
    f1.connect(oscGain);
    oscGain.connect(gainNode);

    osc.start(now + st);
    osc.stop(now + st + 0.7);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  // Backward compatibility alias methods
  private playStudioPiano(): number {
    return this.playStudioXylophoneLong();
  }
  private playStudioPianoLong(): number {
    return this.playStudioXylophoneLong();
  }
  private playStudioFluteXylophone(): number {
    return this.playStudioXylophone();
  }
  private playStudioWoodenDrum(): number {
    return this.playStudioDrum();
  }
  private playStudioTriangle(): number {
    return this.playStudioPianoLong();
  }
  private playStudioMaracas(): number {
    return this.playStudioHarp();
  }
  private playStudioGuitar(): number {
    return this.playStudioElectricGuitar();
  }

  // =========================================================================
  // AUTHENTIC ANIMAL VOCALIZATIONS (3.0 SECONDS EACH)
  // =========================================================================

  /**
   * 7. Pájaro Canario (Canario - Agudo - 3.0s)
   * Canto cristalino de canario con alta frecuencia (3.5 kHz - 5.0 kHz),
   * trinos rápidos y trinos descendentes alegres a lo largo de 3 segundos.
   */
  private playStudioCanary(): number {
    const { gainNode, now } = this.createSoundBus(0.85);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    // 3 canary warble phrases distributed over 3 seconds
    const phrases = [
      { start: 0.05, freqs: [3600, 4400, 3900, 4800], dur: 0.8 },
      { start: 1.05, freqs: [4200, 4900, 4500, 5100, 4600], dur: 0.85 },
      { start: 2.05, freqs: [3800, 4300, 4800, 4200], dur: 0.8 },
    ];

    phrases.forEach(({ start, freqs, dur }) => {
      const pStart = now + start;
      const stepDur = dur / freqs.length;

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const t = pStart + idx * stepDur;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        osc.frequency.exponentialRampToValueAtTime(f * 1.12, t + stepDur * 0.4);
        osc.frequency.exponentialRampToValueAtTime(f * 0.96, t + stepDur);

        // Rapid trill LFO (24 Hz)
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        lfo.frequency.setValueAtTime(24, t);
        lfoG.gain.setValueAtTime(50, t);
        lfo.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + stepDur);

        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.7, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + stepDur);

        osc.connect(g);
        g.connect(gainNode);

        osc.start(t);
        osc.stop(t + stepDur + 0.01);
      });
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 8. Búho Sabio Nocturno (Búho - Grave - 3.0s)
   * Ulular profundo, hueco y sumamente grave de un auténtico Búho ("¡Huuu... hu-huuu!").
   * Frecuencia fundamental muy grave (110 Hz - 145 Hz) con formante de resonancia torácica,
   * sutil modulación aérea y dos frases nocturnas naturales a lo largo de 3.0 segundos
   * con decaimiento orgánico suave (fade-out).
   */
  private playStudioOwl(): number {
    const { gainNode, now } = this.createSoundBus(0.95);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    // Nocturnal deep grave hooting phrases across 3.0 seconds:
    // 1. "Hoooo" (0.12s to 0.82s) - Deep fundamental settling around 118 Hz
    // 2. "Hu-hu" (1.10s to 1.55s) - Short low rhythmic pulses
    // 3. "Hooooo" (1.78s to 2.85s) - Long sustained deep thoracic resonant hoot
    const hoots = [
      { start: 0.12, dur: 0.70, baseFreq: 124, peakFreq: 142, endFreq: 114, attack: 0.15 },
      { start: 1.10, dur: 0.20, baseFreq: 118, peakFreq: 130, endFreq: 112, attack: 0.06 },
      { start: 1.35, dur: 0.20, baseFreq: 116, peakFreq: 128, endFreq: 110, attack: 0.06 },
      { start: 1.78, dur: 1.05, baseFreq: 122, peakFreq: 144, endFreq: 108, attack: 0.20 },
    ];

    hoots.forEach(({ start, dur, baseFreq, peakFreq, endFreq, attack }) => {
      const hTime = now + start;

      // Primary hollow acoustic oscillator (sine + warm low body)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';

      // Pitch envelope: gentle rise then warm low settling in deep bass register
      osc.frequency.setValueAtTime(baseFreq, hTime);
      osc.frequency.exponentialRampToValueAtTime(peakFreq, hTime + attack);
      osc.frequency.linearRampToValueAtTime(endFreq, hTime + dur);

      // Subtle breath vibrato (4.8 Hz)
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.frequency.setValueAtTime(4.8, hTime);
      vibGain.gain.setValueAtTime(2.8, hTime);
      vib.connect(osc.frequency);
      vib.start(hTime);
      vib.stop(hTime + dur);

      // Deep thoracic resonance cavity filter (bandpass at 210 Hz, Q 2.8)
      const cavityFilter = ctx.createBiquadFilter();
      cavityFilter.type = 'bandpass';
      cavityFilter.frequency.setValueAtTime(210, hTime);
      cavityFilter.Q.setValueAtTime(2.8, hTime);

      // Sub-harmonic warm body overtone
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(baseFreq * 0.75, hTime);
      subOsc.frequency.exponentialRampToValueAtTime(peakFreq * 0.75, hTime + attack);
      subOsc.frequency.linearRampToValueAtTime(endFreq * 0.75, hTime + dur);

      subGain.gain.setValueAtTime(0.0001, hTime);
      subGain.gain.linearRampToValueAtTime(0.25, hTime + attack);
      subGain.gain.exponentialRampToValueAtTime(0.0001, hTime + dur);
      subOsc.connect(subGain);
      subGain.connect(gainNode);
      subOsc.start(hTime);
      subOsc.stop(hTime + dur + 0.05);

      // Hollow breath overtone (gentle octave harmonic)
      const osc2 = ctx.createOscillator();
      const osc2Gain = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 2, hTime);
      osc2.frequency.exponentialRampToValueAtTime(peakFreq * 2, hTime + attack);
      osc2.frequency.linearRampToValueAtTime(endFreq * 2, hTime + dur);

      osc2Gain.gain.setValueAtTime(0.0001, hTime);
      osc2Gain.gain.linearRampToValueAtTime(0.10, hTime + attack);
      osc2Gain.gain.exponentialRampToValueAtTime(0.0001, hTime + dur);
      osc2.connect(cavityFilter);
      osc2.start(hTime);
      osc2.stop(hTime + dur + 0.05);

      // Soft swelling amplitude envelope
      oscGain.gain.setValueAtTime(0.0001, hTime);
      oscGain.gain.linearRampToValueAtTime(0.9, hTime + attack);
      oscGain.gain.setValueAtTime(0.85, hTime + dur * 0.65);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, hTime + dur);

      osc.connect(cavityFilter);
      cavityFilter.connect(oscGain);
      oscGain.connect(gainNode);

      osc.start(hTime);
      osc.stop(hTime + dur + 0.05);
      this.activeSources.push(osc);
      this.activeSources.push(subOsc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 9. Perro Pastor Alemán (Perro - Corto - 0.75s)
   * Ladridos secos, rápidos y definidos ("¡Guau! ¡Guau!") modelados según la grabación real,
   * con una duración corta de 0.75 segundos que crea un contraste auditivo perfecto e inconfundible
   * frente a los sonidos largos (3.0s) de la Misión 2.
   */
  private playStudioDog(): number {
    const { gainNode, now } = this.createSoundBus(0.9);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SHORT_SEC; // 0.75s

    // 2 crisp natural barks matching Audio 1 at 0.04s and 0.32s
    const barks = [
      { start: 0.04, dur: 0.24, pitch: 320, peak: 440 },
      { start: 0.32, dur: 0.28, pitch: 350, peak: 480 },
    ];

    barks.forEach(({ start, dur, pitch, peak }) => {
      const bTime = now + start;

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(pitch, bTime);
      osc.frequency.exponentialRampToValueAtTime(peak, bTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.65, bTime + dur);

      // Canine muzzle formant filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, bTime);
      filter.Q.setValueAtTime(2.6, bTime);

      // Canine throat snap noise
      const noiseDur = 0.06;
      const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * noiseDur), ctx.sampleRate);
      const nData = noiseBuf.getChannelData(0);
      for (let i = 0; i < nData.length; i++) {
        nData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }
      const nSrc = ctx.createBufferSource();
      nSrc.buffer = noiseBuf;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.4, bTime);
      nGain.gain.exponentialRampToValueAtTime(0.0001, bTime + noiseDur);
      nSrc.connect(filter);
      filter.connect(nGain);
      nGain.connect(gainNode);
      nSrc.start(bTime);

      g.gain.setValueAtTime(0.0001, bTime);
      g.gain.linearRampToValueAtTime(0.85, bTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, bTime + dur);

      osc.connect(filter);
      filter.connect(g);
      g.connect(gainNode);

      osc.start(bTime);
      osc.stop(bTime + dur + 0.02);
      this.activeSources.push(osc);
    });

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 10. Vaca Lechera (Vaca - Largo - 3.0s)
   * Mugido continuo y prolongado ("Muuuu-uuu") que se extiende durante 3.0 segundos
   * con modulación natural y vibrato cálido.
   */
  private playStudioCow(): number {
    const { gainNode, now } = this.createSoundBus(0.85);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(118, now);
    osc.frequency.linearRampToValueAtTime(138, now + 0.9);
    osc.frequency.linearRampToValueAtTime(126, now + 2.1);
    osc.frequency.linearRampToValueAtTime(112, now + 2.9);

    const vowelFilter = ctx.createBiquadFilter();
    vowelFilter.type = 'bandpass';
    vowelFilter.frequency.setValueAtTime(420, now);
    vowelFilter.frequency.linearRampToValueAtTime(530, now + 1.2);
    vowelFilter.frequency.linearRampToValueAtTime(400, now + 2.8);
    vowelFilter.Q.setValueAtTime(3.5, now);

    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.setValueAtTime(4.8, now);
    lfoG.gain.setValueAtTime(3.5, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.75, now + 0.35);
    g.gain.setValueAtTime(0.7, now + duration - 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(vowelFilter);
    vowelFilter.connect(g);
    g.connect(gainNode);

    osc.start(now);
    osc.stop(now + duration);
    this.activeSources.push(osc);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 11. Gato Doméstico (Gato - Suave - 3.0s)
   * Maullido suave, dulce y tierno a bajo volumen (22%) a lo largo de 3.0 segundos,
   * modelado según la grabación real con dos maullidos expresivos ("¡Miau!... ¡Miau!")
   * y ronroneo tierno de fondo.
   */
  private playStudioCat(): number {
    const { gainNode, now } = this.createSoundBus(0.24);
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    // 2 natural expressive meows across 3.0s matching Audio 2:
    // Meow 1: 0.12s to 1.35s
    // Meow 2: 1.62s to 2.82s
    const meows = [
      { start: 0.12, dur: 1.22, fStart: 420, fPeak: 750, fEnd: 480, peakT: 0.38 },
      { start: 1.62, dur: 1.20, fStart: 440, fPeak: 790, fEnd: 500, peakT: 0.35 },
    ];

    meows.forEach(({ start, dur, fStart, fPeak, fEnd, peakT }) => {
      const mTime = now + start;

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(fStart, mTime);
      osc.frequency.linearRampToValueAtTime(fPeak, mTime + peakT);
      osc.frequency.linearRampToValueAtTime(fEnd, mTime + dur);

      // Feline mouth / nasal formant filter (bandpass at 1150 Hz)
      const formant = ctx.createBiquadFilter();
      formant.type = 'bandpass';
      formant.frequency.setValueAtTime(1150, mTime);
      formant.Q.setValueAtTime(2.2, mTime);

      g.gain.setValueAtTime(0.0001, mTime);
      g.gain.linearRampToValueAtTime(0.22, mTime + 0.18);
      g.gain.setValueAtTime(0.20, mTime + dur * 0.7);
      g.gain.exponentialRampToValueAtTime(0.0001, mTime + dur);

      osc.connect(formant);
      formant.connect(g);
      g.connect(gainNode);

      osc.start(mTime);
      osc.stop(mTime + dur + 0.05);
      this.activeSources.push(osc);
    });

    // Soothing continuous purr in background (28 Hz with 130 Hz lowpass filter)
    const purr = ctx.createOscillator();
    const purrGain = ctx.createGain();
    purr.type = 'triangle';
    purr.frequency.setValueAtTime(28, now);

    const purrFilter = ctx.createBiquadFilter();
    purrFilter.type = 'lowpass';
    purrFilter.frequency.setValueAtTime(130, now);

    purrGain.gain.setValueAtTime(0.001, now);
    purrGain.gain.linearRampToValueAtTime(0.10, now + 0.6);
    purrGain.gain.setValueAtTime(0.10, now + 2.4);
    purrGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    purr.connect(purrFilter);
    purrFilter.connect(purrGain);
    purrGain.connect(gainNode);
    purr.start(now);
    purr.stop(now + duration);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  /**
   * 12. Caballo Potente (Caballo - Fuerte - 3.0s)
   * Relincho potente y resoplido enérgico de un caballo (85% volumen) a lo largo de 3.0 segundos.
   * Empieza con un relincho alto (750 Hz - 1100 Hz con flutter LFO de 16 Hz) y termina con un resoplido nasal.
   */
  private playStudioHorse(): number {
    const { gainNode, now } = this.createSoundBus(0.85); // Fuerte / 85%
    const ctx = this.initContext();
    const duration = SOUND_DURATION_SEC;

    // 1. Powerful Whinny (0.0s to 1.8s)
    const whinnyOsc = ctx.createOscillator();
    const whinnyGain = ctx.createGain();
    whinnyOsc.type = 'sawtooth';

    whinnyOsc.frequency.setValueAtTime(680, now);
    whinnyOsc.frequency.exponentialRampToValueAtTime(1180, now + 0.25);
    whinnyOsc.frequency.linearRampToValueAtTime(840, now + 1.0);
    whinnyOsc.frequency.linearRampToValueAtTime(620, now + 1.8);

    // Whinny vocal flutter LFO (16 Hz)
    const flutterLfo = ctx.createOscillator();
    const flutterGain = ctx.createGain();
    flutterLfo.frequency.setValueAtTime(16, now);
    flutterGain.gain.setValueAtTime(38, now);
    flutterLfo.connect(whinnyOsc.frequency);
    flutterLfo.start(now);
    flutterLfo.stop(now + 1.85);

    // Vocal tract filter
    const whinnyFilter = ctx.createBiquadFilter();
    whinnyFilter.type = 'bandpass';
    whinnyFilter.frequency.setValueAtTime(1200, now);
    whinnyFilter.Q.setValueAtTime(2.2, now);

    whinnyGain.gain.setValueAtTime(0.0001, now);
    whinnyGain.gain.linearRampToValueAtTime(0.85, now + 0.15); // Powerful loud volume
    whinnyGain.gain.setValueAtTime(0.75, now + 1.1);
    whinnyGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.85);

    whinnyOsc.connect(whinnyFilter);
    whinnyFilter.connect(whinnyGain);
    whinnyGain.connect(gainNode);

    whinnyOsc.start(now);
    whinnyOsc.stop(now + 1.9);
    this.activeSources.push(whinnyOsc);

    // 2. Powerful Horse Snort / Resoplido (1.7s to 2.9s)
    const snortTime = now + 1.7;
    const snortDur = 1.2;

    const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * snortDur), ctx.sampleRate);
    const nData = noiseBuf.getChannelData(0);
    for (let i = 0; i < nData.length; i++) {
      // Natural lip flutter envelope
      const flutter = Math.sin((i / ctx.sampleRate) * 22 * 2 * Math.PI);
      nData[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * flutter);
    }
    const nSrc = ctx.createBufferSource();
    nSrc.buffer = noiseBuf;

    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.setValueAtTime(850, snortTime);

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.001, snortTime);
    nGain.gain.linearRampToValueAtTime(0.65, snortTime + 0.1);
    nGain.gain.exponentialRampToValueAtTime(0.0001, snortTime + snortDur);

    nSrc.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(gainNode);

    nSrc.start(snortTime);
    nSrc.stop(snortTime + snortDur);

    this.applySoundFadeOut(gainNode, now, duration);
    return duration;
  }

  // =========================================================================
  // MASTER PLAY DISPATCHER
  // =========================================================================

  /**
   * Plays a single sound based on item identifier (minimum 3.0s duration)
   */
  public playPatternSound(item: PatternItem, isSoftIntensity?: boolean): number {
    this.initContext();
    this.stopAllActiveSources();

    // 0. High pitch notes in musical notes are calibrated at 600 Hz
    if (
      item === 'nota_aguda' ||
      item === 'nota_do_agudo' ||
      item === 'nota_sol_agudo' ||
      item === 'nota_si_agudo'
    ) {
      return this.playStudioNoteHigh();
    }

    // 1. Play authentic real animal sound recording first!
    if (item in REAL_ANIMAL_AUDIO_MAP) {
      const customGain = isSoftIntensity ? 0.30 : undefined;
      const realDur = this.playRealAnimalSample(item, customGain);
      if (realDur !== null) {
        return realDur;
      }
    }

    switch (item) {
      // Animal Sounds
      case 'canario':
      case 'pajaro':
        return this.playStudioCanary();
      case 'buho':
      case 'rana_toro':
      case 'leon':
        return this.playStudioOwl();
      case 'perro':
        return this.playStudioDog();
      case 'vaca':
        return this.playStudioCow();
      case 'gato':
        return this.playStudioCat();
      case 'caballo':
      case 'elefante':
        return this.playStudioHorse();

      // Instrument Sounds
      // Misión 1: Agudo = Xilófono / Campana (3.0s), Grave = Tambor / Timbal (3.0s)
      case 'campana_aguda':
      case 'campana':
      case 'flauta_aguda':
      case 'xilofono_agudo':
      case 'xilofono':
      case 'agudo':
        return this.playStudioXylophone();
      case 'timbal_grave':
      case 'tambor_grave':
      case 'tambor':
      case 'piano_grave':
      case 'grave':
        return this.playStudioDrum();

      // Misión 2: Corto = Guitarra / Claves (2.0s), Largo = Xilófono / Órgano (4.0s)
      case 'claves_cortas':
      case 'maraca_corta':
      case 'guitarra_corta':
      case 'guitarra':
      case 'tambor_corto':
      case 'corto':
        return this.playStudioGuitarShort();
      case 'organo_largo':
      case 'violin_largo':
      case 'xilofono_largo':
      case 'piano_largo':
      case 'piano':
      case 'triangulo_largo':
      case 'largo':
        return this.playStudioXylophoneLong();

      // Misión 3: Suave = Arpa / Kalimba (3.0s), Fuerte = Guitarra Eléctrica / Tuba (3.0s)
      case 'kalimba_suave':
      case 'caja_musica_suave':
      case 'arpa_suave':
      case 'arpa':
      case 'maraca_suave':
      case 'suave':
        return this.playStudioHarp();
      case 'tuba_fuerte':
      case 'tuba_grave':
      case 'tuba':
      case 'trompeta_fuerte':
      case 'bateria_fuerte':
      case 'guitarra_electrica_fuerte':
      case 'guitarra_electrica':
      case 'guitarra_fuerte':
      case 'fuerte':
        return this.playStudioElectricGuitar();

      // Human Voice Sounds
      case 'voz_vocal_a_aguda':
      case 'voz_vocal_i_aguda':
      case 'voz_nina_agudo':
        return this.playStudioChildVoice();
      case 'voz_vocal_o_grave':
      case 'voz_vocal_u_grave':
      case 'voz_hombre_grave':
        return this.playStudioManVoice();
      case 'voz_corta_paz':
      case 'voz_corta_sol':
      case 'voz_corta_sol2':
      case 'voz_corta_hola':
        return this.playStudioShortWord();
      case 'voz_larga_paz':
      case 'voz_larga_sol':
      case 'voz_larga_hola':
        return this.playStudioLongWord();
      case 'voz_susurro_aqui2':
      case 'voz_susurro_silencio':
      case 'voz_susurro_suave':
      case 'voz_susurro_secreto':
        return this.playStudioWhisper();
      case 'voz_fuerte_aqui2':
      case 'voz_fuerte_silencio':
      case 'voz_fuerte_aqui':
      case 'voz_fuerte_secreto':
        return this.playStudioLoudVoice();
      case 'voz_pregunta_cohete':
      case 'voz_pregunta_sorpresa':
      case 'voz_pregunta_si':
      case 'voz_pregunta_que':
      case 'voz_pregunta_frase':
      case 'pregunta':
        return this.playStudioQuestionVoice();
      case 'voz_exclamacion_cohete':
      case 'voz_exclamacion_sorpresa':
      case 'voz_exclamacion_si':
      case 'voz_exclamacion_que':
      case 'voz_exclamacion_frase':
      case 'exclamacion':
        return this.playStudioExclamationVoice();

      // Musical Notes Sounds
      case 'nota_grave':
      case 'nota_do_grave':
      case 'nota_mi_grave':
      case 'nota_la_grave':
        return this.playStudioNoteLow();
      case 'nota_corta':
      case 'nota_staccato':
      case 'nota_re_staccato':
      case 'nota_fa_staccato':
        return this.playStudioNoteShort();
      case 'nota_larga':
      case 'nota_tenuto':
      case 'nota_re_tenuto':
      case 'nota_fa_tenuto':
        return this.playStudioNoteLong();
      case 'nota_suave':
      case 'nota_pianissimo':
      case 'nota_mi_pianissimo':
      case 'nota_sol_pianissimo':
        return this.playStudioNoteSoft();
      case 'nota_fuerte':
      case 'nota_fortissimo':
      case 'nota_mi_fortissimo':
      case 'nota_sol_fortissimo':
        return this.playStudioNoteLoud();
      case 'nota_pregunta':
        return this.playStudioNoteQuestion();
      case 'nota_exclamacion':
        return this.playStudioNoteExclamation();

      default:
        return this.playStudioXylophone();
    }
  }

  /**
   * Returns exact natural duration for each sound (not fixed at 3 seconds, but the true duration of the sound).
   */
  public getItemDuration(item: PatternItem): number {
    const config = REAL_AUDIO_MAP[item];
    if (config) {
      const buffer = this.audioBuffers.get(config.path);
      if (buffer && buffer.duration > 0) {
        return Math.round(buffer.duration * 100) / 100;
      }
      return config.duration;
    }

    switch (item) {
      case 'canario':
      case 'pajaro':
      case 'pajarito':
      case 'buho':
      case 'gato':
      case 'vaca':
        return 2.03;
      case 'caballo':
        return 1.02;
      case 'perro':
      case 'tambor_corto':
        return 0.84;
      case 'pato':
      case 'maraca_corta':
        return 0.76;
      case 'rana':
      case 'claves_cortas':
        return 0.65;
      case 'guitarra_corta':
      case 'guitarra':
        return 2.07;
      case 'xilofono_largo':
      case 'piano_largo':
      case 'piano':
      case 'violin_largo':
      case 'organo_largo':
      case 'nota_fa_tenuto':
        return 4.08;
      case 'nota_corta':
      case 'nota_staccato':
      case 'corto':
        return 0.81;
      case 'nota_re_staccato':
      case 'nota_fa_staccato':
        return 0.71;
      case 'nota_larga':
      case 'nota_tenuto':
      case 'nota_re_tenuto':
      case 'lobo':
      case 'ballena':
        return 3.55;
      case 'nota_pregunta':
      case 'nota_exclamacion':
        return 2.56;
      case 'voz_corta_sol':
      case 'voz_corta_sol2':
      case 'voz_corta_paz':
        return 0.92;
      case 'voz_corta_hola':
        return 1.26;
      case 'voz_larga_hola':
      case 'voz_larga_sol':
      case 'voz_larga_paz':
        return 3.55;
      case 'voz_nina_agudo':
      case 'voz_hombre_grave':
      case 'voz_vocal_i_aguda':
      case 'voz_vocal_u_grave':
      case 'voz_vocal_a_aguda':
      case 'voz_vocal_o_grave':
        return 2.56;
      case 'voz_susurro_suave':
      case 'voz_susurro_secreto':
      case 'voz_fuerte_aqui':
      case 'voz_fuerte_secreto':
      case 'voz_susurro_silencio':
      case 'voz_fuerte_silencio':
      case 'voz_susurro_aqui2':
      case 'voz_fuerte_aqui2':
      case 'voz_pregunta_si':
      case 'voz_pregunta_que':
      case 'voz_pregunta_frase':
      case 'voz_exclamacion_si':
      case 'voz_exclamacion_que':
      case 'voz_exclamacion_frase':
      case 'voz_pregunta_sorpresa':
      case 'voz_exclamacion_sorpresa':
      case 'voz_pregunta_cohete':
      case 'voz_exclamacion_cohete':
        return 2.27;
      default:
        return 3.06;
    }
  }

  /**
   * Plays the sound sequence where:
   * - In Mission 1 & 3, each sound plays for >= 3.0 seconds
   * - In Mission 2, short sounds play for 0.75s and long sounds for 3.0s so the difference is unmistakable!
   * - Pause between sounds scales with level or settings (1.0s in Level 1, 0.75s in Level 2, 0.55s in Level 3)
   */
  public playSequence(
    sequence: PatternItem[],
    speed: 'normal' | 'lento' = 'normal',
    callbacks?: SequenceCallbacks,
    customPauseSec?: number
  ) {
    this.stopCurrentSequence();
    this.initContext();
    this.isPlayingSequence = true;

    const basePause = customPauseSec !== undefined ? customPauseSec : STEP_INTERVAL_SEC;
    const intervalMs = (speed === 'lento' ? basePause * 1.35 : basePause) * 1000;

    let currentTimelineMs = 200;

    sequence.forEach((item, index) => {
      const itemDuration = this.getItemDuration(item);
      const itemDurMs = itemDuration * 1000;

      // 1. Step Start
      const startId = window.setTimeout(() => {
        if (!this.isPlayingSequence) return;
        this.playPatternSound(item);
        callbacks?.onStepStart?.(index, item, itemDuration);

        let elapsed = 0;
        if (this.progressInterval) clearInterval(this.progressInterval);
        this.progressInterval = window.setInterval(() => {
          if (!this.isPlayingSequence) return;
          elapsed += 0.05;
          callbacks?.onStepProgress?.(index, Math.min(itemDuration, elapsed), itemDuration);
        }, 50);
      }, currentTimelineMs);

      this.sequenceTimeouts.push(startId);

      // 2. Step End (after item's exact duration: 0.75s or 3.0s)
      const endTimelineMs = currentTimelineMs + itemDurMs;
      const endId = window.setTimeout(() => {
        if (!this.isPlayingSequence) return;
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }
        callbacks?.onStepEnd?.(index, item);

        // Pause notification between steps (1.0s silence)
        if (index < sequence.length - 1) {
          callbacks?.onPauseStart?.(index, intervalMs / 1000);
        }
      }, endTimelineMs);

      this.sequenceTimeouts.push(endId);

      // Move timeline forward by this sound's duration + 1.0s pause
      currentTimelineMs = endTimelineMs + intervalMs;
    });

    // 3. Sequence Complete
    const completeId = window.setTimeout(() => {
      this.isPlayingSequence = false;
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      callbacks?.onComplete?.();
    }, currentTimelineMs + 80);

    this.sequenceTimeouts.push(completeId);
  }

  public stopAllActiveSources() {
    this.activeSources.forEach((src) => {
      try {
        src.stop();
      } catch {
        // Ignored
      }
    });
    this.activeSources = [];

    this.activeAudioElements.forEach((el) => {
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // Ignored
      }
    });
    this.activeAudioElements = [];
  }

  public stopCurrentSequence() {
    this.sequenceTimeouts.forEach((id) => clearTimeout(id));
    this.sequenceTimeouts = [];
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.isPlayingSequence = false;
    this.stopAllActiveSources();
  }

  public isRunning(): boolean {
    return this.isPlayingSequence;
  }

  // UI Sounds
  public playDropSound() {
    const { gainNode, now } = this.createSoundBus(0.35);
    const ctx = this.initContext();

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playVictoryFanfare() {
    const { gainNode, now } = this.createSoundBus(0.6);
    const ctx = this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      const nStart = now + idx * 0.11;
      const nDur = idx === notes.length - 1 ? 0.7 : 0.22;

      osc.frequency.setValueAtTime(freq, nStart);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, nStart);
      g.gain.linearRampToValueAtTime(0.4, nStart + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, nStart + nDur);

      osc.connect(g);
      g.connect(gainNode);

      osc.start(nStart);
      osc.stop(nStart + nDur + 0.05);
    });
  }

  public playRetryChime() {
    const { gainNode, now } = this.createSoundBus(0.4);
    const ctx = this.initContext();
    const notes = [392.0, 329.63];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const nStart = now + idx * 0.18;
      const nDur = 0.35;

      osc.frequency.setValueAtTime(freq, nStart);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, nStart);
      g.gain.linearRampToValueAtTime(0.3, nStart + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, nStart + nDur);

      osc.connect(g);
      g.connect(gainNode);

      osc.start(nStart);
      osc.stop(nStart + nDur + 0.05);
    });
  }

  public playTap() {
    const { gainNode, now } = this.createSoundBus(0.2);
    const ctx = this.initContext();

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.04);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playStarSound() {
    const { gainNode, now } = this.createSoundBus(0.4);
    const ctx = this.initContext();

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.1);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // =========================================================================
  // NIVEL 3: ESTÍMULOS AUDITIVOS SINTÉTICOS
  // Soporta: Duración, Frecuencia, Intensidad y Prosodia
  // =========================================================================

  private activeSyntheticStopFn: (() => void) | null = null;
  private syntheticProgressTimer: number | null = null;

  public stopSyntheticStimulus(): void {
    if (this.syntheticProgressTimer !== null) {
      clearInterval(this.syntheticProgressTimer);
      this.syntheticProgressTimer = null;
    }
    if (this.activeSyntheticStopFn) {
      try {
        this.activeSyntheticStopFn();
      } catch {
        // Ignored
      }
      this.activeSyntheticStopFn = null;
    }
  }

  /**
   * Reproduce un estímulo auditivo sintético puro calibrado para el Nivel 3.
   *
   * 1. Duración: Tono constante -> 'largo' (2.8s) vs 'corto' (0.45s)
   * 2. Tono/Frecuencia: Tono constante (1.35s) -> 'agudo' (1046.5 Hz) vs 'grave' (146.8 Hz)
   * 3. Intensidad/Volumen: Tono constante (1.35s a 440 Hz) -> 'fuerte' (vol alto) vs 'suave' (vol bajo)
   * 4. Prosodia/Entonación: Secuencia de 2 tonos ->
   *    - 'pregunta' / Inflexión ascendente: El 2° tono sube de frecuencia (392 Hz -> 620 Hz)
   *    - 'afirmacion' / Inflexión descendente: El 2° tono baja de frecuencia (523 Hz -> 330 Hz)
   */
  public playSyntheticStimulus(
    category: CategoryId,
    variant: string,
    callbacks?: SyntheticAudioCallbacks
  ): { duration: number; stop: () => void } {
    this.stopCurrentSequence();
    this.stopSyntheticStimulus();

    const ctx = this.initContext();
    const startTime = ctx.currentTime;
    let totalDurationSec = 1.35;

    // Track active nodes to stop cleanly if requested
    const nodesToStop: { stop?: () => void; disconnect?: () => void }[] = [];
    let isTerminated = false;

    callbacks?.onStart?.();

    if (category === 'duration') {
      const isLong = variant === 'largo';
      totalDurationSec = isLong ? 2.8 : 0.45;
      const freq = 480; // Tono cómodo en región media (A4-B4)
      const targetGain = 0.55;

      const { gainNode, now } = this.createSoundBus(targetGain);
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Sutil armónico cálido para hacerlo muy agradable y orgánico
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(freq, now);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.2, now);

      // Envolvente de amplitud constante sin clics
      const attackSec = 0.03;
      const releaseSec = 0.04;
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(targetGain, now + attackSec);
      gainNode.gain.setValueAtTime(targetGain, now + totalDurationSec - releaseSec);
      gainNode.gain.linearRampToValueAtTime(0.0001, now + totalDurationSec);

      osc.connect(filter);
      subOsc.connect(subGain);
      subGain.connect(filter);
      filter.connect(gainNode);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + totalDurationSec + 0.05);
      subOsc.stop(now + totalDurationSec + 0.05);

      nodesToStop.push(osc, subOsc);
    } else if (category === 'frequency') {
      totalDurationSec = 1.35;
      const isAgudo = variant === 'agudo';
      const targetGain = isAgudo ? 0.45 : 0.65;
      const freq = isAgudo ? 600.0 : 146.83; // 600 Hz (Agudo) vs Re3 (Grave)

      const { gainNode, now } = this.createSoundBus(targetGain);
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      if (isAgudo) {
        // Agudo: filtro suave cálido para proteger los oídos de los niños
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, now);
        filter.Q.setValueAtTime(0.7, now);
        osc.type = 'sine';
      } else {
        // Grave: onda triangular filtrada para resonancia profunda
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        osc.type = 'triangle';
      }
      osc.frequency.setValueAtTime(freq, now);

      const attackSec = 0.04;
      const releaseSec = 0.05;
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(targetGain, now + attackSec);
      gainNode.gain.setValueAtTime(targetGain, now + totalDurationSec - releaseSec);
      gainNode.gain.linearRampToValueAtTime(0.0001, now + totalDurationSec);

      osc.connect(filter);
      filter.connect(gainNode);

      osc.start(now);
      osc.stop(now + totalDurationSec + 0.05);
      nodesToStop.push(osc);
    } else if (category === 'intensity') {
      totalDurationSec = 1.35;
      const isFuerte = variant === 'fuerte';
      // Frecuencia idéntica para ambos estímulos (440 Hz La4)
      const freq = 440;
      // Fuerte: volumen alto y rotundo (0.85). Suave: volumen bajo y tenue (0.16)
      const targetGain = isFuerte ? 0.85 : 0.16;

      const { gainNode, now } = this.createSoundBus(targetGain);
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const attackSec = 0.035;
      const releaseSec = 0.045;
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(targetGain, now + attackSec);
      gainNode.gain.setValueAtTime(targetGain, now + totalDurationSec - releaseSec);
      gainNode.gain.linearRampToValueAtTime(0.0001, now + totalDurationSec);

      osc.connect(filter);
      filter.connect(gainNode);

      osc.start(now);
      osc.stop(now + totalDurationSec + 0.05);
      nodesToStop.push(osc);
    } else if (category === 'prosody') {
      // Secuencia de dos tonos sintéticos:
      // Tono 1: 0.55s | Pausa: 0.10s | Tono 2: 0.65s
      const tone1Dur = 0.55;
      const gapDur = 0.10;
      const tone2Dur = 0.65;
      totalDurationSec = tone1Dur + gapDur + tone2Dur;

      const isPregunta = variant === 'pregunta';
      // Pregunta: El 2° tono sube de frecuencia (392 Hz Sol4 -> 620 Hz Re#5)
      // Afirmación: El 2° tono baja de frecuencia (523 Hz Do5 -> 330 Hz Mi4)
      const f1 = isPregunta ? 392.0 : 523.25;
      const f2 = isPregunta ? 620.0 : 329.63;

      const { gainNode, now } = this.createSoundBus(0.55);

      // TONO 1
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(f1, now);

      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.55, now + 0.03);
      gain1.gain.setValueAtTime(0.55, now + tone1Dur - 0.03);
      gain1.gain.linearRampToValueAtTime(0.0001, now + tone1Dur);

      osc1.connect(gain1);
      gain1.connect(gainNode);

      osc1.start(now);
      osc1.stop(now + tone1Dur + 0.02);
      nodesToStop.push(osc1);

      // TONO 2
      const t2Start = now + tone1Dur + gapDur;
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(f2, t2Start);

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.0001, t2Start);
      gain2.gain.linearRampToValueAtTime(0.55, t2Start + 0.03);
      gain2.gain.setValueAtTime(0.55, t2Start + tone2Dur - 0.04);
      gain2.gain.linearRampToValueAtTime(0.0001, t2Start + tone2Dur);

      osc2.connect(gain2);
      gain2.connect(gainNode);

      osc2.start(t2Start);
      osc2.stop(t2Start + tone2Dur + 0.02);
      nodesToStop.push(osc2);

      // Notify step 1 immediately, step 2 at tone2 start
      callbacks?.onToneStep?.(1);
      setTimeout(() => {
        if (!isTerminated) {
          callbacks?.onToneStep?.(2);
        }
      }, (tone1Dur + gapDur) * 1000);
    }

    // Real-time progress updates for animations and visualizers
    const startWallTime = Date.now();
    this.syntheticProgressTimer = window.setInterval(() => {
      if (isTerminated) return;
      const elapsedSec = (Date.now() - startWallTime) / 1000;
      callbacks?.onProgress?.(Math.min(elapsedSec, totalDurationSec), totalDurationSec);

      if (elapsedSec >= totalDurationSec) {
        if (this.syntheticProgressTimer !== null) {
          clearInterval(this.syntheticProgressTimer);
          this.syntheticProgressTimer = null;
        }
        this.activeSyntheticStopFn = null;
        callbacks?.onEnd?.();
      }
    }, 30);

    const stopFn = () => {
      isTerminated = true;
      if (this.syntheticProgressTimer !== null) {
        clearInterval(this.syntheticProgressTimer);
        this.syntheticProgressTimer = null;
      }
      nodesToStop.forEach((n) => {
        try {
          if (n.stop) n.stop();
        } catch {
          // Ignored
        }
      });
      callbacks?.onEnd?.();
    };

    this.activeSyntheticStopFn = stopFn;
    return { duration: totalDurationSec, stop: stopFn };
  }

  /**
   * Reproduce el estímulo específico de la categoría para el Nivel 3
   * (Sonidos reales de animales, palabras/voces humanas, instrumentos musicales o notas a 600 Hz)
   */
  public playLevel3Sound(
    soundItem: PatternItem,
    callbacks?: SyntheticAudioCallbacks,
    isSoftIntensity?: boolean
  ): { duration: number; stop: () => void } {
    this.stopCurrentSequence();
    this.stopSyntheticStimulus();

    const naturalDur = this.getItemDuration(soundItem);
    const duration = this.playPatternSound(soundItem, isSoftIntensity);
    const totalDurationSec = duration > 0 ? duration : naturalDur;

    callbacks?.onStart?.();

    const startWallTime = Date.now();
    let isTerminated = false;

    if (this.syntheticProgressTimer !== null) {
      clearInterval(this.syntheticProgressTimer);
    }

    this.syntheticProgressTimer = window.setInterval(() => {
      if (isTerminated) return;
      const elapsedSec = (Date.now() - startWallTime) / 1000;
      callbacks?.onProgress?.(Math.min(elapsedSec, totalDurationSec), totalDurationSec);

      if (elapsedSec >= totalDurationSec) {
        if (this.syntheticProgressTimer !== null) {
          clearInterval(this.syntheticProgressTimer);
          this.syntheticProgressTimer = null;
        }
        this.activeSyntheticStopFn = null;
        callbacks?.onEnd?.();
      }
    }, 35);

    const stopFn = () => {
      isTerminated = true;
      if (this.syntheticProgressTimer !== null) {
        clearInterval(this.syntheticProgressTimer);
        this.syntheticProgressTimer = null;
      }
      this.stopCurrentSequence();
      this.stopAllActiveSources();
      this.activeSyntheticStopFn = null;
      callbacks?.onEnd?.();
    };

    this.activeSyntheticStopFn = stopFn;
    return { duration: totalDurationSec, stop: stopFn };
  }
}

export const soundManager = new StudioAudioEngine();

export function getItemDuration(item: PatternItem): number {
  return soundManager.getItemDuration(item);
}
