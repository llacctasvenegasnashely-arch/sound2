const fs = require('fs');
const path = require('path');
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
// 1. ELEFANTE: Barrito Real Potente de Elefante Africano (~2.4s)
// Acústica: Ataque impetuoso, barrido tonal 450 -> 680 -> 580 Hz,
// vibrato de trompa a 22 Hz, armónicos metálicos densos y resonancia profunda
// =========================================================================
function genElephantReal(sampleRate) {
  return (t, i, total) => {
    if (t < 0.04 || t > 2.40) return [0, 0];
    const dt = t - 0.04;

    // Frecuencia fundamental del barrito con subida inicial y estabilización
    let f0 = 460 + 220 * Math.sin(Math.min(Math.PI * 0.5, dt * 6.0));
    if (dt > 1.2) {
      f0 -= (dt - 1.2) * 90; // caída suave al final
    }

    // Vibrato y aleteo de trompa característico (21 Hz)
    const trunkFlutter = 1 + 0.08 * Math.sin(2 * Math.PI * 21.5 * dt);
    const flutterF0 = f0 * trunkFlutter;

    // Síntesis armónica con timbre de viento/trompa de elefante
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

    // Subgrave corporal del elefante (85 Hz)
    const subBody = Math.sin(2 * Math.PI * 85 * dt) * 0.45 * Math.exp(-dt * 0.4);

    // Ruido de aire y turbulencia en la trompa
    const airNoise = (Math.random() * 2 - 1) * 0.12 * Math.sin(2 * Math.PI * flutterF0 * 1.5 * dt);

    const fullSound = (sig * 0.85 + subBody + airNoise);

    // Envolvente de amplitud: ataque rápido de trompeta (0.08s), sostenido vibrante y decaimiento
    const attack = Math.min(1.0, dt / 0.08);
    const decay = dt > 1.5 ? Math.exp(-(dt - 1.5) * 2.2) : 1.0;
    const fadeEnd = Math.min(1.0, (total - i) / (sampleRate * 0.08));

    const out = Math.tanh(fullSound * 1.35) * attack * decay * fadeEnd * 0.98;
    return [out * 0.98, out * 0.96];
  };
}

// =========================================================================
// 2. RANA TORO: Croar Grave Profundo Real ("Waaa-Rroouum / Jug-o-rum") (~1.4s)
// Acústica: Frecuencia muy baja 95-115 Hz, modulación pulsátil de saco vocal (52 Hz),
// formantes oscuros cavernosos y resonancia acuática
// =========================================================================
function genBullfrogReal(sampleRate) {
  return (t, i, total) => {
    if (t < 0.05 || t > 1.35) return [0, 0];
    const dt = t - 0.05;

    // Frecuencia inicial con flexión gutural (160 Hz -> 98 Hz)
    const f0 = 98 + 65 * Math.exp(-dt * 6.0);

    // Tren de pulsos del saco vocal (ronquido característico de rana toro a 48 Hz)
    const vocalPulse = Math.sin(2 * Math.PI * 48 * dt) > 0.0 ? 1.0 : -0.35;

    // Formantes del saco resonador: 100 Hz, 240 Hz, 480 Hz
    const f1 = Math.sin(2 * Math.PI * f0 * dt) * 0.95;
    const f2 = Math.sin(2 * Math.PI * f0 * 2.4 * dt) * 0.55;
    const f3 = Math.sin(2 * Math.PI * f0 * 4.8 * dt) * 0.30;
    const gravel = (Math.random() * 2 - 1) * 0.08 * (Math.sin(2 * Math.PI * f0 * dt) > 0 ? 1 : 0);

    const sig = (f1 + f2 + f3 + gravel) * (0.65 + 0.35 * vocalPulse);

    // Envolvente tipo "Waaa-roooum": ataque inflado (0.15s), pico y descenso cavernoso
    const attack = Math.min(1.0, dt / 0.15);
    const decay = Math.exp(-dt * 1.25);
    const fadeEnd = Math.min(1.0, (total - i) / (sampleRate * 0.06));

    const out = Math.tanh(sig * 1.45) * attack * decay * fadeEnd * 0.96;
    return [out * 0.97, out * 0.98];
  };
}

// =========================================================================
// 3. PATO: Graznido Real "¡Cuac, Cuac, Cuac!" (~1.6s)
// Acústica: Ráfaga nasal de 3 graznidos rítmicos reales de pato con
// formantes de pico (850 Hz y 1700 Hz) y ataque seco
// =========================================================================
function singleQuack(tQuack) {
  if (tQuack < 0 || tQuack > 0.32) return 0;
  // Frecuencia fundamental nasal ~250 Hz
  const f0 = 250 + 40 * Math.sin(Math.min(Math.PI, tQuack * 10));
  // Resonancia de pico de pato (formantes nasales)
  const form1 = Math.sin(2 * Math.PI * f0 * tQuack) * 0.8;
  const form2 = Math.sin(2 * Math.PI * 840 * tQuack) * 0.75;
  const form3 = Math.sin(2 * Math.PI * 1680 * tQuack) * 0.45;
  const rasp = (Math.random() * 2 - 1) * 0.15;

  const quackSig = (form1 + form2 + form3 + rasp);
  // Envolvente rápida y seca: 25ms ataque, 280ms decaimiento
  const attack = Math.min(1.0, tQuack / 0.025);
  const decay = Math.exp(-tQuack * 8.5);
  return Math.tanh(quackSig * 1.3) * attack * decay;
}

function genDuckReal(sampleRate) {
  return (t, i, total) => {
    // 3 graznidos sucesivos vivos: t=0.06s, t=0.48s, t=0.92s
    let sig = 0;
    if (t >= 0.06 && t < 0.42) {
      sig += singleQuack(t - 0.06) * 0.95;
    }
    if (t >= 0.48 && t < 0.84) {
      sig += singleQuack(t - 0.48) * 1.0;
    }
    if (t >= 0.92 && t < 1.30) {
      sig += singleQuack(t - 0.92) * 0.88;
    }

    const fadeEnd = Math.min(1.0, (total - i) / (sampleRate * 0.05));
    const out = sig * fadeEnd * 0.96;
    return [out * 0.97, out * 0.97];
  };
}

async function main() {
  console.log('Generating updated real animal audio for: elefante, rana_toro, pato...');

  await writeMp3('public/audio/elefante.mp3', 2.45, SR, genElephantReal(SR));
  console.log('Generated public/audio/elefante.mp3');

  await writeMp3('public/audio/rana_toro.mp3', 1.40, SR, genBullfrogReal(SR));
  console.log('Generated public/audio/rana_toro.mp3');

  await writeMp3('public/audio/pato.mp3', 1.50, SR, genDuckReal(SR));
  console.log('Generated public/audio/pato.mp3');

  // Copy to dist/audio if dist exists
  const distDir = path.resolve('dist/audio');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync('public/audio/elefante.mp3', path.join(distDir, 'elefante.mp3'));
    fs.copyFileSync('public/audio/rana_toro.mp3', path.join(distDir, 'rana_toro.mp3'));
    fs.copyFileSync('public/audio/pato.mp3', path.join(distDir, 'pato.mp3'));
    console.log('Copied updated files to dist/audio/');
  }

  console.log('All 3 real animal sounds updated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
