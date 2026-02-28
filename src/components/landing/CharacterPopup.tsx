"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, MapPin } from "lucide-react";
import { CharacterPortrait } from "@/components/CharacterPortrait";
import type { Character } from "@/types";

const characterAccents: Record<string, string> = {
  moses: "#c9884c",
  "king-david": "#4a80b0",
  "king-solomon": "#7a4a8a",
  jesus: "#c9a84c",
  paul: "#a05040",
  peter: "#4a8070",
};

interface CharacterPopupProps {
  character: Character;
  onClose: () => void;
}

export function CharacterPopup({ character, onClose }: CharacterPopupProps) {
  const accent = characterAccents[character.id] ?? "#c9a84c";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Popup card */}
        <motion.div
          className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-stone-dark/80 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Portrait area */}
          <div className="relative flex h-56 items-center justify-center overflow-hidden bg-stone-dark">
            <div className="absolute inset-0 bg-gradient-to-b from-stone-medium to-stone-dark" />
            <CharacterPortrait
              characterId={character.id}
              viewBox="10 20 180 210"
              className="relative h-[105%] w-[105%] opacity-90"
            />
            {/* Accent tint */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${accent}15, transparent 70%)`,
              }}
            />
            {/* Era overlay */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-[family-name:var(--font-cinzel)] text-sm tracking-widest text-muted-foreground">
              {character.eraStart}&ndash;{character.eraEnd}
            </span>
          </div>

          {/* Accent line */}
          <div
            className="h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}60, ${accent}, ${accent}60, transparent)`,
            }}
          />

          {/* Info area */}
          <div className="p-5">
            <h3
              className="font-[family-name:var(--font-cinzel)] text-xl font-semibold tracking-wide"
              style={{ color: accent }}
            >
              {character.name}
            </h3>
            <p className="mt-0.5 font-[family-name:var(--font-cinzel)] text-xs text-muted-foreground">
              {character.title}
              {character.epithet && (
                <span className="ml-2 uppercase tracking-[0.15em]">
                  &middot; {character.epithet}
                </span>
              )}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              {character.shortDescription}
            </p>

            {/* Death location */}
            {character.deathLocation && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Died at {character.deathLocation.name}</span>
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/encounter/${character.id}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-[family-name:var(--font-cinzel)] text-sm font-semibold tracking-wide transition-all"
              style={{
                borderColor: `${accent}60`,
                color: accent,
                backgroundColor: `${accent}10`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${accent}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${accent}10`;
              }}
            >
              <span>Speak with {character.name}</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
