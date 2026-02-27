"use client";

import { useParams, notFound } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef } from "react";
import { getCharacterById } from "@/lib/characters";
import { EncounterLayout } from "@/components/encounter/EncounterLayout";
import { ChatInterface } from "@/components/encounter/ChatInterface";
import { useTTS } from "@/hooks/useTTS";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useMoodMusic } from "@/hooks/useMoodMusic";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { destroyAudioEngine } from "@/lib/audioEngine";

// Abbreviations that shouldn't trigger sentence splits
const ABBREVS = /(?:St|Mr|Mrs|Dr|Sr|Jr|Mt|Ft|Lt|Gen|Sgt|Capt|Col|Maj|Rev|Hon|Prof|Gov|Esq|Inc|Ltd|etc|vs|approx|dept|est|vol|ch|pt|no)\./gi;

// Split text into sentences at . ! ? boundaries, handling abbreviations and ellipses
function extractSentences(text: string): string[] {
  // Replace abbreviations with placeholder to avoid false splits
  const placeholder = "\u0000";
  const safened = text.replace(ABBREVS, (m) => m.replace(".", placeholder));

  // Match sentences: handle ellipsis (...) as a single delimiter
  const matches = safened.match(/[^.!?]*(?:\.{3}|[.!?])+[\s]*/g);
  if (!matches) return [];

  return matches
    .map((s) => s.replace(new RegExp(placeholder, "g"), ".").trim())
    .filter((s) => s.length > 0);
}

export default function EncounterPage() {
  const { characterId } = useParams<{ characterId: string }>();
  const character = getCharacterById(characterId);
  const prevStatusRef = useRef<string>("");
  const isEnabledRef = useRef(false);
  const spokenLengthRef = useRef(0);
  const greetingSentRef = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { characterId },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const { speak, queueSentence, stop, resetQueue, isSpeaking, isEnabled, setIsEnabled } =
    useTTS(characterId);

  const { scanText, resetScan, preloadSfx } = useSoundEffects();
  const { scanForMood, resetMoodScan, preloadMoods, stopMood } = useMoodMusic(isEnabled);

  // Background music plays when audio is enabled (per-character track)
  useBackgroundMusic(isEnabled, characterId);

  // Keep ref in sync so effects always have the latest value
  isEnabledRef.current = isEnabled;

  // Preload SFX and mood music on mount, destroy audio engine on unmount
  useEffect(() => {
    preloadSfx();
    preloadMoods();
    return () => {
      stopMood();
      destroyAudioEngine();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-send greeting when entering the encounter
  useEffect(() => {
    if (greetingSentRef.current || !character) return;
    greetingSentRef.current = true;
    // Enable TTS for the greeting
    setIsEnabled(true);
    // Small delay so the page renders first
    const timer = setTimeout(() => {
      sendMessage({ text: "I come seeking your wisdom." });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live sentence-by-sentence TTS during streaming
  useEffect(() => {
    if (status !== "streaming" || !isEnabledRef.current) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== "assistant") return;

    const fullText =
      lastMessage.parts
        ?.filter(
          (p): p is { type: "text"; text: string } => p.type === "text"
        )
        .map((p) => p.text)
        .join("") ?? "";

    // Scan for SFX keyword triggers and mood changes
    scanText(fullText);
    scanForMood(fullText);

    // Only look at new text we haven't processed yet
    const newText = fullText.slice(spokenLengthRef.current);
    const sentences = extractSentences(newText);

    if (sentences.length > 0) {
      for (const sentence of sentences) {
        queueSentence(sentence);
      }
      // Calculate consumed characters from the raw regex matches (includes trailing whitespace)
      const rawMatches = newText.match(/[^.!?]*[.!?]+[\s]*/g) || [];
      const consumedLength = rawMatches.reduce((sum, m) => sum + m.length, 0);
      spokenLengthRef.current += consumedLength;
    }
  }, [messages, status, queueSentence, scanText, scanForMood]);

  // When streaming finishes, speak any remaining unspoken text
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    if (prevStatus === "streaming" && status === "ready" && isEnabledRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        const fullText =
          lastMessage.parts
            ?.filter(
              (p): p is { type: "text"; text: string } => p.type === "text"
            )
            .map((p) => p.text)
            .join("") ?? "";

        const remaining = fullText.slice(spokenLengthRef.current).trim();
        if (remaining) {
          queueSentence(remaining);
        }
      }
    }

    // Reset tracking when a new response starts streaming
    if (status === "submitted") {
      spokenLengthRef.current = 0;
      resetQueue();
      resetScan();
      resetMoodScan();
    }
  }, [status, messages, queueSentence, resetQueue, resetScan, resetMoodScan]);

  if (!character) {
    notFound();
  }

  // Auto-enable TTS when user speaks via mic
  const handleVoiceUsed = useCallback(() => {
    if (!isEnabledRef.current) {
      setIsEnabled(true);
    }
  }, [setIsEnabled]);

  function handleSend(message: string) {
    stop(); // Stop any current TTS
    spokenLengthRef.current = 0;
    sendMessage({ text: message });
  }

  return (
    <EncounterLayout
      character={character}
      isSpeaking={isSpeaking}
      isAiSpeaking={isLoading}
      voiceEnabled={isEnabled}
      onVoiceToggle={setIsEnabled}
    >
      <ChatInterface
        messages={messages}
        onSend={handleSend}
        isLoading={isLoading}
        character={character}
        onVoiceUsed={handleVoiceUsed}
      />
    </EncounterLayout>
  );
}
