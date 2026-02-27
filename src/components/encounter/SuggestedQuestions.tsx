"use client";

import { motion } from "motion/react";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({
  questions,
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4">
      <p className="font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Suggested questions
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {questions.map((question, index) => (
          <motion.button
            key={question}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => onSelect(question)}
            className="rounded-lg border border-border bg-stone-medium/50 px-4 py-2.5 text-left text-sm text-ink transition-all duration-300 hover:border-sacred-gold-dim hover:bg-stone-medium hover:text-sacred-gold"
          >
            {question}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
