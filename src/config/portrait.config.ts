export interface CharacterAppearance {
  skinTone: string;
  skinShadow: string;
  eyeColor: string;
  hairColor: string;
  beardColor: string;
  beardStyle: "none" | "short" | "full" | "forked";
  hairStyle: "short" | "medium" | "long" | "receding";
  headwear: "none" | "circlet" | "ornate" | "turban" | "halo";
  robeColor: string;
  robeAccent: string;
  faceRx: number;
  faceRy: number;
}

export const characterAppearances: Record<string, CharacterAppearance> = {
  moses: {
    skinTone: "#c49a6c",
    skinShadow: "#a47e52",
    eyeColor: "#5a4030",
    hairColor: "#d0d0d0",
    beardColor: "#c8c8c8",
    beardStyle: "full",
    hairStyle: "medium",
    headwear: "turban",
    robeColor: "#6b5030",
    robeAccent: "#c9a84c",
    faceRx: 55,
    faceRy: 68,
  },
  "king-david": {
    skinTone: "#d0a070",
    skinShadow: "#b48a58",
    eyeColor: "#4a80b0",
    hairColor: "#8b4520",
    beardColor: "#7a3a18",
    beardStyle: "short",
    hairStyle: "medium",
    headwear: "circlet",
    robeColor: "#5a3a1a",
    robeAccent: "#c9a84c",
    faceRx: 55,
    faceRy: 66,
  },
  "king-solomon": {
    skinTone: "#cca070",
    skinShadow: "#b08858",
    eyeColor: "#4a3828",
    hairColor: "#2a2018",
    beardColor: "#2a2018",
    beardStyle: "short",
    hairStyle: "short",
    headwear: "ornate",
    robeColor: "#4a1a5a",
    robeAccent: "#c9a84c",
    faceRx: 54,
    faceRy: 68,
  },
  jesus: {
    skinTone: "#d0a478",
    skinShadow: "#b48a60",
    eyeColor: "#6a5038",
    hairColor: "#5a3a20",
    beardColor: "#503218",
    beardStyle: "short",
    hairStyle: "long",
    headwear: "halo",
    robeColor: "#d4c8b0",
    robeAccent: "#c9a84c",
    faceRx: 54,
    faceRy: 66,
  },
  paul: {
    skinTone: "#c8a080",
    skinShadow: "#a88060",
    eyeColor: "#3a3028",
    hairColor: "#3a2a1a",
    beardColor: "#3a2a1a",
    beardStyle: "short",
    hairStyle: "receding",
    headwear: "none",
    robeColor: "#5a4a3a",
    robeAccent: "#8a7050",
    faceRx: 53,
    faceRy: 70,
  },
  peter: {
    skinTone: "#c49868",
    skinShadow: "#a47e50",
    eyeColor: "#5a6858",
    hairColor: "#6a5a48",
    beardColor: "#6a5a48",
    beardStyle: "full",
    hairStyle: "short",
    headwear: "none",
    robeColor: "#4a5a6a",
    robeAccent: "#8a7a6a",
    faceRx: 56,
    faceRy: 67,
  },
};

export function getCharacterAppearance(characterId: string): CharacterAppearance {
  return characterAppearances[characterId] ?? characterAppearances["moses"];
}
