"use client";

import { useRef, useCallback } from "react";
import { getAudioContext, decodeAudio, getSfxGain } from "@/lib/audioEngine";
import { sfxMappings, MAX_SFX_PER_CHUNK, type SfxMapping } from "@/config/sfx.config";

// Module-level caches (persist across re-renders and re-mounts)
const sfxBufferCache = new Map<string, AudioBuffer>();
const sfxCooldowns = new Map<string, number>();

export function useSoundEffects() {
  const lastScannedLengthRef = useRef(0);

  const preloadSfx = useCallback(async () => {
    const uniqueFiles = [...new Set(sfxMappings.map((m) => m.file))];
    await Promise.allSettled(
      uniqueFiles.map(async (file) => {
        if (sfxBufferCache.has(file)) return;
        try {
          const response = await fetch(`/audio/sfx/${file}`);
          if (!response.ok) return;
          const arrayBuffer = await response.arrayBuffer();
          const buffer = await decodeAudio(arrayBuffer);
          sfxBufferCache.set(file, buffer);
        } catch {
          // SFX file missing - not fatal
        }
      })
    );
  }, []);

  const playSfx = useCallback((mapping: SfxMapping) => {
    const now = Date.now();
    const lastPlayed = sfxCooldowns.get(mapping.file) ?? 0;
    if (now - lastPlayed < mapping.cooldownMs) return false;

    const buffer = sfxBufferCache.get(mapping.file);
    if (!buffer) return false;

    sfxCooldowns.set(mapping.file, now);

    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Per-SFX gain for a slight fade-in (avoids clicks)
    const fadeGain = ctx.createGain();
    fadeGain.gain.setValueAtTime(0, ctx.currentTime);
    fadeGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
    source.connect(fadeGain);
    fadeGain.connect(getSfxGain());

    source.start(0);
    return true;
  }, []);

  const scanText = useCallback(
    (fullText: string) => {
      const newText = fullText.slice(lastScannedLengthRef.current).toLowerCase();
      if (!newText) return;
      lastScannedLengthRef.current = fullText.length;

      // Find all matching SFX, sorted by priority (lower = higher priority)
      const matches = sfxMappings
        .filter((mapping) => mapping.keywords.some((kw) => newText.includes(kw)))
        .sort((a, b) => a.priority - b.priority);

      // Play up to MAX_SFX_PER_CHUNK distinct sounds, staggered slightly
      let played = 0;
      for (const mapping of matches) {
        if (played >= MAX_SFX_PER_CHUNK) break;
        // Small stagger so multiple SFX don't overlap start times
        const delay = played * 800; // 800ms between each
        setTimeout(() => playSfx(mapping), delay);
        played++;
      }
    },
    [playSfx]
  );

  const resetScan = useCallback(() => {
    lastScannedLengthRef.current = 0;
  }, []);

  return { scanText, resetScan, preloadSfx };
}
