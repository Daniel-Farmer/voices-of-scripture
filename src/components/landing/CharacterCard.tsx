"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CharacterPortrait } from "@/components/CharacterPortrait";
import type { Character } from "@/types";

interface CharacterCardProps {
  character: Character;
  index: number;
}

export function CharacterCard({ character, index }: CharacterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      <Link href={`/encounter/${character.id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-500 hover:border-sacred-gold-dim hover:shadow-[0_0_30px_rgba(218,165,32,0.15)]">
          {/* Portrait area */}
          <div className="relative flex h-64 items-center justify-center overflow-hidden bg-stone-dark">
            <div className="absolute inset-0 bg-gradient-to-b from-stone-medium to-stone-dark" />
            {/* Animated SVG portrait — bust view with idle animations */}
            <CharacterPortrait
              characterId={character.id}
              viewBox="10 20 180 210"
              className="relative h-[105%] w-[105%] opacity-85 transition-opacity duration-500 group-hover:opacity-100"
            />
            {/* Era dates overlay */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-[family-name:var(--font-cinzel)] text-sm tracking-widest text-muted-foreground">
              {character.eraStart}&ndash;{character.eraEnd}
            </span>
            {/* Gold overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-sacred-gold/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          {/* Info area */}
          <div className="p-5">
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-semibold tracking-wide text-sacred-gold">
              {character.name}
            </h3>
            {character.epithet && (
              <p className="mt-1 font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {character.epithet}
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              {character.shortDescription}
            </p>

            {/* CTA */}
            <div className="mt-4 flex items-center gap-2 font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-[0.2em] text-sacred-gold-dim transition-colors duration-300 group-hover:text-sacred-gold">
              <span>Hear their voice</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
