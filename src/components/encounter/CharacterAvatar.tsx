"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CharacterPortrait } from "@/components/CharacterPortrait";
import type { Character } from "@/types";

interface CharacterAvatarProps {
  character: Character;
  isSpeaking: boolean;
}

export function CharacterAvatar({ character, isSpeaking }: CharacterAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar container */}
      <motion.div
        className={cn(
          "relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-sacred-gold-dim bg-stone-dark sm:h-40 sm:w-40",
          isSpeaking && "speaking-glow"
        )}
        animate={
          isSpeaking
            ? { scale: [1, 1.03, 1] }
            : { scale: 1 }
        }
        transition={
          isSpeaking
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.4 }
        }
      >
        {/* Animated portrait — zoomed to head, centered in circle */}
        <CharacterPortrait
          characterId={character.id}
          isSpeaking={isSpeaking}
          viewBox="20 10 160 175"
          className="absolute top-1/2 left-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-[48%]"
        />

        {/* Speaking indicator ring */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-sacred-gold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.15, 1.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.div>

      {/* Name and title */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-semibold tracking-wide text-sacred-gold sm:text-2xl">
          {character.name}
        </h2>
        <p className="font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {character.epithet ?? character.title} &middot; {character.eraStart}&ndash;{character.eraEnd}
        </p>
      </div>

      {/* Speaking status */}
      <motion.p
        className="h-5 font-[family-name:var(--font-inter)] text-xs italic text-muted-foreground"
        animate={{ opacity: isSpeaking ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isSpeaking ? `${character.name} speaks...` : ""}
      </motion.p>
    </div>
  );
}
