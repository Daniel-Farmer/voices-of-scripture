"use client";

import { useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  createCoordinates,
} from "@vnedyalk0v/react19-simple-maps";
import { motion } from "motion/react";
import { characters } from "@/lib/characters";
import type { Character } from "@/types";
import { CharacterPopup } from "./CharacterPopup";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Offsets for overlapping markers (in degrees)
const markerOffsets: Record<string, [number, number]> = {
  "king-david": [-0.6, -0.4],
  "king-solomon": [0.6, -0.4],
  jesus: [0, 0.6],
  paul: [-0.4, 0],
  peter: [0.4, 0],
};

// Character accent colors (matching EncounterLayout)
const characterAccents: Record<string, string> = {
  moses: "#c9884c",
  "king-david": "#4a80b0",
  "king-solomon": "#7a4a8a",
  jesus: "#c9a84c",
  paul: "#a05040",
  peter: "#4a8070",
};

export function BiblicalWorldMap() {
  const [selected, setSelected] = useState<Character | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <section className="relative px-4 pb-12">
      {/* Map container */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-stone-dark/50">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: createCoordinates(25, 36),
            scale: 600,
          }}
          width={800}
          height={500}
          className="w-full h-auto"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#2a2218"
                  stroke="#3a3018"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Location labels */}
          <Marker coordinates={createCoordinates(35.23, 31.78)}>
            <text
              textAnchor="middle"
              y={-22}
              className="fill-muted-foreground text-[7px] font-[family-name:var(--font-inter)]"
            >
              Jerusalem
            </text>
          </Marker>
          <Marker coordinates={createCoordinates(12.50, 41.90)}>
            <text
              textAnchor="middle"
              y={-18}
              className="fill-muted-foreground text-[7px] font-[family-name:var(--font-inter)]"
            >
              Rome
            </text>
          </Marker>
          <Marker coordinates={createCoordinates(35.73, 31.77)}>
            <text
              textAnchor="end"
              x={-12}
              y={4}
              className="fill-muted-foreground text-[6px] font-[family-name:var(--font-inter)]"
            >
              Mt. Nebo
            </text>
          </Marker>

          {/* Character markers */}
          {characters.map((character) => {
            if (!character.deathLocation) return null;
            const [lng, lat] = character.deathLocation.coordinates;
            const offset = markerOffsets[character.id] ?? [0, 0];
            const accent = characterAccents[character.id] ?? "#c9a84c";
            const isHovered = hoveredId === character.id;

            return (
              <Marker
                key={character.id}
                coordinates={createCoordinates(lng + offset[0], lat + offset[1])}
                onClick={() => setSelected(character)}
                onMouseEnter={() => setHoveredId(character.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer"
              >
                {/* Pulse ring */}
                <circle
                  r={isHovered ? 10 : 7}
                  fill={`${accent}30`}
                  className="map-pin-pulse"
                />
                {/* Core dot */}
                <circle
                  r={isHovered ? 5 : 3.5}
                  fill={accent}
                  stroke="#1a1510"
                  strokeWidth={1}
                  style={{
                    filter: isHovered
                      ? `drop-shadow(0 0 6px ${accent})`
                      : `drop-shadow(0 0 3px ${accent}80)`,
                    transition: "all 0.2s ease",
                  }}
                />
                {/* Name label */}
                <text
                  textAnchor="middle"
                  y={isHovered ? 18 : 16}
                  className="font-[family-name:var(--font-cinzel)] text-[6px] font-semibold"
                  fill={isHovered ? accent : "#d4c5a0"}
                  style={{ transition: "all 0.2s ease" }}
                >
                  {character.name}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Water overlay — tint the sea */}
        <div className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: "radial-gradient(ellipse at 30% 60%, rgba(42, 74, 107, 0.08), transparent 70%)",
          }}
        />
      </div>

      {/* Era legend */}
      <div className="mx-auto mt-4 flex max-w-5xl flex-wrap justify-center gap-4">
        {characters.map((c) => (
          <motion.button
            key={c.id}
            onClick={() => setSelected(c)}
            className="flex items-center gap-2 rounded-lg border border-border bg-stone-dark/50 px-3 py-1.5 transition-colors hover:border-sacred-gold-dim"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: characterAccents[c.id] ?? "#c9a84c" }}
            />
            <span className="font-[family-name:var(--font-cinzel)] text-xs text-foreground">
              {c.name}
            </span>
            <span className="font-[family-name:var(--font-inter)] text-[10px] text-muted-foreground">
              {c.eraEnd}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Character popup */}
      {selected && <CharacterPopup character={selected} onClose={handleClose} />}
    </section>
  );
}
