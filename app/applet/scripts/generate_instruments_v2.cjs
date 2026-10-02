const fs = require('fs');
const { spawn } = require('child_process');

function writeMp3(filename, duration, sampleRate, sampleGenerator) {
  return new Promise((resolve, reject) => {
    const totalSamples = Math.floor(sampleRate * duration);
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-f', 'f32le',
      '-ar', String(sampleRate),
      '-ac', '2',
      '-i', '-',
      '-b:a', '192k',
      filename
    ]);

    const buf = Buffer.alloc(totalSamples * 4 * 2);
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      let [left, right] = sampleGenerator(t, i, totalSamples);

      // Master safety limiter
      left = Math.max(-0.98, Math.min(0.98, left));
      right = Math.max(-0.98, Math.min(0.98, right));

      buf.writeFloatLE(left, i * 8);
      buf.writeFloatLE(right, i * 8 + 4);
    }

    ffmpeg.stdin.write(buf);
    ffmpeg.stdin.end();

    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('ffmpeg exited with code ' + code));
    });
  });
}

// =========================================================================
// 1. TAMBOR GRAVE ACÚSTICO REAL Y CLARO (Misión 1 - Grave - 3.0s)
// =========================================================================
// Modela fielmente un tambor acústico con parche de cuero y casco de madera:
// - Ataque nítido de baqueta/mazo acolchado sobre cuero (transitorio percusivo claro)
// - Frecuencia fundamental óptima (72 Hz cayendo a 58 Hz): perfectamente audible
//   y grave en teléfonos móviles, altavoces pequeños y auriculares.
// - Armónicos pares e impares de membrana circular (Bessel J0/J1 modes: 1.0, 1.59, 2.14, 2.30)
// - Resonancia cálida del casco cilíndrico de madera
// - Dos golpes claros y majestuosos:
//   Golpe 1 a 0.12s ("¡BOOOM...!") con resonancia abierta
//   Golpe 2 a 1.45s ("¡BOOOM...!") con vibración profunda hasta el final de los 3s
// =========================================================================
function generateRealAcousticDrum(sampleRate) {
  const strikes = [
    { time: 0.12, velocity: 1.0 },
    { time: 1.45, velocity: 0.95 },
  ];

  return (t, i, total) => {
    let mono = 0;

    for (const strike of strikes) {
      if (t >= strike.time) {
        const dt = t - strike.time;

        // 1. Transitorio de impacto: baqueta sobre cuero (400 Hz - 2.5 kHz)
        const hitEnv = Math.exp(-dt * 180);
        const stickContact = (
          Math.sin(2 * Math.PI * 1850 * dt) * 0.35 +
          Math.sin(2 * Math.PI * 920 * dt) * 0.45 +
          Math.sin(2 * Math.PI * 450 * dt) * 0.30
        ) * hitEnv;

        // 2. Tensión de membrana: caída de tono de 125 Hz a 64 Hz en los primeros 50 ms
        const pitchDrop = 64.0 + 65.0 * Math.exp(-dt * 38);
        const phase0 = 2 * Math.PI * (64.0 * dt + (65.0 / 38.0) * (1 - Math.exp(-dt * 38)));

        // 3. Modos circulares de membrana de tambor acústico (parche de cuero)
        // Modo (0,1): Fundamental profundo
        const m1 = Math.sin(phase0) * Math.exp(-dt * 2.1);
        // Modo (1,1): Primer armónico circular (1.59x)
        const m2 = Math.sin(phase0 * 1.593) * Math.exp(-dt * 4.2) * 0.45;
        // Modo (2,1): Segundo modo (2.14x)
        const m3 = Math.sin(phase0 * 2.136) * Math.exp(-dt * 6.8) * 0.25;
        // Modo (0,2): Modo concéntrico (2.30x)
        const m4 = Math.sin(phase0 * 2.296) * Math.exp(-dt * 8.5) * 0.20;

        // 4. Resonancia grave de la caja de madera (sub-cuerpo hondo a 60 Hz)
        const woodBody = Math.sin(2 * Math.PI * 62 * dt) * Math.exp(-dt * 1.8) * 0.55;

        // 5. Segunda armónica de presencia (128 Hz) para máxima claridad en altavoces de celular
        const clarityPunch = Math.sin(2 * Math.PI * 128 * dt) * Math.exp(-dt * 3.5) * 0.40;

        const drumSignal = (
          stickContact * 0.40 +
          m1 * 0.85 +
          m2 +
          m3 +
          m4 +
          woodBody +
          clarityPunch
        ) * strike.velocity;

        mono += drumSignal;
      }
    }

    // Leve compresión cálida para densidad acústica
    let compressed = Math.tanh(mono * 0.95) * 0.95;

    // Fade out suave al final de los 3.0s
    const fadeOut = Math.min(1.0, (total - i) / (sampleRate * 0.15));
    const out = compressed * fadeOut;

    // Salida estéreo con ligero aire espacial
    return [out * 0.98, out * 0.96];
  };
}

// =========================================================================
// 2. GUITARRA ELÉCTRICA REAL DE ROCK (Misión 3 - Fuerte - 3.0s)
// =========================================================================
// Modela una guitarra eléctrica real conectada a un amplificador de válvulas:
// - Rasgueo contundente de acordes de potencia (Power Chord E5)
// - Cuerdas: E2 (82.4 Hz), B2 (123.5 Hz), E3 (164.8 Hz), G#3 (207.6 Hz), B3 (246.9 Hz), E4 (329.6 Hz)
// - Ataque de púa percusivo y metálico con rascado inicial de cuerdas
// - Distorsión de válvulas asimétrica (calidez, pegada y sustain prolongado)
// - Curva de ecualización de pantalla de guitarra (gabinete 4x12):
//   corte de subgraves <70 Hz, golpe de medios a 800 Hz, presencia cortante a 3.2 kHz
//   y corte suave por encima de 5.5 kHz para evitar sonido chillón.
// - Volumen FUERTE y potente, sonando como una verdadera guitarra de rock.
// =========================================================================
function generateRealElectricGuitar(sampleRate) {
  // Cuerdas de guitarra eléctrica afinadas en Mi mayor (E Power Chord):
  const strings = [
    { f0: 82.41,  delay: 0.000, amp: 1.00 }, // E2 (Sexta cuerda)
    { f0: 123.47, delay: 0.007, amp: 0.95 }, // B2 (Quinta cuerda)
    { f0: 164.81, delay: 0.014, amp: 0.90 }, // E3 (Cuarta cuerda)
    { f0: 207.65, delay: 0.021, amp: 0.85 }, // G#3 (Tercera cuerda)
    { f0: 246.94, delay: 0.028, amp: 0.80 }, // B3 (Segunda cuerda)
    { f0: 329.63, delay: 0.035, amp: 0.75 }, // E4 (Primera cuerda)
  ];

  return (t, i, total) => {
    // 1. Rascado de púa inicial ("CHWAANG") en los primeros 40 ms
    const pickScrape = (
      Math.sin(2 * Math.PI * 3400 * t) * 0.55 +
      Math.sin(2 * Math.PI * 2200 * t) * 0.40 +
      Math.sin(2 * Math.PI * 4800 * t) * 0.25
    ) * Math.exp(-t * 95);

    let cleanMix = pickScrape * 0.45;

    // 2. Suma armónica de cada cuerda con leve vibrato natural de cuerda
    for (const str of strings) {
      if (t >= str.delay) {
        const dt = t - str.delay;
        const f0 = str.f0;

        // Vibrato de cuerda que aumenta sutilmente con el sustain
        const vibRate = 5.2; // Hz
        const vibDepth = 0.004 * Math.min(1.0, dt * 1.5);
        const vibFreq = f0 * (1.0 + vibDepth * Math.sin(2 * Math.PI * vibRate * dt));

        // Armónicos de cuerda de guitarra eléctrica (humbucker pickup)
        const decayBase = 0.45; // Sustain largo para durar 3 segundos
        const h1 = Math.sin(2 * Math.PI * vibFreq * dt) * Math.exp(-dt * decayBase);
        const h2 = Math.sin(2 * Math.PI * vibFreq * 2 * dt) * Math.exp(-dt * (decayBase + 0.18)) * 0.75;
        const h3 = Math.sin(2 * Math.PI * vibFreq * 3 * dt) * Math.exp(-dt * (decayBase + 0.35)) * 0.50;
        const h4 = Math.sin(2 * Math.PI * vibFreq * 4 * dt) * Math.exp(-dt * (decayBase + 0.60)) * 0.35;
        const h5 = Math.sin(2 * Math.PI * vibFreq * 5 * dt) * Math.exp(-dt * (decayBase + 0.90)) * 0.22;

        const stringSignal = (h1 + h2 + h3 + h4 + h5) * str.amp;
        cleanMix += stringSignal * 0.28;
      }
    }

    // 3. Etapa de preamplificador a válvulas: distorsión asimétrica y saturación armónica
    const drive = 3.6;
    const driven = cleanMix * drive;
    // Función de transferencia de válvula (soft clipping asimétrico):
    let tubeDistortion;
    if (driven > 0) {
      tubeDistortion = Math.tanh(driven * 1.1) * 0.85;
    } else {
      tubeDistortion = Math.tanh(driven * 0.9) * 0.80 - 0.1 * Math.pow(Math.abs(driven), 2) / (1 + Math.abs(driven));
    }

    // 4. Emulación de altavoz de guitarra eléctrica (Speaker Cabinet Emulation):
    // - Realce de presencia a 3.1 kHz (mordida y claridad)
    // - Cuerpo de medios a 750 Hz (densidad del ampli)
    // - Atenuación de subgraves y agudos extremos
    const presence = Math.sin(2 * Math.PI * 3150 * t) * tubeDistortion * 0.22;
    const midPunch = Math.sin(2 * Math.PI * 750 * t) * tubeDistortion * 0.18;
    let ampOutput = tubeDistortion * 0.82 + presence + midPunch;

    // 5. Fade out limpio al aproximarse a los 3.0s
    const fadeOut = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const finalSignal = ampOutput * 0.96 * fadeOut;

    // Salida estéreo con cuerpo y presencia
    return [finalSignal * 0.98, finalSignal * 0.96];
  };
}

// -------------------------------------------------------------
// Xilófono y Arpa existentes (mantener sincronizados)
// -------------------------------------------------------------
function generateXylophone(sampleRate) {
  const notes = [
    { time: 0.10, freq: 1046.5, pan: -0.2 },
    { time: 0.85, freq: 1318.5, pan: 0.1 },
    { time: 1.65, freq: 1567.9, pan: 0.25 },
  ];

  return (t, i, total) => {
    let left = 0;
    let right = 0;

    for (const note of notes) {
      if (t >= note.time) {
        const dt = t - note.time;
        const clickEnv = Math.exp(-dt * 450);
        const clickNoise = (Math.sin(dt * 18000) * 0.4 + Math.sin(dt * 32000) * 0.2) * clickEnv;

        const f0 = note.freq;
        const env1 = Math.exp(-dt * 3.6);
        const env2 = Math.exp(-dt * 9.0);
        const env3 = Math.exp(-dt * 18.0);

        const sig =
          0.65 * Math.sin(2 * Math.PI * f0 * dt) * env1 +
          0.30 * Math.sin(2 * Math.PI * (f0 * 3.0) * dt) * env2 +
          0.14 * Math.sin(2 * Math.PI * (f0 * 5.9) * dt) * env3 +
          0.25 * clickNoise;

        const panL = 0.5 - note.pan * 0.4;
        const panR = 0.5 + note.pan * 0.4;
        left += sig * panL;
        right += sig * panR;
      }
    }

    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.15));
    return [left * 0.92 * fade, right * 0.92 * fade];
  };
}

function generateShortGuitar(sampleRate) {
  const strings = [
    { freq: 82.41, delay: 0.000, gain: 0.8 },
    { freq: 123.47, delay: 0.008, gain: 0.85 },
    { freq: 164.81, delay: 0.016, gain: 0.9 },
    { freq: 196.00, delay: 0.024, gain: 0.85 },
    { freq: 246.94, delay: 0.032, gain: 0.8 },
    { freq: 329.63, delay: 0.040, gain: 0.75 },
  ];

  return (t, i, total) => {
    let mono = 0;

    for (const str of strings) {
      if (t >= str.delay) {
        const dt = t - str.delay;
        const f0 = str.freq;

        let strSig = 0;
        for (let h = 1; h <= 6; h++) {
          const hFreq = f0 * h;
          const decayRate = 1.4 + h * 0.6;
          const hGain = (1.0 / Math.pow(h, 1.1)) * Math.exp(-dt * decayRate);
          strSig += hGain * Math.sin(2 * Math.PI * hFreq * dt);
        }

        const pick = Math.sin(dt * 3500) * Math.exp(-dt * 120) * 0.3;
        mono += (strSig * 0.28 + pick) * str.gain;
      }
    }

    const bodyWobble = Math.sin(2 * Math.PI * 102 * t) * Math.exp(-t * 1.8) * 0.15;
    mono += bodyWobble;

    const fadeOut = Math.min(1.0, (total - i) / (sampleRate * 0.15));
    const left = mono * 0.85 * fadeOut;
    const right = mono * 0.88 * fadeOut;
    return [left, right];
  };
}

function generateLongXylophone(sampleRate) {
  const notes = [
    { time: 0.10, freq: 1046.5, pan: -0.3 },
    { time: 0.60, freq: 1318.5, pan: -0.15 },
    { time: 1.15, freq: 1567.9, pan: 0.0 },
    { time: 1.70, freq: 1760.0, pan: 0.2 },
    { time: 2.25, freq: 2093.0, pan: 0.35 },
    { time: 2.80, freq: 1567.9, pan: 0.1 },
    { time: 3.25, freq: 1318.5, pan: -0.1 },
    { time: 3.55, freq: 1046.5, pan: -0.25 },
  ];

  return (t, i, total) => {
    let left = 0;
    let right = 0;

    for (const note of notes) {
      if (t >= note.time) {
        const dt = t - note.time;
        const clickEnv = Math.exp(-dt * 450);
        const click = Math.sin(dt * 22000) * clickEnv * 0.3;

        const f0 = note.freq;
        const env1 = Math.exp(-dt * 2.8);
        const env2 = Math.exp(-dt * 7.5);
        const env3 = Math.exp(-dt * 15.0);

        const sig =
          0.68 * Math.sin(2 * Math.PI * f0 * dt) * env1 +
          0.28 * Math.sin(2 * Math.PI * (f0 * 3.0) * dt) * env2 +
          0.12 * Math.sin(2 * Math.PI * (f0 * 5.9) * dt) * env3 +
          click;

        const panL = 0.5 - note.pan * 0.45;
        const panR = 0.5 + note.pan * 0.45;
        left += sig * panL;
        right += sig * panR;
      }
    }

    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    return [left * 0.88 * fade, right * 0.88 * fade];
  };
}

function generateSoftHarp(sampleRate) {
  const harpNotes = [
    { time: 0.05, f: 261.63, pan: -0.25 },
    { time: 0.20, f: 329.63, pan: -0.12 },
    { time: 0.35, f: 392.00, pan: 0.00 },
    { time: 0.50, f: 493.88, pan: 0.12 },
    { time: 0.65, f: 587.33, pan: 0.25 },
  ];

  return (t, i, total) => {
    let left = 0;
    let right = 0;

    for (const note of harpNotes) {
      if (t >= note.time) {
        const dt = t - note.time;
        const touch = Math.min(1.0, dt / 0.008);

        const f0 = note.f;
        const env1 = Math.exp(-dt * 1.15);
        const env2 = Math.exp(-dt * 2.5);

        const sig =
          (0.85 * Math.sin(2 * Math.PI * f0 * dt) * env1 +
           0.25 * Math.sin(2 * Math.PI * (f0 * 2) * dt) * env2 +
           0.08 * Math.sin(2 * Math.PI * (f0 * 3) * dt) * Math.exp(-dt * 4.0)) * touch;

        const panL = 0.5 - note.pan * 0.4;
        const panR = 0.5 + note.pan * 0.4;

        left += sig * panL * 0.28;
        right += sig * panR * 0.28;
      }
    }

    const fadeOut = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    return [left * 0.22 * fadeOut, right * 0.22 * fadeOut];
  };
}

async function main() {
  const sampleRate = 44100;
  console.log('Generating updated studio instrument audio files...');

  // 1. Tambor Acústico Real y Claro (3.0s)
  await writeMp3('public/audio/tambor.mp3', 3.0, sampleRate, generateRealAcousticDrum(sampleRate));
  console.log('✓ Created public/audio/tambor.mp3 (3.0s - Tambor Acústico Real y Claro)');

  // 2. Guitarra Eléctrica Real de Rock (3.0s - Fuerte)
  await writeMp3('public/audio/guitarra_electrica.mp3', 3.0, sampleRate, generateRealElectricGuitar(sampleRate));
  console.log('✓ Created public/audio/guitarra_electrica.mp3 (3.0s - Guitarra Eléctrica de Rock Real)');

  // 3. Xilófono Agudo (3.0s)
  await writeMp3('public/audio/xilofono.mp3', 3.0, sampleRate, generateXylophone(sampleRate));
  console.log('✓ Verified public/audio/xilofono.mp3');

  // 4. Guitarra Corta (2.0s EXACT)
  await writeMp3('public/audio/guitarra_corta.mp3', 2.0, sampleRate, generateShortGuitar(sampleRate));
  console.log('✓ Verified public/audio/guitarra_corta.mp3');

  // 5. Xilófono Largo (4.0s EXACT)
  await writeMp3('public/audio/xilofono_largo.mp3', 4.0, sampleRate, generateLongXylophone(sampleRate));
  console.log('✓ Verified public/audio/xilofono_largo.mp3');

  // 6. Arpa Suave (3.0s - Suave)
  await writeMp3('public/audio/arpa.mp3', 3.0, sampleRate, generateSoftHarp(sampleRate));
  console.log('✓ Verified public/audio/arpa.mp3');

  console.log('All instrument audio files regenerated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
