"use client";

import { cn } from "@/lib/utils";
import { BookOpen, User } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  characterName?: string;
}

// Strip ElevenLabs audio tags from displayed text (they're only for TTS)
function stripVoiceTags(text: string): string {
  return text
    .replace(/\[(sigh|cough|laugh|whisper|gasp|happy|sad|angry|surprised)\]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function MessageBubble({ role, content, characterName }: MessageBubbleProps) {
  const isCharacter = role === "assistant";
  const displayContent = isCharacter ? stripVoiceTags(content) : content;

  return (
    <div
      className={cn(
        "flex gap-3",
        isCharacter ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar icon */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isCharacter
            ? "bg-sacred-gold/10 text-sacred-gold"
            : "bg-stone-light text-muted-foreground"
        )}
      >
        {isCharacter ? <BookOpen className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* Message content */}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isCharacter
            ? "character-message"
            : "bg-stone-light/50 text-foreground"
        )}
      >
        {isCharacter && characterName && (
          <p className="mb-1 font-[family-name:var(--font-cinzel)] text-xs font-semibold uppercase tracking-widest text-sacred-gold-dim">
            {characterName}
          </p>
        )}
        <div className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
          {displayContent}
        </div>
      </div>
    </div>
  );
}
