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
    voiceId: "nPczCjzI2devNBz1zQrb", // Brian - deep, wise
    stability: 1.0, // Robust - calm, authoritative
    similarityBoost: 0.85,
    style: 0.5,
  },
  jesus: {
    voiceId: "ZQe5CZNOzWyzPSCn5a3c", // James - calm, compassionate
    stability: 0.5,
    similarityBoost: 0.8,
    style: 0.5,
  },
  paul: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam - deep, passionate
    stability: 0.0, // Creative - fiery intensity
    similarityBoost: 0.8,
    style: 0.5,
  },
  peter: {
    voiceId: "JBFqnCBsd6RMkjVDRZzb", // George - raspy, rough fisherman
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
