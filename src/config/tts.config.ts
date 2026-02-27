export interface CharacterVoiceConfig {
  voiceId: string;
  stability: number;
  similarityBoost: number;
  style: number;
}

// ElevenLabs pre-made voice IDs
export const characterVoices: Record<string, CharacterVoiceConfig> = {
  moses: {
    voiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel - deep, authoritative
    stability: 0.5, // Natural - measured, deliberate
    similarityBoost: 0.8,
    style: 0.5,
  },
  "king-david": {
    voiceId: "TX3LPaxmHKxFdv7VOQHJ", // Liam - warm, poetic
    stability: 0.0, // Creative - expressive for psalms
    similarityBoost: 0.75,
    style: 0.5,
  },
  "king-solomon": {
    voiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel - wise, measured
    stability: 1.0, // Robust - calm, authoritative
    similarityBoost: 0.85,
    style: 0.5,
  },
  jesus: {
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah - gentle, compassionate
    stability: 0.5,
    similarityBoost: 0.8,
    style: 0.5,
  },
  paul: {
    voiceId: "TX3LPaxmHKxFdv7VOQHJ", // Liam - passionate, intellectual
    stability: 0.0, // Creative - fiery intensity
    similarityBoost: 0.8,
    style: 0.5,
  },
  peter: {
    voiceId: "pFZP5JQG7iQjIQuC4Bku", // Lily - earnest, rough
    stability: 0.0,
    similarityBoost: 0.7,
    style: 0.5,
  },
};

export function getCharacterVoiceConfig(characterId: string): CharacterVoiceConfig {
  return (
    characterVoices[characterId] ?? {
      voiceId: "onwK4e9ZLuTAKqWW03F9",
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.5,
    }
  );
}
