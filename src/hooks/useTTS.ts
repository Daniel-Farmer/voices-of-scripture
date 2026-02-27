"use client";

import { useState, useRef, useCallback } from "react";
import {
  getAudioContext,
  decodeAudio,
  getVoiceGain,
  duckMusic,
  unduckMusic,
} from "@/lib/audioEngine";

interface QueueItem {
  text: string;
  buffer: AudioBuffer | null;
  fetchPromise: Promise<AudioBuffer | null>;
}

const CROSSFADE_MS = 0.15; // 150ms crossfade for smoother transitions

export function useTTS(characterId: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const queueRef = useRef<QueueItem[]>([]);
  const isProcessingRef = useRef(false);
  const abortRef = useRef(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Fetch TTS audio and decode to AudioBuffer
  const fetchTTSBuffer = useCallback(
    async (text: string): Promise<AudioBuffer | null> => {
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, characterId }),
        });
        if (!response.ok) {
          console.error("TTS error:", response.status);
          return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        return decodeAudio(arrayBuffer);
      } catch (e) {
        console.error("TTS fetch error:", e);
        return null;
      }
    },
    [characterId]
  );

  // Play a single AudioBuffer with crossfade envelope
  const playBufferAsync = useCallback(
    (buffer: AudioBuffer): Promise<void> => {
      return new Promise((resolve) => {
        const ctx = getAudioContext();
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Per-chunk gain node for crossfade envelope
        const chunkGain = ctx.createGain();
        chunkGain.connect(getVoiceGain());
        source.connect(chunkGain);

        // Fade in
        chunkGain.gain.setValueAtTime(0, ctx.currentTime);
        chunkGain.gain.linearRampToValueAtTime(1, ctx.currentTime + CROSSFADE_MS);

        // Fade out at end
        const endTime = ctx.currentTime + buffer.duration;
        if (buffer.duration > CROSSFADE_MS * 2) {
          chunkGain.gain.setValueAtTime(1, endTime - CROSSFADE_MS);
          chunkGain.gain.linearRampToValueAtTime(0, endTime);
        }

        source.onended = () => {
          currentSourceRef.current = null;
          resolve();
        };

        currentSourceRef.current = source;
        source.start(0);
      });
    },
    []
  );

  // Process queue: play current, next one is already pre-fetching
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsSpeaking(true);
    duckMusic();

    while (queueRef.current.length > 0 && !abortRef.current) {
      const item = queueRef.current[0];

      // Wait for this item's audio (already fetching since insertion)
      const buffer = item.buffer ?? (await item.fetchPromise);

      if (abortRef.current) break;
      if (!buffer) {
        queueRef.current.shift();
        continue;
      }

      await playBufferAsync(buffer);
      queueRef.current.shift();
    }

    isProcessingRef.current = false;
    setIsSpeaking(false);
    unduckMusic();
  }, [playBufferAsync]);

  // Queue a sentence - fetch starts immediately (look-ahead)
  const queueSentence = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const item: QueueItem = {
        text: trimmed,
        buffer: null,
        fetchPromise: fetchTTSBuffer(trimmed).then((buf) => {
          item.buffer = buf;
          return buf;
        }),
      };
      queueRef.current.push(item);

      if (!isProcessingRef.current) {
        processQueue();
      }
    },
    [fetchTTSBuffer, processQueue]
  );

  // Speak full text at once (used for greeting)
  const speak = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      stop();
      abortRef.current = false;
      queueSentence(text.trim());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queueSentence]
  );

  // Stop all playback
  const stop = useCallback(() => {
    abortRef.current = true;
    queueRef.current = [];
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch {
        // Already stopped
      }
      currentSourceRef.current = null;
    }
    isProcessingRef.current = false;
    setIsSpeaking(false);
    unduckMusic();
  }, []);

  const resetQueue = useCallback(() => {
    abortRef.current = false;
    queueRef.current = [];
  }, []);

  return {
    speak,
    queueSentence,
    stop,
    resetQueue,
    isSpeaking,
    isEnabled,
    setIsEnabled,
  };
}
