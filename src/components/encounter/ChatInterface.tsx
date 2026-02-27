"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ChatInput } from "./ChatInput";
import { motion, AnimatePresence } from "motion/react";
import type { Character } from "@/types";
import type { UIMessage } from "ai";

const GREETING_TRIGGER = "I come seeking your wisdom.";

interface ChatInterfaceProps {
  messages: UIMessage[];
  onSend: (message: string) => void;
  isLoading: boolean;
  character: Character;
  onVoiceUsed?: () => void;
}

export function ChatInterface({
  messages,
  onSend,
  isLoading,
  character,
  onVoiceUsed,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter out the auto-greeting trigger so it looks like the character just speaks on entry
  const visibleMessages = messages.filter((m) => {
    if (m.role !== "user") return true;
    const text =
      m.parts
        ?.filter(
          (p): p is { type: "text"; text: string } => p.type === "text"
        )
        .map((p) => p.text)
        .join("") ?? "";
    return text !== GREETING_TRIGGER;
  });
  const hasMessages = visibleMessages.length > 0;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <AnimatePresence mode="sync">
          {!hasMessages ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center gap-8 py-12"
            >
              <div className="text-center">
                <p className="font-[family-name:var(--font-cinzel)] text-sm text-muted-foreground">
                  You stand before
                </p>
                <p className="mt-1 font-[family-name:var(--font-cinzel)] text-lg text-sacred-gold">
                  {character.name}
                </p>
              </div>
              <SuggestedQuestions
                questions={character.suggestedQuestions}
                onSelect={onSend}
              />
            </motion.div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {visibleMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble
                    role={message.role as "user" | "assistant"}
                    content={
                      message.parts
                        ?.filter(
                          (p): p is { type: "text"; text: string } =>
                            p.type === "text"
                        )
                        .map((p) => p.text)
                        .join("") ?? ""
                    }
                    characterName={
                      message.role === "assistant" ? character.name : undefined
                    }
                  />
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading &&
                visibleMessages[visibleMessages.length - 1]?.role !== "assistant" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 px-11 text-sm italic text-muted-foreground"
                  >
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sacred-gold-dim" />
                    {character.name} considers your words...
                  </motion.div>
                )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <ChatInput onSend={onSend} isLoading={isLoading} onVoiceUsed={onVoiceUsed} />
    </div>
  );
}
