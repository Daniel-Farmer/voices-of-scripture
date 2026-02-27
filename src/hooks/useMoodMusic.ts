"use client";

import { useRef, useCallback } from "react";
import {
  getAudioContext,
  decodeAudio,
  getMoodGain,
  fadeInMood,
  fadeOutMood,
} from "@/lib/audioEngine";
import {
  moodTriggers,
  moodTracks,
  type MusicMood,
} from "@/config/music.config";

// Module-level caches
const moodBufferCache = new Map<string, AudioBuffer>();
const moodCooldowns = new Map<string, number>();

export function useMoodMusic(enabled: boolean) {
  const currentMoodRef = useRef<MusicMood>("default");
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const moodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScannedRef = useRef(0);

  const preloadMoods = useCallback(async () => {
    const files = Object.values(moodTracks)
      .map((t) => t.file)
      .filter(Boolean);
    await Promise.allSettled(
      files.map(async (file) => {
        if (moodBufferCache.has(file)) return;
        try {
          const response = await fetch(`/audio/music/${file}`);
          if (!response.ok) return;
          const ab = await response.arrayBuffer();
          const buffer = await decodeAudio(ab);
          moodBufferCache.set(file, buffer);
        } catch {
          // Not fatal — mood just won't play
        }
      })
    );
  }, []);

  const stopMood = useCallback(() => {
    if (moodTimerRef.current) {
      clearTimeout(moodTimerRef.current);
      moodTimerRef.current = null;
    }
    fadeOutMood();
    // Stop the source after fade-out
    const src = sourceRef.current;
    if (src) {
      setTimeout(() => {
        try {
          src.stop();
        } catch {
          // Already stopped
        }
      }, 1600);
      sourceRef.current = null;
    }
    currentMoodRef.current = "default";
  }, []);

  const startMood = useCallback(
    (mood: MusicMood, durationMs: number) => {
      if (!enabled) return;
      if (mood === "default") return;

      const track = moodTracks[mood];
      if (!track || !track.file) return;

      const buffer = moodBufferCache.get(track.file);
      if (!buffer) return;

      // If same mood is already playing, just extend the timer
      if (currentMoodRef.current === mood && sourceRef.current) {
        if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
        moodTimerRef.current = setTimeout(stopMood, durationMs);
        return;
      }

      // Stop current mood if different
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch {
          // Already stopped
        }
      }

      const ctx = getAudioContext();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(getMoodGain());
      source.start(0);
      sourceRef.current = source;
      currentMoodRef.current = mood;

      fadeInMood();

      // Auto-fade-out after duration
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
      moodTimerRef.current = setTimeout(stopMood, durationMs);
    },
    [enabled, stopMood]
  );

  const scanForMood = useCallback(
    (fullText: string) => {
      if (!enabled) return;
      const newText = fullText.slice(lastScannedRef.current).toLowerCase();
      if (!newText) return;
      lastScannedRef.current = fullText.length;

      const now = Date.now();
      for (const trigger of moodTriggers) {
        const hit = trigger.keywords.some((kw) => newText.includes(kw));
        if (!hit) continue;

        const lastTriggered = moodCooldowns.get(trigger.mood) ?? 0;
        if (now - lastTriggered < trigger.cooldownMs) continue;

        moodCooldowns.set(trigger.mood, now);
        startMood(trigger.mood, trigger.durationMs);
        break; // Only one mood at a time
      }
    },
    [enabled, startMood]
  );

  const resetMoodScan = useCallback(() => {
    lastScannedRef.current = 0;
  }, []);

  return { scanForMood, resetMoodScan, preloadMoods, stopMood };
}
