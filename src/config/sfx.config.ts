export interface SfxMapping {
  keywords: string[];
  file: string;
  cooldownMs: number;
  /** Lower = higher priority when multiple match */
  priority: number;
}

export const sfxMappings: SfxMapping[] = [
  {
    keywords: ["shofar", "trumpet", "horn", "jericho", "announcement", "proclaim"],
    file: "shofar-blast.wav",
    cooldownMs: 20000,
    priority: 1,
  },
  {
    keywords: ["thunder", "sinai", "mountain", "lightning", "voice of god", "glory"],
    file: "thunder-divine.wav",
    cooldownMs: 25000,
    priority: 2,
  },
  {
    keywords: ["sea", "waves", "galilee", "fishing", "boat", "red sea", "jordan", "water"],
    file: "sea-waves.wav",
    cooldownMs: 22000,
    priority: 3,
  },
  {
    keywords: ["fire", "burning bush", "flame", "pillar", "pentecost", "torch", "lamp"],
    file: "fire-holy.wav",
    cooldownMs: 20000,
    priority: 4,
  },
  {
    keywords: ["crowd", "multitude", "gathered", "people", "thousands", "assembly"],
    file: "crowd-multitude.wav",
    cooldownMs: 25000,
    priority: 5,
  },
  {
    keywords: ["harp", "psalm", "music", "sing", "praise", "worship", "lyre", "song"],
    file: "harp-strum.wav",
    cooldownMs: 20000,
    priority: 6,
  },
  {
    keywords: ["stone", "tablets", "commandments", "law", "covenant", "carved"],
    file: "stone-tablets.wav",
    cooldownMs: 25000,
    priority: 7,
  },
  {
    keywords: ["shepherd", "sheep", "flock", "lamb", "pasture", "rod", "staff"],
    file: "shepherd-flock.wav",
    cooldownMs: 22000,
    priority: 8,
  },
  {
    keywords: ["chains", "prison", "captive", "bound", "dungeon", "imprisoned"],
    file: "chains-prison.wav",
    cooldownMs: 22000,
    priority: 9,
  },
  {
    keywords: ["rooster", "denied", "three times", "cock", "crow", "denial"],
    file: "rooster-crow.wav",
    cooldownMs: 30000,
    priority: 10,
  },
  {
    keywords: ["temple", "holy", "sacred", "altar", "sanctuary", "tabernacle"],
    file: "temple-bells.wav",
    cooldownMs: 25000,
    priority: 11,
  },
  {
    keywords: ["desert", "wilderness", "wandering", "forty years", "dry", "barren"],
    file: "desert-wind.wav",
    cooldownMs: 25000,
    priority: 12,
  },
  {
    keywords: ["cross", "crucify", "nail", "carpenter", "wood", "build"],
    file: "hammer-nails.wav",
    cooldownMs: 25000,
    priority: 13,
  },
  {
    keywords: ["baptism", "baptize", "jordan", "wash", "cleanse", "immerse"],
    file: "water-pour.wav",
    cooldownMs: 22000,
    priority: 14,
  },
];

/** Max number of distinct SFX that can trigger per response chunk */
export const MAX_SFX_PER_CHUNK = 2;
