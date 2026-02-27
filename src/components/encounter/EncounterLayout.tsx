"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CharacterAvatar } from "./CharacterAvatar";
import { VoiceControls } from "./VoiceControls";
import { SignOutButton } from "@/components/SignOutButton";
import type { Character } from "@/types";

const characterAccents: Record<string, string> = {
  moses: "#c9884c",
  "king-david": "#4a80b0",
  "king-solomon": "#7a4a8a",
  jesus: "#c9a84c",
  paul: "#a05040",
  peter: "#4a8070",
};

interface EncounterLayoutProps {
  character: Character;
  isSpeaking: boolean;
  isAiSpeaking: boolean;
  voiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}

export function EncounterLayout({
  character,
  isSpeaking,
  isAiSpeaking,
  voiceEnabled,
  onVoiceToggle,
  children,
}: EncounterLayoutProps) {
  const accent = characterAccents[character.id] ?? "#c9a84c";

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-stone-dark/80 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return</span>
        </Link>

        <div className="flex flex-col items-center">
          <span
            className="font-[family-name:var(--font-cinzel)] text-sm font-semibold tracking-wide"
            style={{ color: accent }}
          >
            {character.name}
          </span>
          <span className="font-[family-name:var(--font-inter)] text-[10px] text-muted-foreground">
            {character.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <VoiceControls
            isEnabled={voiceEnabled}
            onToggle={onVoiceToggle}
            isSpeaking={isSpeaking}
          />
          <SignOutButton />
        </div>
      </header>

      {/* Accent line */}
      <div
        className="h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}40, ${accent}80, ${accent}40, transparent)`,
        }}
      />

      {/* Avatar area */}
      <div className="relative border-b border-border bg-gradient-to-b from-stone-dark to-background px-4 py-6">
        {/* Character accent tint */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center top, ${accent}18, transparent 70%)`,
          }}
        />
        <CharacterAvatar
          character={character}
          isSpeaking={isAiSpeaking || isSpeaking}
        />
      </div>

      {/* Chat area */}
      {children}
    </div>
  );
}
