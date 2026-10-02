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

const SR = 44100;

// =========================================================================
// 1. INSTRUMENTS LEVEL 2 & LEVEL 3
// =========================================================================

// L2 Freq Agudo: Flauta Dulce (A5 1760 Hz con aire y vibrato, 3.0s)
function genFluteHigh(sampleRate) {
  return (t, i, total) => {
    if (t < 0.08) return [0, 0];
    const dt = t - 0.08;
    const vib = 1 + 0.015 * Math.sin(2 * Math.PI * 5.5 * dt);
    const f0 = 1760 * vib;
    const breath = (Math.random() * 2 - 1) * Math.exp(-dt * 0.5) * 0.08;
    const sig = (
      Math.sin(2 * Math.PI * f0 * dt) * 0.8 +
      Math.sin(2 * Math.PI * f0 * 2 * dt) * 0.25 +
      Math.sin(2 * Math.PI * f0 * 3 * dt) * 0.1 +
      breath
    ) * Math.min(1, dt / 0.12) * Math.exp(-dt * 0.35);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = sig * 0.9 * fade;
    return [out * 0.95, out * 0.98];
  };
}

// L2 Freq Grave: Tuba / Contrabajo (F1 43.6 Hz + C2 65.4 Hz, 3.0s)
function genTubaLow(sampleRate) {
  return (t, i, total) => {
    if (t < 0.08) return [0, 0];
    const dt = t - 0.08;
    const f0 = 55.0; // A1
    const sig = (
      Math.sin(2 * Math.PI * f0 * dt) * 0.85 +
      Math.sin(2 * Math.PI * f0 * 2 * dt) * 0.6 +
      Math.sin(2 * Math.PI * f0 * 3 * dt) * 0.35 +
      Math.sin(2 * Math.PI * f0 * 4 * dt) * 0.2
    ) * Math.min(1, dt / 0.08) * Math.exp(-dt * 0.4);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(sig * 1.1) * 0.95 * fade;
    return [out * 0.98, out * 0.95];
  };
}

// L3 Freq Agudo: Campana / Triángulo (D6 2349 Hz con brillo metálico, 3.0s)
function genBellHigh(sampleRate) {
  return (t, i, total) => {
    if (t < 0.05) return [0, 0];
    const dt = t - 0.05;
    const click = (Math.random() * 2 - 1) * Math.exp(-dt * 300) * 0.3;
    const modes = [
      { f: 2349.3, d: 1.2, a: 0.75 },
      { f: 4698.6, d: 2.5, a: 0.35 },
      { f: 6820.0, d: 4.5, a: 0.2 },
      { f: 9120.0, d: 6.0, a: 0.15 },
    ];
    let sig = click;
    modes.forEach((m) => {
      sig += Math.sin(2 * Math.PI * m.f * dt) * Math.exp(-dt * m.d) * m.a;
    });
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = sig * 0.9 * fade;
    return [out * 0.96, out * 0.98];
  };
}

// L3 Freq Grave: Timbal orquestal (D2 73.4 Hz, 3.0s)
function genTimpaniLow(sampleRate) {
  return (t, i, total) => {
    if (t < 0.06) return [0, 0];
    const dt = t - 0.06;
    const thud = Math.sin(2 * Math.PI * 180 * dt) * Math.exp(-dt * 60) * 0.45;
    const pitchDrop = 73.4 + 25 * Math.exp(-dt * 20);
    const sig = (
      Math.sin(2 * Math.PI * pitchDrop * dt) * 0.9 * Math.exp(-dt * 1.1) +
      Math.sin(2 * Math.PI * pitchDrop * 1.5 * dt) * 0.45 * Math.exp(-dt * 2.2) +
      Math.sin(2 * Math.PI * pitchDrop * 2.1 * dt) * 0.25 * Math.exp(-dt * 3.5) +
      thud
    );
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(sig * 1.1) * 0.95 * fade;
    return [out * 0.98, out * 0.95];
  };
}

// L2 Dur Corto: Maraca seca (0.7s)
function genMaracaShort(sampleRate) {
  return (t, i, total) => {
    if (t < 0.05 || t > 0.65) return [0, 0];
    const dt = t - 0.05;
    const shake1 = (Math.random() * 2 - 1) * Math.exp(-Math.pow((dt - 0.1) * 35, 2)) * 0.8;
    const shake2 = (Math.random() * 2 - 1) * Math.exp(-Math.pow((dt - 0.3) * 40, 2)) * 0.95;
    const sig = (shake1 + shake2) * Math.sin(2 * Math.PI * 3200 * dt);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.05));
    const out = sig * fade * 0.95;
    return [out * 0.96, out * 0.98];
  };
}

// L2 Dur Largo: Violín orquestal legato (4.0s)
function genViolinLong(sampleRate) {
  return (t, i, total) => {
    if (t < 0.08) return [0, 0];
    const dt = t - 0.08;
    const vib = 1 + 0.012 * Math.sin(2 * Math.PI * 6.0 * dt);
    const f0 = 440 * vib; // A4
    const sig = (
      Math.sin(2 * Math.PI * f0 * dt) * 0.7 +
      Math.sin(2 * Math.PI * f0 * 2 * dt) * 0.45 +
      Math.sin(2 * Math.PI * f0 * 3 * dt) * 0.3 +
      Math.sin(2 * Math.PI * f0 * 4 * dt) * 0.2 +
      Math.sin(2 * Math.PI * f0 * 5 * dt) * 0.15
    ) * Math.min(1, dt / 0.35) * Math.exp(-dt * 0.15);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.4));
    const out = sig * 0.88 * fade;
    return [out * 0.96, out * 0.98];
  };
}

// L3 Dur Corto: Claves de madera (0.6s)
function genClavesShort(sampleRate) {
  return (t, i, total) => {
    if (t < 0.05 || t > 0.55) return [0, 0];
    const dt = t - 0.05;
    const click = Math.exp(-dt * 120);
    const sig = (
      Math.sin(2 * Math.PI * 2480 * dt) * 0.7 +
      Math.sin(2 * Math.PI * 4960 * dt) * 0.3 +
      (Math.random() * 2 - 1) * 0.2
    ) * click;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.05));
    const out = sig * fade * 0.95;
    return [out * 0.98, out * 0.96];
  };
}

// L3 Dur Largo: Órgano de tubos (4.0s)
function genOrganLong(sampleRate) {
  return (t, i, total) => {
    if (t < 0.08) return [0, 0];
    const dt = t - 0.08;
    const f0 = 261.63; // C4 + Octaves
    const sig = (
      Math.sin(2 * Math.PI * f0 * dt) * 0.65 +
      Math.sin(2 * Math.PI * (f0 * 2) * dt) * 0.5 +
      Math.sin(2 * Math.PI * (f0 * 3) * dt) * 0.3 +
      Math.sin(2 * Math.PI * (f0 * 4) * dt) * 0.25 +
      Math.sin(2 * Math.PI * (f0 / 2) * dt) * 0.4
    ) * Math.min(1, dt / 0.15);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.35));
    const out = Math.tanh(sig * 0.9) * 0.9 * fade;
    return [out * 0.97, out * 0.96];
  };
}

// L2 Intensity Suave: Caja de música (20% volumen, 3.0s)
function genMusicBoxSoft(sampleRate) {
  const notes = [
    { t: 0.1, f: 1046.5 },
    { t: 0.5, f: 1318.5 },
    { t: 0.9, f: 1567.9 },
  ];
  return (t, i, total) => {
    let sig = 0;
    notes.forEach((n) => {
      if (t >= n.t) {
        const dt = t - n.t;
        sig += (Math.sin(2 * Math.PI * n.f * dt) * 0.8 + Math.sin(2 * Math.PI * n.f * 2 * dt) * 0.2) * Math.exp(-dt * 2.5);
      }
    });
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = sig * 0.22 * fade; // 22% volumen
    return [out * 0.96, out * 0.98];
  };
}

// L2 Intensity Fuerte: Trompeta brillante (100% volumen, 3.0s)
function genTrumpetLoud(sampleRate) {
  return (t, i, total) => {
    if (t < 0.08) return [0, 0];
    const dt = t - 0.08;
    const f0 = 587.33; // D5
    let sig = 0;
    for (let h = 1; h <= 8; h++) {
      sig += Math.sin(2 * Math.PI * (f0 * h) * dt) * (1 / Math.pow(h, 0.85));
    }
    const env = Math.min(1, dt / 0.08) * Math.exp(-dt * 0.25);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(sig * env * 1.2) * 0.98 * fade; // 100% volumen fuerte
    return [out * 0.98, out * 0.96];
  };
}

// L3 Intensity Suave: Kalimba / Marimba suave (20% volumen, 3.0s)
function genKalimbaSoft(sampleRate) {
  return (t, i, total) => {
    if (t < 0.1) return [0, 0];
    const dt = t - 0.1;
    const f0 = 440.0;
    const sig = (Math.sin(2 * Math.PI * f0 * dt) * 0.85 + Math.sin(2 * Math.PI * f0 * 3 * dt) * 0.15) * Math.exp(-dt * 1.5);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = sig * 0.24 * fade; // 24% volumen suave
    return [out * 0.96, out * 0.96];
  };
}

// L3 Intensity Fuerte: Batería y platillo crash (100% volumen, 3.0s)
function genDrumsLoud(sampleRate) {
  return (t, i, total) => {
    if (t < 0.06) return [0, 0];
    const dt = t - 0.06;
    const kick = Math.sin(2 * Math.PI * (120 * Math.exp(-dt * 25) + 50) * dt) * Math.exp(-dt * 2.0) * 1.0;
    const snareNoise = (Math.random() * 2 - 1) * Math.exp(-dt * 4.0) * 0.85;
    const crash = (Math.random() * 2 - 1) * Math.sin(2 * Math.PI * 4500 * dt) * Math.exp(-dt * 1.2) * 0.75;
    const sig = kick + snareNoise + crash;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(sig * 1.2) * 0.98 * fade;
    return [out * 0.98, out * 0.96];
  };
}

// =========================================================================
// 2. ANIMALS LEVEL 2 & LEVEL 3
// =========================================================================

// L2 Freq Agudo: Grillo nocturno (4.5 kHz trino rítmico, 3.0s)
function genCricketHigh(sampleRate) {
  return (t, i, total) => {
    const pulse = Math.sin(2 * Math.PI * 28 * t) > 0.2 ? 1 : 0;
    const sig = Math.sin(2 * Math.PI * 4500 * t) * pulse * 0.75;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = sig * fade * 0.88;
    return [out * 0.96, out * 0.98];
  };
}

// L2 Freq Grave: Rana Toro (croar muy grave y cavernoso real, 1.4s)
function genBullfrogLow(sampleRate) {
  return (t, i, total) => {
    if (t < 0.05 || t > 1.35) return [0, 0];
    const dt = t - 0.05;
    const f0 = 98 + 65 * Math.exp(-dt * 6.0);
    const vocalPulse = Math.sin(2 * Math.PI * 48 * dt) > 0.0 ? 1.0 : -0.35;
    const f1 = Math.sin(2 * Math.PI * f0 * dt) * 0.95;
    const f2 = Math.sin(2 * Math.PI * f0 * 2.4 * dt) * 0.55;
    const f3 = Math.sin(2 * Math.PI * f0 * 4.8 * dt) * 0.30;
    const gravel = (Math.random() * 2 - 1) * 0.08 * (Math.sin(2 * Math.PI * f0 * dt) > 0 ? 1 : 0);
    const sig = (f1 + f2 + f3 + gravel) * (0.65 + 0.35 * vocalPulse);
    const attack = Math.min(1.0, dt / 0.15);
    const decay = Math.exp(-dt * 1.25);
    const fadeEnd = Math.min(1.0, (total - i) / (sampleRate * 0.06));
    const out = Math.tanh(sig * 1.45) * attack * decay * fadeEnd * 0.96;
    return [out * 0.97, out * 0.98];
  };
}

// L3 Freq Agudo: Delfín silbidos (6.0 kHz, 3.0s)
function genDolphinHigh(sampleRate) {
  return (t, i, total) => {
    const chirpFreq = 5200 + 1800 * Math.sin(2 * Math.PI * 3.5 * t);
    const click = Math.sin(2 * Math.PI * 40 * t) > 0.85 ? (Math.random() * 2 - 1) * 0.4 : 0;
    const sig = Math.sin(2 * Math.PI * chirpFreq * t) * 0.7 + click;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = sig * fade * 0.88;
    return [out * 0.95, out * 0.98];
  };
}

// L3 Freq Grave: León rugido profundo (95 Hz con sub, 3.0s)
function genLionLow(sampleRate) {
  return (t, i, total) => {
    if (t < 0.1) return [0, 0];
    const dt = t - 0.1;
    const growlNoise = (Math.random() * 2 - 1) * Math.sin(2 * Math.PI * 95 * dt) * 0.75;
    const sub = Math.sin(2 * Math.PI * 65 * dt) * 0.8;
    const roar = (growlNoise + sub) * Math.min(1, dt / 0.2) * Math.exp(-dt * 0.2);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.3));
    const out = Math.tanh(roar * 1.3) * 0.98 * fade;
    return [out * 0.98, out * 0.95];
  };
}

// L2 Dur Corto: Pato graznido real "¡Cuac, cuac, cuac!" (1.5s)
function singleQuack(tQuack) {
  if (tQuack < 0 || tQuack > 0.32) return 0;
  const f0 = 250 + 40 * Math.sin(Math.min(Math.PI, tQuack * 10));
  const form1 = Math.sin(2 * Math.PI * f0 * tQuack) * 0.8;
  const form2 = Math.sin(2 * Math.PI * 840 * tQuack) * 0.75;
  const form3 = Math.sin(2 * Math.PI * 1680 * tQuack) * 0.45;
  const rasp = (Math.random() * 2 - 1) * 0.15;
  const quackSig = (form1 + form2 + form3 + rasp);
  const attack = Math.min(1.0, tQuack / 0.025);
  const decay = Math.exp(-tQuack * 8.5);
  return Math.tanh(quackSig * 1.3) * attack * decay;
}

function genDuckShort(sampleRate) {
  return (t, i, total) => {
    let sig = 0;
    if (t >= 0.06 && t < 0.42) sig += singleQuack(t - 0.06) * 0.95;
    if (t >= 0.48 && t < 0.84) sig += singleQuack(t - 0.48) * 1.0;
    if (t >= 0.92 && t < 1.30) sig += singleQuack(t - 0.92) * 0.88;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.05));
    return [sig * fade * 0.97, sig * fade * 0.97];
  };
}

// L2 Dur Largo: Lobo aullido "¡Auuuuu!" (3.5s)
function genWolfLong(sampleRate) {
  return (t, i, total) => {
    if (t < 0.1) return [0, 0];
    const dt = t - 0.1;
    const howlPitch = 240 + 160 * Math.sin(Math.min(Math.PI, dt * 1.1));
    const sig = (
      Math.sin(2 * Math.PI * howlPitch * dt) * 0.8 +
      Math.sin(2 * Math.PI * (howlPitch * 2) * dt) * 0.35 +
      (Math.random() * 2 - 1) * 0.08
    ) * Math.min(1, dt / 0.4) * Math.exp(-dt * 0.15);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.35));
    const out = sig * fade * 0.92;
    return [out * 0.96, out * 0.98];
  };
}

// L3 Dur Corto: Rana "¡Croac!" rápido (0.6s)
function genFrogShort(sampleRate) {
  return (t, i, total) => {
    if (t < 0.06 || t > 0.55) return [0, 0];
    const dt = t - 0.06;
    const ratchet = Math.sin(2 * Math.PI * 45 * dt) > 0 ? 1 : -0.5;
    const sig = Math.sin(2 * Math.PI * 220 * dt) * ratchet * Math.exp(-dt * 7.0);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.05));
    const out = Math.tanh(sig * 1.2) * 0.92 * fade;
    return [out * 0.96, out * 0.96];
  };
}

// L3 Dur Largo: Ballena marina canto sostenido (3.5s)
function genWhaleLong(sampleRate) {
  return (t, i, total) => {
    if (t < 0.1) return [0, 0];
    const dt = t - 0.1;
    const pitch = 140 + 80 * Math.sin(2 * Math.PI * 0.45 * dt);
    const sig = (
      Math.sin(2 * Math.PI * pitch * dt) * 0.85 +
      Math.sin(2 * Math.PI * pitch * 2 * dt) * 0.4
    ) * Math.min(1, dt / 0.5) * Math.exp(-dt * 0.1);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.35));
    const out = sig * fade * 0.92;
    return [out * 0.98, out * 0.96];
  };
}

// L2 Intensity Suave: Pajarito suave gorjeo (20% volumen, 3.0s)
function genBirdSoft(sampleRate) {
  return (t, i, total) => {
    const trill = 3200 + 400 * Math.sin(2 * Math.PI * 18 * t);
    const burst = Math.sin(2 * Math.PI * 2.2 * t) > 0.3 ? 1 : 0;
    const sig = Math.sin(2 * Math.PI * trill * t) * burst * 0.22; // 22% suave
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = sig * fade;
    return [out * 0.96, out * 0.98];
  };
}

// L2 Intensity Fuerte: Elefante barrito potente real (2.4s)
function genElephantLoud(sampleRate) {
  return (t, i, total) => {
    if (t < 0.04 || t > 2.40) return [0, 0];
    const dt = t - 0.04;
    let f0 = 460 + 220 * Math.sin(Math.min(Math.PI * 0.5, dt * 6.0));
    if (dt > 1.2) f0 -= (dt - 1.2) * 90;
    const trunkFlutter = 1 + 0.08 * Math.sin(2 * Math.PI * 21.5 * dt);
    const flutterF0 = f0 * trunkFlutter;

    let sig = 0;
    const harmonics = [
      { n: 1, a: 0.90 },
      { n: 2, a: 0.75 },
      { n: 3, a: 0.60 },
      { n: 4, a: 0.45 },
      { n: 5, a: 0.35 },
      { n: 6, a: 0.25 },
      { n: 7, a: 0.18 },
    ];
    harmonics.forEach(({ n, a }) => {
      sig += Math.sin(2 * Math.PI * flutterF0 * n * dt) * a;
    });

    const subBody = Math.sin(2 * Math.PI * 85 * dt) * 0.45 * Math.exp(-dt * 0.4);
    const airNoise = (Math.random() * 2 - 1) * 0.12 * Math.sin(2 * Math.PI * flutterF0 * 1.5 * dt);
    const fullSound = (sig * 0.85 + subBody + airNoise);

    const attack = Math.min(1.0, dt / 0.08);
    const decay = dt > 1.5 ? Math.exp(-(dt - 1.5) * 2.2) : 1.0;
    const fadeEnd = Math.min(1.0, (total - i) / (sampleRate * 0.08));

    const out = Math.tanh(fullSound * 1.35) * attack * decay * fadeEnd * 0.98;
    return [out * 0.98, out * 0.96];
  };
}

// L3 Intensity Suave: Abeja zumbido suave (20% volumen, 3.0s)
function genBeeSoft(sampleRate) {
  return (t, i, total) => {
    const f0 = 240.0;
    const buzz = (
      Math.sin(2 * Math.PI * f0 * t) * 0.5 +
      Math.sin(2 * Math.PI * (f0 * 2) * t) * 0.35 +
      Math.sin(2 * Math.PI * (f0 * 3) * t) * 0.2
    ) * 0.22; // 22% suave
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = buzz * fade;
    return [out * 0.96, out * 0.96];
  };
}

// L3 Intensity Fuerte: Oso pardo gruñido (100% volumen, 3.0s)
function genBearLoud(sampleRate) {
  return (t, i, total) => {
    if (t < 0.1) return [0, 0];
    const dt = t - 0.1;
    const roar = (
      Math.sin(2 * Math.PI * 75 * dt) * 0.8 +
      (Math.random() * 2 - 1) * Math.sin(2 * Math.PI * 140 * dt) * 0.85
    ) * Math.min(1, dt / 0.15) * Math.exp(-dt * 0.2);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(roar * 1.3) * 0.98 * fade; // 100% fuerte
    return [out * 0.98, out * 0.95];
  };
}

// =========================================================================
// 3. MUSICAL NOTES LEVEL 2 & LEVEL 3
// =========================================================================
function pianoNote(t, f0, vel = 1.0, decayMult = 1.0, isHighChild = false) {
  if (t < 0) return 0;
  let s = 0;
  const numPartials = isHighChild ? 2 : 6;
  for (let n = 1; n <= numPartials; n++) {
    const power = isHighChild ? 2.0 : 1.1;
    s += Math.sin(2 * Math.PI * f0 * n * t) * (1 / Math.pow(n, power)) * Math.exp(-t * (1.2 * n / decayMult));
  }
  return s * vel;
}

// L2 Freq: Sol Agudo (Calibrado a 600 Hz) vs Mi Grave (E2 82 Hz) - Calibrado suave para niño de 8 años
function genSolHigh(sampleRate) {
  return (t, i, total) => {
    const attackRamp = Math.min(1.0, Math.max(0, (t - 0.08) / 0.04));
    const s = pianoNote(t - 0.08, 600.0, 0.48, 2.2, true) * attackRamp;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.3));
    const out = s * fade * 0.58;
    return [out * 0.95, out * 0.95];
  };
}
function genMiLow(sampleRate) {
  return (t, i, total) => {
    const s = pianoNote(t - 0.08, 82.41, 1.05, 1.5);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(s * 1.1) * 0.95 * fade;
    return [out * 0.98, out * 0.95];
  };
}

// L3 Freq: Si Agudo (Calibrado a 600 Hz) vs La Grave (A1 55 Hz) - Calibrado suave para niño de 8 años
function genSiHigh(sampleRate) {
  return (t, i, total) => {
    const attackRamp = Math.min(1.0, Math.max(0, (t - 0.08) / 0.04));
    const s = pianoNote(t - 0.08, 600.0, 0.45, 2.0, true) * attackRamp;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.3));
    const out = s * fade * 0.55;
    return [out * 0.95, out * 0.95];
  };
}
function genLaLow(sampleRate) {
  return (t, i, total) => {
    const s = pianoNote(t - 0.08, 55.00, 1.1, 1.5);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(s * 1.15) * 0.95 * fade;
    return [out * 0.98, out * 0.95];
  };
}

// L2 Dur: Re Staccato (0.65s) vs Re Tenuto (3.5s)
function genReStaccato(sampleRate) {
  return (t, i, total) => {
    const dt = t - 0.06;
    if (dt < 0) return [0, 0];
    const cut = dt > 0.45 ? Math.exp(-(dt - 0.45) * 28) : 1;
    const s = pianoNote(dt, 587.33, 0.95, 0.6) * cut;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.06));
    const out = s * fade * 0.92;
    return [out * 0.96, out * 0.96];
  };
}
function genReTenuto(sampleRate) {
  return (t, i, total) => {
    const dt = t - 0.08;
    if (dt < 0) return [0, 0];
    const s = pianoNote(dt, 587.33, 0.92, 2.8);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.35));
    const out = s * fade * 0.88;
    return [out * 0.96, out * 0.96];
  };
}

// L3 Dur: Fa Staccato (0.65s) vs Fa Tenuto (4.0s)
function genFaStaccato(sampleRate) {
  return (t, i, total) => {
    const dt = t - 0.06;
    if (dt < 0) return [0, 0];
    const cut = dt > 0.45 ? Math.exp(-(dt - 0.45) * 28) : 1;
    const s = pianoNote(dt, 698.46, 0.95, 0.6) * cut;
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.06));
    const out = s * fade * 0.92;
    return [out * 0.96, out * 0.96];
  };
}
function genFaTenuto(sampleRate) {
  return (t, i, total) => {
    const dt = t - 0.08;
    if (dt < 0) return [0, 0];
    const s = pianoNote(dt, 349.23, 0.95, 3.2); // F4 Major chord
    const s2 = pianoNote(dt, 440.0, 0.7, 3.2);
    const s3 = pianoNote(dt, 523.25, 0.8, 3.2);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.35));
    const out = (s + s2 + s3) * 0.5 * fade;
    return [out * 0.96, out * 0.96];
  };
}

// L2 Intensity: Mi Pianissimo (20%) vs Mi Fortissimo (100%)
function genMiSoft(sampleRate) {
  return (t, i, total) => {
    const s = pianoNote(t - 0.08, 329.63, 0.28, 2.0);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = s * 0.24 * fade;
    return [out * 0.96, out * 0.96];
  };
}
function genMiLoud(sampleRate) {
  return (t, i, total) => {
    const dt = t - 0.08;
    if (dt < 0) return [0, 0];
    const s = pianoNote(dt, 164.81, 1.0, 2.0) + pianoNote(dt, 246.94, 0.85, 2.0) + pianoNote(dt, 329.63, 0.9, 2.0);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(s * 0.75) * 0.96 * fade;
    return [out * 0.98, out * 0.96];
  };
}

// L3 Intensity: Sol Pianissimo (20%) vs Sol Fortissimo (100%)
function genSolSoft(sampleRate) {
  return (t, i, total) => {
    const s = pianoNote(t - 0.08, 392.00, 0.28, 2.0);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.2));
    const out = s * 0.24 * fade;
    return [out * 0.96, out * 0.96];
  };
}
function genSolLoud(sampleRate) {
  return (t, i, total) => {
    const dt = t - 0.08;
    if (dt < 0) return [0, 0];
    const s = pianoNote(dt, 196.00, 1.0, 2.0) + pianoNote(dt, 293.66, 0.85, 2.0) + pianoNote(dt, 392.00, 0.9, 2.0);
    const fade = Math.min(1.0, (total - i) / (sampleRate * 0.25));
    const out = Math.tanh(s * 0.75) * 0.96 * fade;
    return [out * 0.98, out * 0.96];
  };
}

async function main() {
  console.log('Generating instruments, animals, and notes audio for Levels 2 and 3...');

  // Instruments L2 & L3
  await writeMp3('public/audio/flauta_aguda.mp3', 3.0, SR, genFluteHigh(SR));
  await writeMp3('public/audio/tuba_grave.mp3', 3.0, SR, genTubaLow(SR));
  await writeMp3('public/audio/campana_aguda.mp3', 3.0, SR, genBellHigh(SR));
  await writeMp3('public/audio/timbal_grave.mp3', 3.0, SR, genTimpaniLow(SR));

  await writeMp3('public/audio/maraca_corta.mp3', 0.7, SR, genMaracaShort(SR));
  await writeMp3('public/audio/violin_largo.mp3', 4.0, SR, genViolinLong(SR));
  await writeMp3('public/audio/claves_cortas.mp3', 0.6, SR, genClavesShort(SR));
  await writeMp3('public/audio/organo_largo.mp3', 4.0, SR, genOrganLong(SR));

  await writeMp3('public/audio/caja_musica_suave.mp3', 3.0, SR, genMusicBoxSoft(SR));
  await writeMp3('public/audio/trompeta_fuerte.mp3', 3.0, SR, genTrumpetLoud(SR));
  await writeMp3('public/audio/kalimba_suave.mp3', 3.0, SR, genKalimbaSoft(SR));
  await writeMp3('public/audio/bateria_fuerte.mp3', 3.0, SR, genDrumsLoud(SR));

  // Animals L2 & L3
  await writeMp3('public/audio/grillo.mp3', 3.0, SR, genCricketHigh(SR));
  await writeMp3('public/audio/rana_toro.mp3', 3.0, SR, genBullfrogLow(SR));
  await writeMp3('public/audio/delfin.mp3', 3.0, SR, genDolphinHigh(SR));
  await writeMp3('public/audio/leon.mp3', 3.0, SR, genLionLow(SR));

  await writeMp3('public/audio/pato.mp3', 0.7, SR, genDuckShort(SR));
  await writeMp3('public/audio/lobo.mp3', 3.5, SR, genWolfLong(SR));
  await writeMp3('public/audio/rana.mp3', 0.6, SR, genFrogShort(SR));
  await writeMp3('public/audio/ballena.mp3', 3.5, SR, genWhaleLong(SR));

  await writeMp3('public/audio/pajarito_suave.mp3', 3.0, SR, genBirdSoft(SR));
  await writeMp3('public/audio/elefante.mp3', 3.0, SR, genElephantLoud(SR));
  await writeMp3('public/audio/abeja.mp3', 3.0, SR, genBeeSoft(SR));
  await writeMp3('public/audio/oso.mp3', 3.0, SR, genBearLoud(SR));

  // Notes L2 & L3
  await writeMp3('public/audio/nota_sol_agudo.mp3', 3.0, SR, genSolHigh(SR));
  await writeMp3('public/audio/nota_mi_grave.mp3', 3.0, SR, genMiLow(SR));
  await writeMp3('public/audio/nota_si_agudo.mp3', 3.0, SR, genSiHigh(SR));
  await writeMp3('public/audio/nota_la_grave.mp3', 3.0, SR, genLaLow(SR));

  await writeMp3('public/audio/nota_re_staccato.mp3', 0.65, SR, genReStaccato(SR));
  await writeMp3('public/audio/nota_re_tenuto.mp3', 3.5, SR, genReTenuto(SR));
  await writeMp3('public/audio/nota_fa_staccato.mp3', 0.65, SR, genFaStaccato(SR));
  await writeMp3('public/audio/nota_fa_tenuto.mp3', 4.0, SR, genFaTenuto(SR));

  await writeMp3('public/audio/nota_mi_pianissimo.mp3', 3.0, SR, genMiSoft(SR));
  await writeMp3('public/audio/nota_mi_fortissimo.mp3', 3.0, SR, genMiLoud(SR));
  await writeMp3('public/audio/nota_sol_pianissimo.mp3', 3.0, SR, genSolSoft(SR));
  await writeMp3('public/audio/nota_sol_fortissimo.mp3', 3.0, SR, genSolLoud(SR));

  console.log('All instrument, animal, and note audio for levels 2 and 3 generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
