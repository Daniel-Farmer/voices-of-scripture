"use client";

import { useState, useCallback, type FormEvent, type KeyboardEvent } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onVoiceUsed?: () => void;
}

export function ChatInput({ onSend, isLoading, onVoiceUsed }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleVoiceResult = useCallback(
    (transcript: string) => {
      const trimmed = transcript.trim();
      if (trimmed && !isLoading) {
        onVoiceUsed?.();
        onSend(trimmed);
      }
    },
    [onSend, isLoading, onVoiceUsed]
  );

  const { startListening, stopListening, isListening, transcript, isSupported } =
    useSpeechRecognition({ onResult: handleVoiceResult });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleMicClick() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 border-t border-border bg-stone-dark/80 px-4 py-4 backdrop-blur-sm"
    >
      <textarea
        value={isListening ? transcript : input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Listening..." : "Speak..."}
        rows={1}
        readOnly={isListening}
        className={cn(
          "flex-1 resize-none rounded-lg border bg-stone-medium px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1",
          isListening
            ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
            : "border-border focus:border-sacred-gold-dim focus:ring-sacred-gold-dim"
        )}
      />

      {/* Microphone button */}
      {isSupported && (
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isLoading}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 disabled:opacity-30",
            isListening
              ? "animate-pulse border-red-500 bg-red-500/20 text-red-400"
              : "border-border bg-stone-medium text-muted-foreground hover:border-sacred-gold-dim hover:text-sacred-gold"
          )}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Send button */}
      <button
        type="submit"
        disabled={isLoading || (!input.trim() && !isListening)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-sacred-gold-dim bg-sacred-gold-dim/10 text-sacred-gold transition-all duration-300 hover:bg-sacred-gold-dim/20 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
