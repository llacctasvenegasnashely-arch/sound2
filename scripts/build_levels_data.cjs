const fs = require('fs');

const DATA_CONFIG = {
  instruments: {
    name: 'Instrumentos Musicales',
    categories: {
      frequency: {
        name: 'Tono y Frecuencia',
        levels: {
          1: { a: 'xilofono_agudo', b: 'tambor_grave', nameA: 'xilófono agudo brillante', nameB: 'tambor grave profundo' },
          // Cambia la flauta por la campana:
          2: { a: 'campana_aguda', b: 'tuba_grave', nameA: 'campana de cristal aguda', nameB: 'tuba grave cavernosa' },
          3: { a: 'campana_aguda', b: 'timbal_grave', nameA: 'campana de cristal aguda', nameB: 'timbal sinfónico grave' },
        }
      },
      duration: {
        name: 'Duración y Tiempo',
        levels: {
          1: { a: 'guitarra_corta', b: 'xilofono_largo', nameA: 'guitarra acústica corta (2.0s)', nameB: 'xilófono largo sostenido (4.0s)' },
          // Cambia el violín por el xilófono:
          2: { a: 'maraca_corta', b: 'xilofono_largo', nameA: 'maraca corta seca (0.7s)', nameB: 'xilófono largo continuo (4.0s)' },
          3: { a: 'claves_cortas', b: 'organo_largo', nameA: 'claves de madera cortas (0.6s)', nameB: 'órgano largo sostenido (4.0s)' },
        }
      },
      intensity: {
        name: 'Intensidad y Volumen',
        levels: {
          1: { a: 'arpa_suave', b: 'guitarra_fuerte', nameA: 'arpa suave delicada', nameB: 'guitarra eléctrica fuerte' },
          2: { a: 'caja_musica_suave', b: 'trompeta_fuerte', nameA: 'caja de música suave tenue', nameB: 'trompeta fuerte enérgica' },
          // Cambia la batería por la tuba:
          3: { a: 'kalimba_suave', b: 'tuba_fuerte', nameA: 'kalimba suave tenue', nameB: 'tuba potente a gran volumen' },
        }
      },
    }
  },
  animals: {
    name: 'Selva y Granja de Animales',
    categories: {
      frequency: {
        name: 'Tono y Frecuencia',
        // En animales, nivel 2 y 3 se repiten del nivel 1 y el pajarito se queda:
        levels: {
          1: { a: 'canario', b: 'buho', nameA: 'pajarito canario agudo cantarín', nameB: 'búho sabio grave' },
          2: { a: 'canario', b: 'buho', nameA: 'pajarito canario agudo cantarín', nameB: 'búho sabio grave' },
          3: { a: 'canario', b: 'buho', nameA: 'pajarito canario agudo cantarín', nameB: 'búho sabio grave' },
        }
      },
      duration: {
        name: 'Duración y Tiempo',
        levels: {
          1: { a: 'perro', b: 'vaca', nameA: 'perro ladrido corto (0.8s)', nameB: 'vaca mugido largo (2.0s)' },
          2: { a: 'perro', b: 'vaca', nameA: 'perro ladrido corto (0.8s)', nameB: 'vaca mugido largo (2.0s)' },
          3: { a: 'perro', b: 'vaca', nameA: 'perro ladrido corto (0.8s)', nameB: 'vaca mugido largo (2.0s)' },
        }
      },
      intensity: {
        name: 'Intensidad y Volumen',
        levels: {
          1: { a: 'gato', b: 'caballo', nameA: 'gatito suave ronroneando', nameB: 'caballo relincho fuerte' },
          2: { a: 'gato', b: 'caballo', nameA: 'gatito suave ronroneando', nameB: 'caballo relincho fuerte' },
          3: { a: 'gato', b: 'caballo', nameA: 'gatito suave ronroneando', nameB: 'caballo relincho fuerte' },
        }
      },
    }
  },
  voices: {
    name: 'Voz Humana',
    categories: {
      frequency: {
        name: 'Tono y Frecuencia',
        levels: {
          1: { a: 'voz_nina_agudo', b: 'voz_hombre_grave', nameA: 'niña vocal "E" aguda', nameB: 'hombre vocal "E" grave' },
          2: { a: 'voz_vocal_i_aguda', b: 'voz_vocal_u_grave', nameA: 'vocal aguda "I"', nameB: 'vocal grave "U"' },
          3: { a: 'voz_vocal_a_aguda', b: 'voz_vocal_o_grave', nameA: 'vocal clara "A"', nameB: 'vocal honda "O"' },
        }
      },
      duration: {
        name: 'Duración y Tiempo',
        levels: {
          1: { a: 'voz_corta_hola', b: 'voz_larga_hola', nameA: 'palabra corta "Hola" (1.2s)', nameB: 'palabra larga "Hoolaaaa" (3.5s)' },
          2: { a: 'voz_corta_sol', b: 'voz_larga_sol', nameA: 'palabra corta "Sol" (0.9s)', nameB: 'palabra larga "Sooooolllll" (3.5s)' },
          3: { a: 'voz_corta_paz', b: 'voz_larga_paz', nameA: 'palabra corta "Paz" (0.9s)', nameB: 'palabra larga "Paaaazzzzz" (3.5s)' },
        }
      },
      intensity: {
        name: 'Intensidad y Volumen',
        levels: {
          1: { a: 'voz_susurro_suave', b: 'voz_fuerte_aqui', nameA: 'susurro "secreto" suave (25%)', nameB: 'voz fuerte "¡AQUÍ ESTOY!" (100%)' },
          2: { a: 'voz_susurro_silencio', b: 'voz_fuerte_silencio', nameA: 'susurro "Silencio..." suave', nameB: 'voz fuerte "¡SILENCIO!"' },
          3: { a: 'voz_susurro_aqui2', b: 'voz_fuerte_aqui2', nameA: 'susurro "Aquí..." suave', nameB: 'grito alegre "¡AQUÍ!" fuerte' },
        }
      },
      prosody: {
        name: 'Prosodia y Entonación',
        levels: {
          1: { a: 'voz_pregunta_frase', b: 'voz_exclamacion_frase', nameA: 'pregunta "¿Vamos a jugar?"', nameB: 'exclamación "¡Vamos a jugar!"' },
          2: { a: 'voz_pregunta_sorpresa', b: 'voz_exclamacion_sorpresa', nameA: 'pregunta "¿Es una sorpresa?"', nameB: 'exclamación "¡Es una sorpresa!"' },
          3: { a: 'voz_pregunta_cohete', b: 'voz_exclamacion_cohete', nameA: 'pregunta "¿Llegó el cohete?"', nameB: 'exclamación "¡Llegó el cohete!"' },
        }
      }
    }
  },
  notes: {
    name: 'Notas Musicales (Sin prosodia)',
    categories: {
      frequency: {
        name: 'Tono y Frecuencia',
        levels: {
          1: { a: 'nota_aguda', b: 'nota_grave', nameA: 'nota Do agudo (C6)', nameB: 'nota Do grave (C2)' },
          2: { a: 'nota_sol_agudo', b: 'nota_mi_grave', nameA: 'nota Sol agudo (G5)', nameB: 'nota Mi grave (E2)' },
          3: { a: 'nota_si_agudo', b: 'nota_la_grave', nameA: 'nota Si agudo (B5)', nameB: 'nota La grave (A1)' },
        }
      },
      duration: {
        name: 'Duración y Tiempo',
        levels: {
          1: { a: 'nota_corta', b: 'nota_larga', nameA: 'Do staccato corto (0.8s)', nameB: 'Do tenuto largo (3.5s)' },
          2: { a: 'nota_re_staccato', b: 'nota_re_tenuto', nameA: 'Re staccato corto (0.7s)', nameB: 'Re tenuto largo (3.5s)' },
          3: { a: 'nota_fa_staccato', b: 'nota_fa_tenuto', nameA: 'Fa staccato corto (0.7s)', nameB: 'Fa tenuto largo (4.0s)' },
        }
      },
      intensity: {
        name: 'Intensidad y Volumen',
        levels: {
          1: { a: 'nota_suave', b: 'nota_fuerte', nameA: 'Do suave pianissimo (25%)', nameB: 'Do fuerte fortissimo (100%)' },
          2: { a: 'nota_mi_pianissimo', b: 'nota_mi_fortissimo', nameA: 'Mi suave pianissimo', nameB: 'Mi fuerte fortissimo' },
          3: { a: 'nota_sol_pianissimo', b: 'nota_sol_fortissimo', nameA: 'Sol suave pianissimo', nameB: 'Sol fuerte fortissimo' },
        }
      }
    }
  }
};

// Nivel 1: secuencias de DOS sonidos (iniciación y pares mínimos)
const PATTERNS_L1 = [
  ['A', 'B'],
  ['B', 'A'],
  ['A', 'A'],
  ['B', 'B'],
  ['A', 'B']
];

// Nivel 2: secuencias de TRES sonidos (solicitud explícita del usuario)
const PATTERNS_L2 = [
  ['B', 'A', 'B'],
  ['A', 'B', 'A'],
  ['A', 'B', 'B'],
  ['B', 'A', 'A'],
  ['B', 'B', 'A']
];

// Nivel 3: secuencias de TRES sonidos (solicitud explícita del usuario)
const PATTERNS_L3 = [
  ['A', 'A', 'B'],
  ['B', 'B', 'A'],
  ['A', 'B', 'A'],
  ['B', 'A', 'B'],
  ['A', 'B', 'B']
];

let out = `import { CategoryId, Challenge, SoundThemeMode } from '../types/game';

export const LEVEL_CHALLENGES: Record<
  SoundThemeMode,
  Partial<Record<CategoryId, Record<number, Challenge[]>>>
> = {
`;

for (const [modeKey, modeVal] of Object.entries(DATA_CONFIG)) {
  out += `  // ==========================================\n`;
  out += `  // ${modeVal.name.toUpperCase()}\n`;
  out += `  // ==========================================\n`;
  out += `  ${modeKey}: {\n`;

  for (const [catKey, catVal] of Object.entries(modeVal.categories)) {
    out += `    // Misión: ${catVal.name}\n`;
    out += `    ${catKey}: {\n`;

    for (let lvl = 1; lvl <= 3; lvl++) {
      const lvlConfig = catVal.levels[lvl];
      const patterns = lvl === 1 ? PATTERNS_L1 : lvl === 2 ? PATTERNS_L2 : PATTERNS_L3;
      const count = lvl === 1 ? 2 : 3;

      out += `      ${lvl}: [\n`;
      patterns.forEach((pat, qIdx) => {
        const seq = pat.map((p) => (p === 'A' ? lvlConfig.a : lvlConfig.b));
        const seqLabels = pat.map((p) => (p === 'A' ? lvlConfig.nameA : lvlConfig.nameB)).join(', ');
        const id = `${modeKey.substring(0, 4)}-${catKey.substring(0, 3)}-${lvl}-${qIdx + 1}`;

        out += `        {\n`;
        out += `          id: '${id}',\n`;
        out += `          themeMode: '${modeKey}',\n`;
        out += `          category: '${catKey}',\n`;
        out += `          level: ${lvl},\n`;
        out += `          questionNumber: ${qIdx + 1},\n`;
        out += `          sequence: [${seq.map((s) => `'${s}'`).join(', ')}],\n`;
        out += `          hint: 'Nivel ${lvl} (${count} sonidos): Escucha el patrón de ${count} sonidos: ${seqLabels}.',\n`;
        out += `        },\n`;
      });
      out += `      ],\n`;
    }

    out += `    },\n`;
  }

  out += `  },\n`;
}

out += `};\n`;

fs.writeFileSync('src/data/levelsData.ts', out, 'utf-8');
console.log('Successfully generated src/data/levelsData.ts: Level 1 has 2 sounds, Levels 2 & 3 have 3 sounds!');
