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

print("Fetching high-quality TTS for phrase prosody: '¿Vamos a jugar?' vs '¡Vamos a jugar!'...")

# 1. Pregunta interrogativa: "¿Vamos a jugar?"
pregunta_raw = fetch_tts("¿Vamos a jugar?")
with open('/tmp/tts_raw/frase_pregunta_raw.mp3', 'wb') as f:
    f.write(pregunta_raw)

# 2. Exclamación enérgica y afirmativa: "¡Vamos a jugar!"
exclamacion_raw = fetch_tts("¡Vamos a jugar!")
with open('/tmp/tts_raw/frase_exclamacion_raw.mp3', 'wb') as f:
    f.write(exclamacion_raw)

# Process question:
# Clean EQ, enhance question melody, gentle warmth, pad to 2.2s with soft fadeout
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/frase_pregunta_raw.mp3 "
    "-filter_complex \"highpass=f=90,equalizer=f=3100:width_type=o:width=1.5:g=3,volume=1.35,apad=whole_dur=2.2,atrim=0:2.2,afade=t=out:st=1.8:d=0.4\" "
    "-ar 44100 -b:a 192k public/audio/voz_pregunta_frase.mp3"
)

# Process exclamation:
# Firm dynamic compression (punchy attack on ¡Va-!), warmth, fullness, assertive falling ending
run_cmd(
    "ffmpeg -y -i /tmp/tts_raw/frase_exclamacion_raw.mp3 "
    "-filter_complex \"highpass=f=80,compand=attacks=0.01:decays=0.1:points=-80/-80|-20/-4|0/0,equalizer=f=250:width_type=o:width=1.2:g=2,volume=1.65,apad=whole_dur=2.2,atrim=0:2.2,afade=t=out:st=1.8:d=0.4\" "
    "-ar 44100 -b:a 192k public/audio/voz_exclamacion_frase.mp3"
)

# Also copy to existing file paths for backward compatibility so all routes and cached names play the phrase!
for p in ["public/audio/voz_pregunta_que.mp3", "public/audio/voz_pregunta_si.mp3"]:
    run_cmd(f"cp public/audio/voz_pregunta_frase.mp3 {p}")

for p in ["public/audio/voz_exclamacion_que.mp3", "public/audio/voz_exclamacion_si.mp3"]:
    run_cmd(f"cp public/audio/voz_exclamacion_frase.mp3 {p}")

print("Successfully generated and updated prosody phrase files!")
