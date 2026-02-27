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
    file: "exodus-journey.mp3",
    volume: 1.0,
  },
  "king-david": {
    file: "shepherd-psalms.mp3",
    volume: 1.0,
  },
  "king-solomon": {
    file: "temple-grandeur.mp3",
    volume: 1.0,
  },
  jesus: {
    file: "galilean-peace.mp3",
    volume: 1.0,
  },
  paul: {
    file: "mediterranean-voyage.mp3",
    volume: 1.0,
  },
  peter: {
    file: "fishermans-shore.mp3",
    volume: 1.0,
  },
};

/** Mood-based overlay tracks that crossfade in during certain topics */
export const moodTracks: Record<MusicMood, MusicTrack> = {
  default: { file: "", volume: 0 },
  divine: { file: "mood-divine.mp3", volume: 0.5 },
  lament: { file: "mood-lament.mp3", volume: 0.5 },
  praise: { file: "mood-praise.mp3", volume: 0.5 },
  trial: { file: "mood-trial.mp3", volume: 0.5 },
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
  return characterMusic[characterId] ?? { file: "galilean-peace.mp3", volume: 1.0 };
}
