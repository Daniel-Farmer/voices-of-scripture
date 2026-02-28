export interface Character {
  id: string;
  name: string;
  title: string;
  eraStart: string;
  eraEnd: string;
  epithet?: string;
  book?: string;
  shortDescription: string;
  portrait: string;
  suggestedQuestions: string[];
  systemPrompt: string;
  deathLocation?: {
    name: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}
