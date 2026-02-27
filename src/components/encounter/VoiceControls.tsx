"use client";

import { Volume2, VolumeX } from "lucide-react";

interface VoiceControlsProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  isSpeaking: boolean;
}

export function VoiceControls({
  isEnabled,
  onToggle,
  isSpeaking,
}: VoiceControlsProps) {
  return (
    <button
      onClick={() => {
        onToggle(!isEnabled);
      }}
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs transition-all duration-300 hover:border-sacred-gold-dim"
      title={isEnabled ? "Disable voice" : "Enable voice"}
    >
      {isEnabled ? (
        <Volume2
          className={`h-3.5 w-3.5 ${
            isSpeaking ? "text-sacred-gold" : "text-muted-foreground"
          }`}
        />
      ) : (
        <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className="text-muted-foreground">
        {isEnabled ? "Voice on" : "Voice off"}
      </span>
    </button>
  );
}
