"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CharacterAvatar } from "./CharacterAvatar";
import { VoiceControls } from "./VoiceControls";
import { SignOutButton } from "@/components/SignOutButton";
import type { Character } from "@/types";

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

        <div className="flex items-center gap-4">
          <VoiceControls
          isEnabled={voiceEnabled}
          onToggle={onVoiceToggle}
          isSpeaking={isSpeaking}
        />
          <SignOutButton />
        </div>
      </header>

      {/* Avatar area */}
      <div className="border-b border-border bg-gradient-to-b from-stone-dark to-background px-4 py-6">
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
