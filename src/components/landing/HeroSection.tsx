"use client";

import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {/* Background gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Decorative top line */}
      <motion.div
        className="scroll-divider mb-12 w-48"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 192, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Main title */}
      <motion.h1
        className="font-[family-name:var(--font-cinzel-decorative)] text-4xl font-bold tracking-wide text-sacred-gold sm:text-5xl md:text-7xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Voices of Scripture
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-6 max-w-2xl font-[family-name:var(--font-cinzel)] text-lg tracking-wide text-muted-foreground sm:text-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Walk with the figures of the Bible.
        <br />
        Hear their stories in their own words.
      </motion.p>

      {/* Decorative bottom line */}
      <motion.div
        className="scroll-divider mt-12 w-48"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 192, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
      />

      {/* Scroll hint */}
      <motion.p
        className="mt-16 font-[family-name:var(--font-inter)] text-xs uppercase tracking-[0.3em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        Explore the biblical world
      </motion.p>
    </section>
  );
}
