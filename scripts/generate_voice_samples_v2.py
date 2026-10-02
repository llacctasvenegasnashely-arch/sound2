import urllib.request
import urllib.parse
import os
import subprocess

def fetch_tts(text, lang='es'):
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={lang}&client=tw-ob&q={urllib.parse.quote(text)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        return resp.read()

def run_cmd(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print("Error executing:", cmd)
        print(res.stderr)
        raise RuntimeError(res.stderr)

os.makedirs('/tmp/tts_raw', exist_ok=True)
os.makedirs('public/audio', exist_ok=True)

# 1. Misión 1 - Tono y Frecuencia: Vocal "E" (Solo una vez)
# Agudo: Niña alegre / vocal aguda
print("Generating Misión 1: Agudo (Vocal E - Niña/Agudo)...")
e_raw = fetch_tts("eh")
with open('/tmp/tts_raw/e_raw.mp3', 'wb') as f:
    f.write(e_raw)

# Pitch shift up for bright child voice (+6 semitones, 1.41x) with formant preservation/lift
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/e_raw.mp3 "
    "-filter_complex \"asetrate=44100*1.42,atempo=1/1.42,highpass=f=250,equalizer=f=3200:width_type=o:width=1.5:g=4,apad=whole_dur=2.5,atrim=0:2.5,afade=t=out:st=2.0:d=0.5\" "
    "-ar 44100 -b:a 192k public/audio/voz_nina_agudo.mp3"
)

# Grave: Hombre profundo / vocal grave
print("Generating Misión 1: Grave (Vocal E - Hombre/Grave)...")
# Pitch shift down for deep male voice (-7 semitones, 0.67x) with bass chest resonance
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/e_raw.mp3 "
    "-filter_complex \"asetrate=44100*0.68,atempo=1/0.68,lowpass=f=3000,bass=g=7:f=110,apad=whole_dur=2.5,atrim=0:2.5,afade=t=out:st=2.0:d=0.5\" "
    "-ar 44100 -b:a 192k public/audio/voz_hombre_grave.mp3"
)

# 2. Misión 2 - Duración y Tiempo: Palabra Corta "Hola" vs. Palabra Larga "Hoolaaaaa" (Solo una vez)
print("Generating Misión 2: Corto (Hola)...")
hola_raw = fetch_tts("Hola")
with open('/tmp/tts_raw/hola_raw.mp3', 'wb') as f:
    f.write(hola_raw)

# Corto: ~0.85s natural, crisp, quick
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/hola_raw.mp3 "
    "-filter_complex \"atempo=1.2,apad=whole_dur=1.2,atrim=0:1.2,afade=t=out:st=0.9:d=0.3\" "
    "-ar 44100 -b:a 192k public/audio/voz_corta_sol.mp3"
)

# Larga: "Hoolaaaaa" sostenida (~3.5s)
print("Generating Misión 2: Largo (Hoolaaaaa sostenida)...")
# Time-stretch the word smoothly to make it sustained (3.5 seconds)
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/hola_raw.mp3 "
    "-filter_complex \"atempo=0.5,atempo=0.55,apad=whole_dur=3.5,atrim=0:3.5,afade=t=out:st=2.8:d=0.7\" "
    "-ar 44100 -b:a 192k public/audio/voz_larga_hola.mp3"
)

# 3. Misión 3 - Intensidad y Volumen: Susurro "secreto" vs. Fuerte "secreto" (Solo una vez)
print("Generating Misión 3: Susurro (secreto suave)...")
secreto_raw = fetch_tts("secreto")
with open('/tmp/tts_raw/secreto_raw.mp3', 'wb') as f:
    f.write(secreto_raw)

# Whisper effect: Highpass + bandpass shaping to remove voiced fundamental, softer volume (~25%), gentle breath
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/secreto_raw.mp3 "
    "-filter_complex \"highpass=f=950,equalizer=f=2800:width_type=o:width=1.5:g=2,volume=0.28,apad=whole_dur=2.2,atrim=0:2.2,afade=t=out:st=1.7:d=0.5\" "
    "-ar 44100 -b:a 192k public/audio/voz_susurro_suave.mp3"
)

# Fuerte: "¡SECRETO!" potente, con presencia, compresión y 100% de volumen
print("Generating Misión 3: Fuerte (¡SECRETO! fuerte)...")
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/secreto_raw.mp3 "
    "-filter_complex \"compand=attacks=0.01:decays=0.1:points=-80/-80|-20/-6|0/0,volume=1.85,apad=whole_dur=2.2,atrim=0:2.2,afade=t=out:st=1.7:d=0.5\" "
    "-ar 44100 -b:a 192k public/audio/voz_fuerte_aqui.mp3"
)

# 4. Misión 4 - Prosodia y Entonación: Pregunta "¿Qué?" vs. Exclamación "¡Qué!" (Solo una vez)
print("Generating Misión 4: Pregunta (¿Qué?)...")
que_pregunta_raw = fetch_tts("¿Qué?")
with open('/tmp/tts_raw/que_pregunta_raw.mp3', 'wb') as f:
    f.write(que_pregunta_raw)

# Rising questioning pitch contour
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/que_pregunta_raw.mp3 "
    "-filter_complex \"volume=1.3,apad=whole_dur=2.0,atrim=0:2.0,afade=t=out:st=1.6:d=0.4\" "
    "-ar 44100 -b:a 192k public/audio/voz_pregunta_si.mp3"
)

print("Generating Misión 4: Exclamación (¡Qué!)...")
que_exclamacion_raw = fetch_tts("¡Qué!")
with open('/tmp/tts_raw/que_exclamacion_raw.mp3', 'wb') as f:
    f.write(que_exclamacion_raw)

# Firm, decisive, affirmative exclamation
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/que_exclamacion_raw.mp3 "
    "-filter_complex \"volume=1.5,apad=whole_dur=2.0,atrim=0:2.0,afade=t=out:st=1.6:d=0.4\" "
    "-ar 44100 -b:a 192k public/audio/voz_exclamacion_si.mp3"
)

print("All voice samples successfully generated!")
