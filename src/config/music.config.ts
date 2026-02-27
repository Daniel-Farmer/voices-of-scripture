export interface MusicTrack {
  file: string;
  /** Base volume for this track (0-1), applied on top of the music channel gain */
  volume: number;
}

export interface MoodTrigger {
  keywords: string[];
  mood: MusicMood;
  cooldownMs: number;
  /** How long the mood persists before returning to default (ms) */
  durationMs: number;
}

export type MusicMood = "default" | "divine" | "lament" | "praise" | "trial";

/** Per-character default ambient track */
export const characterMusic: Record<string, MusicTrack> = {
  moses: {
    file: "exodus-journey.wav",
    volume: 1.0,
  },
  "king-david": {
    file: "shepherd-psalms.wav",
    volume: 1.0,
  },
  "king-solomon": {
    file: "temple-grandeur.wav",
    volume: 1.0,
  },
  jesus: {
    file: "galilean-peace.wav",
    volume: 1.0,
  },
  paul: {
    file: "mediterranean-voyage.wav",
    volume: 1.0,
  },
  peter: {
    file: "fishermans-shore.wav",
    volume: 1.0,
  },
};

/** Mood-based overlay tracks that crossfade in during certain topics */
export const moodTracks: Record<MusicMood, MusicTrack> = {
  default: { file: "", volume: 0 },
  divine: { file: "moods/mood-divine.wav", volume: 0.5 },
  lament: { file: "moods/mood-lament.wav", volume: 0.5 },
  praise: { file: "moods/mood-praise.wav", volume: 0.5 },
  trial: { file: "moods/mood-trial.wav", volume: 0.5 },
};

/** Keywords that trigger mood changes */
export const moodTriggers: MoodTrigger[] = [
  {
    keywords: ["miracle", "angel", "heaven", "glory", "risen", "resurrection", "holy spirit", "transfigured", "burning bush"],
    mood: "divine",
    cooldownMs: 45000,
    durationMs: 30000,
  },
  {
    keywords: ["death", "died", "grief", "mourning", "weep", "sorrow", "cross", "crucify", "tomb", "betrayed"],
    mood: "lament",
    cooldownMs: 45000,
    durationMs: 25000,
  },
  {
    keywords: ["praise", "psalm", "worship", "rejoice", "celebration", "glory", "hallelujah", "sing", "thanksgiving"],
    mood: "praise",
    cooldownMs: 45000,
    durationMs: 25000,
  },
  {
    keywords: ["trial", "persecution", "prison", "stoning", "pharaoh", "wilderness", "temptation", "battle", "enemy"],
    mood: "trial",
    cooldownMs: 45000,
    durationMs: 25000,
  },
];

export function getCharacterMusic(characterId: string): MusicTrack {
  return characterMusic[characterId] ?? { file: "galilean-peace.wav", volume: 1.0 };
}
