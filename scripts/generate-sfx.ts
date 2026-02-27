/**
 * Generate sound effects, ambient music, and mood tracks using ElevenLabs Sound Generation API.
 * Run with: npx tsx scripts/generate-sfx.ts
 *
 * Requires ELEVENLABS_API_KEY in .env.local
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY in .env.local");
  process.exit(1);
}

interface SoundToGenerate {
  file: string;
  prompt: string;
  duration: number;
}

const SOUNDS: SoundToGenerate[] = [
  // ============ SFX ============
  {
    file: "public/audio/sfx/sword-clash.mp3",
    prompt: "Medieval sword fight, steel clashing against steel, brief intense combat",
    duration: 3,
  },
  {
    file: "public/audio/sfx/arrow-volley.mp3",
    prompt: "Medieval arrow volley, multiple arrows whooshing through air, bowstrings snapping, arrows hitting wooden shields",
    duration: 3,
  },
  {
    file: "public/audio/sfx/horse-whinny.mp3",
    prompt: "Horse whinny and snort, medieval stable, hooves on stone cobbles",
    duration: 3,
  },
  {
    file: "public/audio/sfx/church-bell.mp3",
    prompt: "Single church bell toll, medieval cathedral, deep reverberant stone echo",
    duration: 4,
  },
  {
    file: "public/audio/sfx/fire-crackle.mp3",
    prompt: "Crackling fireplace, medieval hearth, warm fire popping and hissing",
    duration: 3,
  },
  {
    file: "public/audio/sfx/thunder.mp3",
    prompt: "Distant thunder rumbling, medieval storm approaching over open fields",
    duration: 4,
  },
  {
    file: "public/audio/sfx/fanfare.mp3",
    prompt: "Short medieval trumpet fanfare, royal court announcement, brass herald",
    duration: 3,
  },
  {
    file: "public/audio/sfx/somber-bell.mp3",
    prompt: "Slow funeral bell tolling, somber and mournful, single bell, distant",
    duration: 4,
  },
  {
    file: "public/audio/sfx/tavern-cheer.mp3",
    prompt: "Medieval tavern cheering crowd, clinking goblets, hearty laughter, celebration",
    duration: 3,
  },
  {
    file: "public/audio/sfx/sea-waves.mp3",
    prompt: "Ocean waves lapping against wooden ship hull, creaking timber, seagulls distant, medieval harbour",
    duration: 4,
  },
  {
    file: "public/audio/sfx/chains-rattle.mp3",
    prompt: "Heavy iron chains rattling in stone dungeon, metal scraping, prison cell, medieval",
    duration: 3,
  },
  {
    file: "public/audio/sfx/castle-gate.mp3",
    prompt: "Heavy castle portcullis raising, chains grinding, massive wooden gate creaking open, stone fortress",
    duration: 4,
  },
  {
    file: "public/audio/sfx/quill-scratch.mp3",
    prompt: "Quill pen scratching on parchment paper, dipping in inkwell, writing sounds, quiet medieval study",
    duration: 3,
  },
  {
    file: "public/audio/sfx/crowd-murmur.mp3",
    prompt: "Medieval court crowd murmuring quietly, whispering nobles, rustling robes, large stone hall",
    duration: 4,
  },
  {
    file: "public/audio/sfx/wolf-howl.mp3",
    prompt: "Lone wolf howling in distant forest at night, eerie medieval wilderness, wind in trees",
    duration: 4,
  },

  // ============ BACKGROUND MUSIC (per-monarch) ============
  {
    file: "public/audio/music/court-ambience.mp3",
    prompt: "Medieval royal court ambient atmosphere, gentle lute and harp, distant echoes in stone hall, calm and majestic, loopable",
    duration: 22,
  },
  {
    file: "public/audio/music/crusade-camp.mp3",
    prompt: "Medieval military camp at night, distant drums, soldiers murmuring, campfire crackle, leather and chain mail, tense anticipation, loopable",
    duration: 22,
  },
  {
    file: "public/audio/music/dark-throne.mp3",
    prompt: "Dark medieval throne room, brooding low strings drone, cold stone atmosphere, tense and ominous, dripping water echo, loopable",
    duration: 22,
  },
  {
    file: "public/audio/music/chivalry-court.mp3",
    prompt: "Grand medieval court of chivalry, warm lute melody with gentle recorder, noble and uplifting atmosphere, heraldic, loopable",
    duration: 22,
  },
  {
    file: "public/audio/music/elegant-court.mp3",
    prompt: "Elegant refined medieval court, delicate harp arpeggios with soft flute, artistic and cultured atmosphere, gentle and beautiful, loopable",
    duration: 22,
  },

  // ============ MOOD OVERLAY TRACKS ============
  {
    file: "public/audio/music/mood-battle.mp3",
    prompt: "Intense medieval battle drums, war percussion, urgent rhythmic pounding, brass stabs, epic and aggressive, loopable",
    duration: 18,
  },
  {
    file: "public/audio/music/mood-somber.mp3",
    prompt: "Somber medieval strings, mournful low cello, gentle requiem, funeral atmosphere, slow and sorrowful, loopable",
    duration: 18,
  },
  {
    file: "public/audio/music/mood-celebration.mp3",
    prompt: "Joyful medieval celebration music, lively lute and tambourine, dancing rhythm, festive and bright, loopable",
    duration: 18,
  },
  {
    file: "public/audio/music/mood-sacred.mp3",
    prompt: "Sacred medieval choral ambience, ethereal voices in cathedral, Gregorian chant style, reverent and holy, loopable",
    duration: 18,
  },
];

async function generateSound(sound: SoundToGenerate): Promise<void> {
  const outPath = resolve(process.cwd(), sound.file);

  if (existsSync(outPath)) {
    console.log(`  ✓ ${sound.file} (already exists, skipping)`);
    return;
  }

  console.log(`  ⏳ Generating ${sound.file}...`);

  const response = await fetch(
    "https://api.elevenlabs.io/v1/sound-generation",
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: sound.prompt,
        duration_seconds: sound.duration,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`  ✗ Failed ${sound.file}: ${response.status} ${error}`);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  // Ensure directory exists
  const dir = dirname(outPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outPath, buffer);
  console.log(`  ✓ ${sound.file} (${(buffer.length / 1024).toFixed(0)}KB)`);
}

async function main() {
  console.log("Generating audio assets with ElevenLabs Sound Generation API...\n");
  console.log(`Found ${SOUNDS.length} sounds to generate.\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const sound of SOUNDS) {
    const outPath = resolve(process.cwd(), sound.file);
    if (existsSync(outPath)) {
      skipped++;
      console.log(`  ✓ ${sound.file} (exists)`);
    } else {
      await generateSound(sound);
      const exists = existsSync(outPath);
      if (exists) generated++;
      else failed++;
    }
    // Small delay between calls to avoid rate limiting
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
  console.log("Audio assets saved to public/audio/");
}

main().catch(console.error);
