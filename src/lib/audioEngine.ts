"use client";

// Singleton AudioContext with four-channel gain routing:
// Voice, Music, MoodOverlay, SFX → Master → Speakers

let ctx: AudioContext | null = null;
let masterGain: GainNode;
let voiceGain: GainNode;
let musicGain: GainNode;
let moodGain: GainNode;
let sfxGain: GainNode;

const MUSIC_VOLUME_NORMAL = 0.25;
const MUSIC_VOLUME_DUCKED = 0.06;
const MOOD_VOLUME_NORMAL = 0.2;
const MOOD_VOLUME_DUCKED = 0.04;
const DUCK_RAMP_TIME = 0.4; // seconds
const FADE_IN_TIME = 1.5; // seconds for music fade-in

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    voiceGain = ctx.createGain();
    musicGain = ctx.createGain();
    moodGain = ctx.createGain();
    sfxGain = ctx.createGain();

    voiceGain.connect(masterGain);
    musicGain.connect(masterGain);
    moodGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    musicGain.gain.value = 0; // Start at 0, fade in
    moodGain.gain.value = 0;
    voiceGain.gain.value = 1.0;
    sfxGain.gain.value = 0.35;
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

export function getVoiceGain(): GainNode {
  getAudioContext();
  return voiceGain;
}

export function getMusicGain(): GainNode {
  getAudioContext();
  return musicGain;
}

export function getMoodGain(): GainNode {
  getAudioContext();
  return moodGain;
}

export function getSfxGain(): GainNode {
  getAudioContext();
  return sfxGain;
}

export async function decodeAudio(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
  const context = getAudioContext();
  return context.decodeAudioData(arrayBuffer);
}

/** Fade music in from 0 to normal volume */
export function fadeInMusic() {
  if (!ctx || !musicGain) return;
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.setValueAtTime(0, ctx.currentTime);
  musicGain.gain.linearRampToValueAtTime(
    MUSIC_VOLUME_NORMAL,
    ctx.currentTime + FADE_IN_TIME
  );
}

/** Fade music out to 0 */
export function fadeOutMusic() {
  if (!ctx || !musicGain) return;
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.setValueAtTime(musicGain.gain.value, ctx.currentTime);
  musicGain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_IN_TIME);
}

export function duckMusic() {
  if (!ctx) return;
  if (musicGain) {
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setValueAtTime(musicGain.gain.value, ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(
      MUSIC_VOLUME_DUCKED,
      ctx.currentTime + DUCK_RAMP_TIME
    );
  }
  if (moodGain) {
    moodGain.gain.cancelScheduledValues(ctx.currentTime);
    moodGain.gain.setValueAtTime(moodGain.gain.value, ctx.currentTime);
    moodGain.gain.linearRampToValueAtTime(
      MOOD_VOLUME_DUCKED,
      ctx.currentTime + DUCK_RAMP_TIME
    );
  }
}

export function unduckMusic() {
  if (!ctx) return;
  if (musicGain) {
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setValueAtTime(musicGain.gain.value, ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(
      MUSIC_VOLUME_NORMAL,
      ctx.currentTime + DUCK_RAMP_TIME
    );
  }
  if (moodGain) {
    moodGain.gain.cancelScheduledValues(ctx.currentTime);
    moodGain.gain.setValueAtTime(moodGain.gain.value, ctx.currentTime);
    moodGain.gain.linearRampToValueAtTime(
      MOOD_VOLUME_NORMAL,
      ctx.currentTime + DUCK_RAMP_TIME
    );
  }
}

/** Fade mood overlay in */
export function fadeInMood() {
  if (!ctx || !moodGain) return;
  moodGain.gain.cancelScheduledValues(ctx.currentTime);
  moodGain.gain.setValueAtTime(moodGain.gain.value, ctx.currentTime);
  moodGain.gain.linearRampToValueAtTime(MOOD_VOLUME_NORMAL, ctx.currentTime + 1.0);
}

/** Fade mood overlay out */
export function fadeOutMood() {
  if (!ctx || !moodGain) return;
  moodGain.gain.cancelScheduledValues(ctx.currentTime);
  moodGain.gain.setValueAtTime(moodGain.gain.value, ctx.currentTime);
  moodGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
}

export function destroyAudioEngine() {
  if (ctx) {
    ctx.close();
    ctx = null;
  }
}
