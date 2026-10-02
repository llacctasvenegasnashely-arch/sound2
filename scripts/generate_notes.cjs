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
// Helper: Acoustic Piano Note Model (Calibrated for children's comfort)
// =========================================================================
function pianoString(t, f0, velocity = 1.0, decayMult = 1.0, isHighChild = false) {
  if (t < 0) return 0;
  // Hammer felt click (softened felt strike for children, no harsh transient)
  const hammer = isHighChild
    ? Math.exp(-t * 120) * Math.sin(2 * Math.PI * 1200 * t) * 0.05
    : Math.exp(-t * 220) * (Math.sin(2 * Math.PI * 2800 * t) * 0.2 + Math.sin(2 * Math.PI * 4500 * t) * 0.1);

  // String harmonics with dispersion
  let stringSig = 0;
  // For high child notes, limit to 2 mellow harmonics to eliminate shrill piercing overtones
  const numPartials = isHighChild ? 2 : (f0 > 800 ? 5 : f0 > 300 ? 8 : 12);
  for (let n = 1; n <= numPartials; n++) {
    const inharm = Math.sqrt(1 + 0.0002 * n * n);
    const fn = f0 * n * inharm;
    const decay = (0.9 + n * 0.45) / decayMult;
    // Harmonic amplitude rolloff: steep rolloff for high child notes
    const amp = (1.0 / Math.pow(n, isHighChild ? 2.2 : 1.15)) * Math.exp(-t * decay);
    stringSig += Math.sin(2 * Math.PI * fn * t) * amp;
  }

  // Soundboard warmth
  const soundboard = Math.sin(2 * Math.PI * 120 * t) * Math.exp(-t * 1.5) * (isHighChild ? 0.05 : 0.1);
  return (hammer * 0.2 + stringSig * 0.75 + soundboard) * velocity;
}

// 1. NOTA AGUDA (Calibrada a 600 Hz - 3.0s) - Tono suave y dulce para estimulación auditiva infantil
function generateNoteHigh(sampleRate) {
  const f0 = 600.0; // 600 Hz exactos para niños
  return (t, i, total) => {
    // Gentle 30ms attack ramp to avoid click or sudden volume shock
    const attackRamp = Math.min(1.0, Math.max(0, (t - 0.1) / 0.04));
    // Soft velocity (0.50) with child-friendly mellow harmonic profile
    const sig = pianoString(t - 0.1, f0, 0.50, 2.0, true) * attackRamp;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.3));
    // Sweet, comfortable volume (~0.55 peak), completely avoids ear discomfort
    const out = sig * fade * 0.55;
    return [out * 0.95, out * 0.95];
  };
}

// 2. NOTA GRAVE (Do Grave - C2 65.4 Hz with C3 130.8 Hz resonance - 3.0s)
function generateNoteLow(sampleRate) {
  const f0 = 65.41; // C2
  return (t, i, total) => {
    // Fundamental C2 + strong C3 resonance
    const s1 = pianoString(t - 0.1, f0, 1.0, 1.4);
    const s2 = pianoString(t - 0.1, f0 * 2, 0.7, 1.5);
    const subBody = Math.sin(2 * Math.PI * 65.41 * (t - 0.1)) * Math.exp(-(t - 0.1) * 0.9) * 0.4;
    const mono = t >= 0.1 ? (s1 * 0.75 + s2 * 0.5 + subBody) : 0;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(mono * 1.1) * 0.95 * fade;
    return [out * 0.98, out * 0.95];
  };
}

// 3. NOTA CORTA (Staccato - C5 523.25 Hz - 0.75s EXACT)
function generateNoteShort(sampleRate) {
  const f0 = 523.25; // C5
  return (t, i, total) => {
    const dt = t - 0.08;
    if (dt < 0) return [0, 0];
    // Sharp staccato damper cutoff at 0.55s
    const damperEnv = dt > 0.45 ? Math.exp(-(dt - 0.45) * 25) : 1.0;
    const sig = pianoString(dt, f0, 0.95, 0.6) * damperEnv;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.08));
    const out = sig * fade * 0.92;
    return [out * 0.96, out * 0.96];
  };
}

// 4. NOTA LARGA (Tenuto - C5 523.25 Hz sostenida con pedal - 3.5s EXACT)
function generateNoteLong(sampleRate) {
  const f0 = 523.25; // C5
  return (t, i, total) => {
    const dt = t - 0.08;
    if (dt < 0) return [0, 0];
    // Long singing sustain pedal (decayMult = 3.0)
    const sig = pianoString(dt, f0, 0.95, 2.8);
    // Subtle gentle chorusing
    const chorus = Math.sin(2 * Math.PI * (f0 * 1.002) * dt) * Math.exp(-dt * 0.4) * 0.25;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.35));
    const out = (sig + chorus) * fade * 0.88;
    return [out * 0.97, out * 0.95];
  };
}

// 5. NOTA SUAVE (Pianissimo - 20% gain - 3.0s)
function generateNoteSoft(sampleRate) {
  const f0 = 440.0; // A4
  return (t, i, total) => {
    const dt = t - 0.1;
    if (dt < 0) return [0, 0];
    // Very gentle soft touch
    const sig = pianoString(dt, f0, 0.28, 2.0);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = sig * fade * 0.24; // Soft 24%
    return [out * 0.96, out * 0.96];
  };
}

// 6. NOTA FUERTE (Fortissimo - 100% gain - 3.0s)
function generateNoteLoud(sampleRate) {
  // Rich forte chord: A3 + E4 + A4 + C#5
  const notes = [220.0, 329.63, 440.0, 554.37];
  return (t, i, total) => {
    const dt = t - 0.1;
    if (dt < 0) return [0, 0];
    let mono = 0;
    notes.forEach((f0, idx) => {
      mono += pianoString(dt - idx * 0.005, f0, 1.0, 1.8);
    });
    const compressed = Math.tanh(mono * 0.75) * 0.96;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = compressed * fade;
    return [out * 0.98, out * 0.96];
  };
}

// 7. NOTA PREGUNTA (Cadencia melódica ascendente suspensiva: C4 - E4 - G4 - B4)
function generateNoteQuestion(sampleRate) {
  const melody = [
    { time: 0.10, f0: 261.63 }, // C4
    { time: 0.55, f0: 329.63 }, // E4
    { time: 1.00, f0: 392.00 }, // G4
    { time: 1.45, f0: 493.88 }, // B4 (Suspended leading tone questioning "¿?")
  ];
  return (t, i, total) => {
    let left = 0;
    let right = 0;
    melody.forEach((note, idx) => {
      if (t >= note.time) {
        const dt = t - note.time;
        const sig = pianoString(dt, note.f0, 0.85 + idx * 0.05, 1.6);
        const pan = -0.2 + idx * 0.15;
        left += sig * (0.5 - pan * 0.4);
        right += sig * (0.5 + pan * 0.4);
      }
    });
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    return [left * 0.88 * fade, right * 0.88 * fade];
  };
}

// 8. NOTA EXCLAMACIÓN (Cadencia resolutiva triunfal afirmativa: G4 - E4 - Acorde C Mayor "¡!")
function generateNoteExclamation(sampleRate) {
  const steps = [
    { time: 0.10, f0: 392.00, dur: 0.4 }, // G4
    { time: 0.50, f0: 329.63, dur: 0.4 }, // E4
  ];
  const finalChord = [
    { time: 0.95, f0: 261.63, amp: 1.0 }, // C4
    { time: 0.95, f0: 329.63, amp: 0.85 }, // E4
    { time: 0.95, f0: 392.00, amp: 0.9 }, // G4
    { time: 0.95, f0: 523.25, amp: 0.95 }, // C5
  ];
  return (t, i, total) => {
    let left = 0;
    let right = 0;
    steps.forEach((s) => {
      if (t >= s.time) {
        const dt = t - s.time;
        const sig = pianoString(dt, s.f0, 0.9, 1.2);
        left += sig * 0.5;
        right += sig * 0.5;
      }
    });
    finalChord.forEach((c) => {
      if (t >= c.time) {
        const dt = t - c.time;
        const sig = pianoString(dt, c.f0, c.amp, 2.2);
        left += sig * 0.48;
        right += sig * 0.48;
      }
    });
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const compL = Math.tanh(left * 0.85) * 0.95 * fade;
    const compR = Math.tanh(right * 0.85) * 0.95 * fade;
    return [compL, compR];
  };
}

async function main() {
  const sampleRate = 44100;
  console.log('Generating Musical Notes sound bank audio files...');

  await writeMp3('public/audio/nota_aguda.mp3', 3.0, sampleRate, generateNoteHigh(sampleRate));
  console.log('✓ Created public/audio/nota_aguda.mp3 (3.0s - Do Agudo C6)');

  await writeMp3('public/audio/nota_grave.mp3', 3.0, sampleRate, generateNoteLow(sampleRate));
  console.log('✓ Created public/audio/nota_grave.mp3 (3.0s - Do Grave C2)');

  await writeMp3('public/audio/nota_corta.mp3', 0.75, sampleRate, generateNoteShort(sampleRate));
  console.log('✓ Created public/audio/nota_corta.mp3 (0.75s - Staccato Corto)');

  await writeMp3('public/audio/nota_larga.mp3', 3.5, sampleRate, generateNoteLong(sampleRate));
  console.log('✓ Created public/audio/nota_larga.mp3 (3.5s - Tenuto Largo sostenido)');

  await writeMp3('public/audio/nota_suave.mp3', 3.0, sampleRate, generateNoteSoft(sampleRate));
  console.log('✓ Created public/audio/nota_suave.mp3 (3.0s - Pianissimo Suave)');

  await writeMp3('public/audio/nota_fuerte.mp3', 3.0, sampleRate, generateNoteLoud(sampleRate));
  console.log('✓ Created public/audio/nota_fuerte.mp3 (3.0s - Fortissimo Fuerte)');

  await writeMp3('public/audio/nota_pregunta.mp3', 2.5, sampleRate, generateNoteQuestion(sampleRate));
  console.log('✓ Created public/audio/nota_pregunta.mp3 (2.5s - Frase Pregunta Melódica)');

  await writeMp3('public/audio/nota_exclamacion.mp3', 2.5, sampleRate, generateNoteExclamation(sampleRate));
  console.log('✓ Created public/audio/nota_exclamacion.mp3 (2.5s - Frase Exclamación Triunfal)');

  console.log('All musical notes audio generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
