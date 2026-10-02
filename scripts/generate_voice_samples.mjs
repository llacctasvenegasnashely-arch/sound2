import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const VOICE_TASKS = [
  {
    filename: 'public/audio/voz_nina_agudo.mp3',
    // Sonido Agudo: Voz de una Niña pequeña diciendo la vocal "¡Aaa!" de forma alegre (tono alto)
    prompt: '¡Aaa! ¡Aaa! ¡Aaa!',
    voiceName: 'Kore',
    description: 'Voz de Niña aguda alegre',
  },
  {
    filename: 'public/audio/voz_hombre_grave.mp3',
    // Sonido Grave: Voz de un Hombre adulto diciendo la vocal "Ooo..." con tono profundo y grave
    prompt: 'Ooo... Ooo... Ooo...',
    voiceName: 'Fenrir',
    description: 'Voz de Hombre grave y profundo',
  },
  {
    filename: 'public/audio/voz_corta_sol.mp3',
    // Sonido Corto: Una voz pronunciando una monosílaba seca y rápida: "¡Sol!"
    prompt: '¡Sol! ¡Sol! ¡Sol!',
    voiceName: 'Puck',
    description: 'Palabra corta seca Sol',
  },
  {
    filename: 'public/audio/voz_larga_hola.mp3',
    // Sonido Largo: Una voz alargando progresivamente las vocales: "¡Holaaaaa!"
    prompt: '¡Holaaaaa! ¡Holaaaaa!',
    voiceName: 'Aoede',
    description: 'Palabra larga Holaaaaa sostenida',
  },
  {
    filename: 'public/audio/voz_susurro_suave.mp3',
    // Sonido Suave: Voz femenina diciendo en susurro suave: "shh... secreto..."
    prompt: 'shh... secreto... shh... secreto...',
    voiceName: 'Kore',
    description: 'Susurro suave shh secreto',
  },
  {
    filename: 'public/audio/voz_fuerte_aqui.mp3',
    // Sonido Fuerte: Voz con entusiasmo y volumen alto: "¡AQUÍ!"
    prompt: '¡AQUÍ! ¡AQUÍ!',
    voiceName: 'Fenrir',
    description: 'Voz fuerte entusiasta AQUÍ',
  },
  {
    filename: 'public/audio/voz_pregunta_si.mp3',
    // Tono Pregunta: Voz con entonación ascendente ("¿Sí...?")
    prompt: '¿Sí...? ¿Sí...?',
    voiceName: 'Puck',
    description: 'Pregunta ascendente ¿Sí...?',
  },
  {
    filename: 'public/audio/voz_exclamacion_si.mp3',
    // Tono Afirmativo/Exclamativo: Voz con entonación firme o entusiasta ("¡Sí!")
    prompt: '¡Sí! ¡Sí!',
    voiceName: 'Charon',
    description: 'Exclamación firme ¡Sí!',
  },
];

function processWithFfmpeg(inputWav, outputMp3, targetDuration = 3.0) {
  return new Promise((resolve, reject) => {
    // Make sure output is exactly >= 3.0s with 0.3s fade-out at end, 44.1kHz 16bit mp3
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-i', inputWav,
      '-af', `apad=whole_dur=${targetDuration},atrim=0:${targetDuration},afade=t=out:st=${targetDuration - 0.3}:d=0.3`,
      '-ar', '44100',
      '-ac', '2',
      '-b:a', '192k',
      outputMp3
    ]);

    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('ffmpeg failed with code ' + code));
    });
  });
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function generateWithRetry(task) {
  const tmpWav = `/tmp/voice_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`;
  let attempts = 0;
  while (attempts < 6) {
    attempts++;
    try {
      console.log(`[Attempt ${attempts}] Generating "${task.description}" (${task.prompt}) with voice ${task.voiceName}...`);
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: task.prompt,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: task.voiceName,
              },
            },
          },
        },
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.[0];
      if (!audioPart?.inlineData?.data) {
        throw new Error('No inline audio data returned');
      }

      const buffer = Buffer.from(audioPart.inlineData.data, 'base64');
      fs.writeFileSync(tmpWav, buffer);

      await processWithFfmpeg(tmpWav, task.filename, 3.0);
      try { fs.unlinkSync(tmpWav); } catch (_) {}
      console.log(`✓ Successfully generated ${task.filename}`);
      return;
    } catch (err) {
      console.warn(`Warning on ${task.description}: ${err.message}`);
      if (err.message && err.message.includes('429')) {
        console.log('Rate limit reached, sleeping 25s...');
        await sleep(25000);
      } else {
        await sleep(5000);
      }
    }
  }
  throw new Error(`Failed to generate ${task.filename} after multiple attempts`);
}

async function main() {
  console.log('Starting Voice Generation for SoundPatty...');
  for (const task of VOICE_TASKS) {
    await generateWithRetry(task);
    // Be polite with free tier rate limits (15s between requests)
    await sleep(16000);
  }
  console.log('All 8 human voice audio files generated successfully!');
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
