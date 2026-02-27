"use client";

import { useEffect, useRef } from "react";
import {
  getAudioContext,
  decodeAudio,
  getMusicGain,
  fadeInMusic,
  fadeOutMusic,
} from "@/lib/audioEngine";
import { getCharacterMusic } from "@/config/music.config";

// Module-level buffer cache so we don't re-fetch on re-mount
const musicBufferCache = new Map<string, AudioBuffer>();

export function useBackgroundMusic(enabled: boolean, characterId: string) {
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentFileRef = useRef<string>("");

  useEffect(() => {
    if (!enabled) {
      if (sourceRef.current) {
        fadeOutMusic();
        // Stop the source after the fade-out completes
        const src = sourceRef.current;
        setTimeout(() => {
          try {
            src.stop();
          } catch {
            // Already stopped
          }
        }, 1600);
        sourceRef.current = null;
        currentFileRef.current = "";
      }
      return;
    }

    const track = getCharacterMusic(characterId);
    let cancelled = false;

    // If the same track is already playing, don't restart
    if (currentFileRef.current === track.file && sourceRef.current) {
      return;
    }

    // Stop any existing track before starting a new one
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {
        // Already stopped
      }
      sourceRef.current = null;
    }

    async function startMusic() {
      const file = track.file;

      // Load buffer if not cached
      if (!musicBufferCache.has(file)) {
        try {
          const response = await fetch(`/audio/music/${file}`);
          if (!response.ok) {
            // Fall back to galilean-peace if character-specific track is missing
            if (file !== "galilean-peace.wav") {
              const fallback = await fetch("/audio/music/galilean-peace.wav");
              if (!fallback.ok) return;
              const ab = await fallback.arrayBuffer();
              if (cancelled) return;
              const buf = await decodeAudio(ab);
              musicBufferCache.set(file, buf);
            } else {
              return;
            }
          } else {
            const arrayBuffer = await response.arrayBuffer();
            if (cancelled) return;
            const buf = await decodeAudio(arrayBuffer);
            musicBufferCache.set(file, buf);
          }
        } catch {
          return;
        }
      }

      if (cancelled) return;
      const buffer = musicBufferCache.get(file);
      if (!buffer) return;

      const ctx = getAudioContext();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(getMusicGain());
      source.start(0);
      sourceRef.current = source;
      currentFileRef.current = file;

      // Smooth fade-in
      fadeInMusic();
    }

    startMusic();

    return () => {
      cancelled = true;
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch {
          // Already stopped
        }
        sourceRef.current = null;
        currentFileRef.current = "";
      }
    };
  }, [enabled, characterId]);
}
