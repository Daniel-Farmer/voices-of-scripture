"use client";

import { characters } from "@/lib/characters";
import { CharacterCard } from "./CharacterCard";

export function CharacterGallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((character, index) => (
          <CharacterCard key={character.id} character={character} index={index} />
        ))}
      </div>
    </section>
  );
}
