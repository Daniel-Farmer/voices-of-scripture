"""
Generate ambient music tracks, mood overlays, and SFX for Voices of Scripture.
Uses only Python standard library (wave, struct, math, random).
Outputs WAV files at 22050 Hz, 16-bit mono.
"""

import wave
import struct
import math
import random
import os
import array

SAMPLE_RATE = 22050
TWO_PI = 2 * math.pi

BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "audio")
MUSIC_DIR = os.path.join(BASE_DIR, "music")
MOODS_DIR = os.path.join(BASE_DIR, "music", "moods")
SFX_DIR = os.path.join(BASE_DIR, "sfx")


def ensure_dirs():
    for d in [MUSIC_DIR, MOODS_DIR, SFX_DIR]:
        os.makedirs(d, exist_ok=True)


def write_wav(filepath, samples):
    """Write float samples (-1..1) to 16-bit mono WAV."""
    data = array.array('h', (int(max(-1.0, min(1.0, s)) * 32000) for s in samples))
    with wave.open(filepath, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        f.writeframes(data.tobytes())
    size_kb = os.path.getsize(filepath) // 1024
    print(f"  -> {os.path.basename(filepath)} ({size_kb} KB)")


def sine(freq, n_samples, phase=0):
    """Generate sine wave samples."""
    return [math.sin(TWO_PI * freq * i / SAMPLE_RATE + phase) for i in range(n_samples)]


def noise(n_samples):
    """White noise."""
    return [random.uniform(-1, 1) for _ in range(n_samples)]


def lp_filter(samples, cutoff):
    """Simple one-pole low-pass filter."""
    rc = 1.0 / (TWO_PI * cutoff)
    dt = 1.0 / SAMPLE_RATE
    a = dt / (rc + dt)
    out = [samples[0]]
    for i in range(1, len(samples)):
        out.append(out[-1] + a * (samples[i] - out[-1]))
    return out


def hp_filter(samples, cutoff):
    """Simple one-pole high-pass filter."""
    rc = 1.0 / (TWO_PI * cutoff)
    dt = 1.0 / SAMPLE_RATE
    a = rc / (rc + dt)
    out = [samples[0]]
    for i in range(1, len(samples)):
        out.append(a * (out[-1] + samples[i] - samples[i-1]))
    return out


def mix(tracks, volumes=None):
    """Mix tracks together and normalize."""
    if volumes is None:
        volumes = [1.0] * len(tracks)
    max_len = max(len(t) for t in tracks)
    result = [0.0] * max_len
    for track, vol in zip(tracks, volumes):
        for i in range(len(track)):
            result[i] += track[i] * vol
    peak = max((abs(s) for s in result), default=1)
    if peak > 0.001:
        norm = 0.75 / peak
        result = [s * norm for s in result]
    return result


def fade(samples, fade_in_ms=300, fade_out_ms=300):
    """Apply fade in/out for smooth looping."""
    n = len(samples)
    fi = int(fade_in_ms * SAMPLE_RATE / 1000)
    fo = int(fade_out_ms * SAMPLE_RATE / 1000)
    for i in range(min(fi, n)):
        samples[i] *= i / fi
    for i in range(min(fo, n)):
        samples[n - 1 - i] *= i / fo
    return samples


def crossfade_loop(samples, xfade_ms=1000):
    """Make samples loop seamlessly by crossfading the end into the start."""
    xf = int(xfade_ms * SAMPLE_RATE / 1000)
    n = len(samples)
    if xf > n // 2:
        xf = n // 4
    for i in range(xf):
        t = i / xf
        samples[i] = samples[i] * t + samples[n - xf + i] * (1 - t)
    return samples[:n - xf]


def am_modulate(samples, mod_freq, depth=0.5):
    """Amplitude modulate."""
    return [s * (1 - depth + depth * math.sin(TWO_PI * mod_freq * i / SAMPLE_RATE))
            for i, s in enumerate(samples)]


def env_adsr(n, attack, decay, sustain_level, release):
    """Generate ADSR envelope."""
    a = int(attack * SAMPLE_RATE)
    d = int(decay * SAMPLE_RATE)
    r = int(release * SAMPLE_RATE)
    s = n - a - d - r
    if s < 0:
        s = 0
    env = []
    for i in range(min(a, n)):
        env.append(i / max(a, 1))
    for i in range(min(d, n - len(env))):
        env.append(1.0 - (1.0 - sustain_level) * i / max(d, 1))
    for i in range(min(s, n - len(env))):
        env.append(sustain_level)
    for i in range(min(r, n - len(env))):
        env.append(sustain_level * (1 - i / max(r, 1)))
    while len(env) < n:
        env.append(0.0)
    return env[:n]


# ─── MUSIC TRACKS (15 seconds each) ─────────────────────────────────────────

def gen_exodus_journey():
    """Moses: Desert wind, low drone, distant shimmer."""
    dur = 15
    n = dur * SAMPLE_RATE
    # Low drone
    drone = sine(65, n)
    drone2 = sine(97.5, n)
    # Desert wind (filtered noise)
    wind = lp_filter(noise(n), 400)
    wind = am_modulate(wind, 0.15, 0.6)
    # High shimmer
    shimmer = sine(880, n)
    shimmer = am_modulate(shimmer, 0.08, 0.9)
    result = mix([drone, drone2, wind, shimmer], [0.3, 0.2, 0.5, 0.1])
    return crossfade_loop(result, 2000)


def gen_shepherd_psalms():
    """David: Gentle harp-like arpeggios, warm pastoral."""
    dur = 15
    n = dur * SAMPLE_RATE
    # Warm pad (major chord)
    pad_d = sine(146.83, n)  # D3
    pad_a = sine(220, n)     # A3
    pad_fs = sine(185, n)    # F#3
    pad = mix([pad_d, pad_a, pad_fs], [0.3, 0.2, 0.2])
    # Gentle harp notes (arpeggiated)
    harp = [0.0] * n
    notes = [293.66, 369.99, 440, 554.37, 440, 369.99]  # D4 F#4 A4 C#5 A4 F#4
    note_dur = int(1.2 * SAMPLE_RATE)
    for j, freq in enumerate(notes):
        start = int(j * 2.2 * SAMPLE_RATE) % n
        env = env_adsr(note_dur, 0.01, 0.3, 0.2, 0.8)
        for i in range(min(note_dur, n - start)):
            harp[start + i] += math.sin(TWO_PI * freq * i / SAMPLE_RATE) * env[i] * 0.3
            # Add harmonic
            harp[start + i] += math.sin(TWO_PI * freq * 2 * i / SAMPLE_RATE) * env[i] * 0.1
    result = mix([pad, harp], [0.6, 0.5])
    return crossfade_loop(result, 2000)


def gen_temple_grandeur():
    """Solomon: Deep resonant tones, reverberant majesty."""
    dur = 15
    n = dur * SAMPLE_RATE
    # Deep bass drone
    bass = sine(55, n)
    bass2 = sine(82.5, n)
    # Resonant fifth
    fifth = sine(165, n)
    fifth = am_modulate(fifth, 0.05, 0.4)
    # High ethereal
    eth = sine(440, n)
    eth = am_modulate(eth, 0.03, 0.8)
    eth2 = sine(660, n)
    eth2 = am_modulate(eth2, 0.04, 0.85)
    result = mix([bass, bass2, fifth, eth, eth2], [0.35, 0.25, 0.2, 0.1, 0.08])
    return crossfade_loop(result, 2000)


def gen_galilean_peace():
    """Jesus: Gentle water textures, warm peaceful ambient."""
    dur = 15
    n = dur * SAMPLE_RATE
    # Warm pad in C major
    c = sine(130.81, n)  # C3
    e = sine(164.81, n)  # E3
    g = sine(196, n)     # G3
    pad = mix([c, e, g], [0.3, 0.25, 0.2])
    # Gentle water-like noise
    water = lp_filter(noise(n), 300)
    water = am_modulate(water, 0.2, 0.7)
    # Soft high tone
    high = sine(523.25, n)  # C5
    high = am_modulate(high, 0.06, 0.9)
    result = mix([pad, water, high], [0.5, 0.35, 0.08])
    return crossfade_loop(result, 2000)


def gen_mediterranean_voyage():
    """Paul: Sea breeze, gentle rhythmic movement, journeying feel."""
    dur = 15
    n = dur * SAMPLE_RATE
    # Sea noise (filtered, rhythmic)
    sea = lp_filter(noise(n), 500)
    sea = am_modulate(sea, 0.12, 0.6)
    # Low drone (ship creaking feel)
    drone = sine(73.42, n)  # D2
    drone = am_modulate(drone, 0.08, 0.3)
    # Moving fifth
    a = sine(110, n)
    e = sine(164.81, n)
    movement = mix([a, e], [0.3, 0.2])
    movement = am_modulate(movement, 0.07, 0.4)
    result = mix([sea, drone, movement], [0.45, 0.3, 0.25])
    return crossfade_loop(result, 2000)


def gen_fishermans_shore():
    """Peter: Shore waves, calm water, humble atmosphere."""
    dur = 15
    n = dur * SAMPLE_RATE
    # Shore waves (slow amplitude-modulated noise)
    waves = lp_filter(noise(n), 350)
    waves = am_modulate(waves, 0.08, 0.7)
    # Gentle G minor pad
    g = sine(98, n)     # G2
    bb = sine(116.54, n) # Bb2
    d = sine(146.83, n)  # D3
    pad = mix([g, bb, d], [0.25, 0.2, 0.2])
    pad = am_modulate(pad, 0.04, 0.3)
    result = mix([waves, pad], [0.5, 0.4])
    return crossfade_loop(result, 2000)


# ─── MOOD OVERLAYS (12 seconds each) ────────────────────────────────────────

def gen_mood_divine():
    """Ethereal, shimmering, heavenly."""
    dur = 12
    n = dur * SAMPLE_RATE
    # High shimmering tones
    h1 = sine(880, n)
    h1 = am_modulate(h1, 0.06, 0.7)
    h2 = sine(1108.73, n)  # C#6
    h2 = am_modulate(h2, 0.05, 0.75)
    h3 = sine(1318.51, n)  # E6
    h3 = am_modulate(h3, 0.04, 0.8)
    # Subtle low foundation
    base = sine(220, n)
    base = am_modulate(base, 0.03, 0.5)
    result = mix([h1, h2, h3, base], [0.3, 0.25, 0.2, 0.15])
    return crossfade_loop(result, 1500)


def gen_mood_lament():
    """Low, minor, mournful."""
    dur = 12
    n = dur * SAMPLE_RATE
    # D minor chord, low
    d = sine(73.42, n)   # D2
    f = sine(87.31, n)   # F2
    a = sine(110, n)     # A2
    pad = mix([d, f, a], [0.35, 0.25, 0.2])
    pad = am_modulate(pad, 0.04, 0.3)
    # Mournful high note
    high = sine(293.66, n)  # D4
    high = am_modulate(high, 0.02, 0.6)
    result = mix([pad, high], [0.6, 0.25])
    return crossfade_loop(result, 1500)


def gen_mood_praise():
    """Bright, major, uplifting."""
    dur = 12
    n = dur * SAMPLE_RATE
    # G major, bright
    g = sine(196, n)      # G3
    b = sine(246.94, n)   # B3
    d = sine(293.66, n)   # D4
    g2 = sine(392, n)     # G4
    pad = mix([g, b, d, g2], [0.3, 0.25, 0.25, 0.2])
    # Shimmering high
    high = sine(783.99, n)  # G5
    high = am_modulate(high, 0.08, 0.7)
    result = mix([pad, high], [0.6, 0.2])
    return crossfade_loop(result, 1500)


def gen_mood_trial():
    """Tense, dissonant, low rumble."""
    dur = 12
    n = dur * SAMPLE_RATE
    # Low rumble
    rumble = lp_filter(noise(n), 100)
    rumble = am_modulate(rumble, 0.1, 0.5)
    # Dissonant tritone
    b1 = sine(61.74, n)   # B1
    f = sine(87.31, n)    # F2 (tritone)
    tension = mix([b1, f], [0.3, 0.3])
    # Unsettling high
    high = sine(466.16, n)  # Bb4
    high = am_modulate(high, 0.15, 0.8)
    result = mix([rumble, tension, high], [0.4, 0.35, 0.12])
    return crossfade_loop(result, 1500)


# ─── SOUND EFFECTS (1-4 seconds each) ───────────────────────────────────────

def gen_shofar_blast():
    """Rising brass-like horn call."""
    dur = 3.0
    n = int(dur * SAMPLE_RATE)
    env = env_adsr(n, 0.15, 0.2, 0.8, 0.5)
    result = []
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = 220 + 60 * t  # Rising pitch
        s = math.sin(TWO_PI * freq * t) * 0.6
        s += math.sin(TWO_PI * freq * 2 * t) * 0.25  # 2nd harmonic
        s += math.sin(TWO_PI * freq * 3 * t) * 0.1   # 3rd harmonic
        result.append(s * env[i])
    return fade(result, 50, 200)


def gen_thunder_divine():
    """Low rumble with sharp crack."""
    dur = 3.5
    n = int(dur * SAMPLE_RATE)
    # Crack (noise burst)
    crack = noise(n)
    crack_env = env_adsr(n, 0.005, 0.15, 0.0, 0.0)
    crack = [c * e for c, e in zip(crack, crack_env)]
    # Rumble
    rumble = lp_filter(noise(n), 80)
    rumble_env = env_adsr(n, 0.05, 0.5, 0.4, 1.5)
    rumble = [r * e for r, e in zip(rumble, rumble_env)]
    return mix([crack, rumble], [0.5, 0.6])


def gen_sea_waves():
    """Wave crash and gentle recede."""
    dur = 4.0
    n = int(dur * SAMPLE_RATE)
    raw = noise(n)
    wave_sound = lp_filter(raw, 500)
    # Wave envelope: rise then slow fall
    env = []
    for i in range(n):
        t = i / SAMPLE_RATE
        e = math.exp(-0.5 * t) * math.sin(math.pi * t / dur) * 2
        env.append(max(0, min(1, e)))
    result = [w * e for w, e in zip(wave_sound, env)]
    return fade(result, 100, 500)


def gen_fire_holy():
    """Crackling fire sound."""
    dur = 3.0
    n = int(dur * SAMPLE_RATE)
    result = [0.0] * n
    # Base crackle (filtered noise bursts)
    for _ in range(40):
        start = random.randint(0, n - 500)
        burst_len = random.randint(100, 600)
        burst = noise(burst_len)
        burst = lp_filter(burst, random.uniform(800, 2000))
        vol = random.uniform(0.2, 0.6)
        for i in range(burst_len):
            if start + i < n:
                result[start + i] += burst[i] * vol
    # Low fire hum
    hum = lp_filter(noise(n), 200)
    result = mix([result, hum], [0.6, 0.3])
    return fade(result, 200, 300)


def gen_crowd_multitude():
    """Murmuring crowd."""
    dur = 3.5
    n = int(dur * SAMPLE_RATE)
    # Layered filtered noise for crowd
    low = lp_filter(noise(n), 300)
    low = am_modulate(low, 0.3, 0.4)
    mid = lp_filter(noise(n), 800)
    mid = hp_filter(mid, 200)
    mid = am_modulate(mid, 0.5, 0.5)
    env = env_adsr(n, 0.3, 0.3, 0.7, 0.8)
    result = mix([low, mid], [0.5, 0.4])
    result = [r * e for r, e in zip(result, env)]
    return result


def gen_harp_strum():
    """Plucked harp/lyre chord."""
    dur = 3.0
    n = int(dur * SAMPLE_RATE)
    result = [0.0] * n
    # D major arpeggio: D4 F#4 A4 D5
    freqs = [293.66, 369.99, 440, 587.33]
    for j, freq in enumerate(freqs):
        start = int(j * 0.08 * SAMPLE_RATE)
        note_n = n - start
        env = env_adsr(note_n, 0.005, 0.1, 0.15, 2.5)
        for i in range(note_n):
            s = math.sin(TWO_PI * freq * i / SAMPLE_RATE) * 0.4
            s += math.sin(TWO_PI * freq * 2 * i / SAMPLE_RATE) * 0.15
            s += math.sin(TWO_PI * freq * 3 * i / SAMPLE_RATE) * 0.05
            result[start + i] += s * env[i]
    peak = max(abs(s) for s in result)
    if peak > 0:
        result = [s / peak * 0.75 for s in result]
    return result


def gen_stone_tablets():
    """Heavy stone impact."""
    dur = 2.0
    n = int(dur * SAMPLE_RATE)
    # Impact
    impact = noise(n)
    impact = lp_filter(impact, 200)
    impact_env = env_adsr(n, 0.002, 0.08, 0.1, 1.5)
    # Low thud
    thud = sine(50, n)
    thud_env = env_adsr(n, 0.005, 0.15, 0.05, 0.8)
    result = mix(
        [[i * e for i, e in zip(impact, impact_env)],
         [t * e for t, e in zip(thud, thud_env)]],
        [0.5, 0.5]
    )
    return result


def gen_shepherd_flock():
    """Sheep/flock ambient sounds."""
    dur = 3.0
    n = int(dur * SAMPLE_RATE)
    result = [0.0] * n
    # A few "baa" sounds (nasal filtered tones)
    for _ in range(3):
        start = random.randint(0, n - SAMPLE_RATE)
        baa_n = int(0.6 * SAMPLE_RATE)
        env = env_adsr(baa_n, 0.05, 0.1, 0.5, 0.3)
        freq = random.uniform(300, 500)
        for i in range(baa_n):
            s = math.sin(TWO_PI * freq * i / SAMPLE_RATE) * 0.3
            s += math.sin(TWO_PI * freq * 1.5 * i / SAMPLE_RATE) * 0.15
            # Vibrato
            s *= (1 + 0.2 * math.sin(TWO_PI * 6 * i / SAMPLE_RATE))
            if start + i < n:
                result[start + i] += s * env[i]
    # Light breeze
    breeze = lp_filter(noise(n), 400)
    result = mix([result, breeze], [0.5, 0.2])
    return fade(result, 200, 300)


def gen_chains_prison():
    """Metallic chain clanking."""
    dur = 2.5
    n = int(dur * SAMPLE_RATE)
    result = [0.0] * n
    # Multiple metallic clinks
    for j in range(4):
        start = int(j * 0.5 * SAMPLE_RATE + random.uniform(0, 0.1) * SAMPLE_RATE)
        clink_n = int(0.4 * SAMPLE_RATE)
        env = env_adsr(clink_n, 0.001, 0.02, 0.1, 0.35)
        freq = random.uniform(2000, 4000)
        for i in range(clink_n):
            s = math.sin(TWO_PI * freq * i / SAMPLE_RATE) * 0.3
            s += math.sin(TWO_PI * freq * 1.6 * i / SAMPLE_RATE) * 0.2
            s += noise(1)[0] * 0.1 * env[i]
            if start + i < n:
                result[start + i] += s * env[i]
    return fade(result, 50, 200)


def gen_rooster_crow():
    """Rising rooster call."""
    dur = 2.0
    n = int(dur * SAMPLE_RATE)
    result = [0.0] * n
    # Two-part crow
    parts = [(0.0, 0.4, 600, 900), (0.5, 0.8, 700, 1100)]
    for start_t, crow_dur, freq_start, freq_end in parts:
        start = int(start_t * SAMPLE_RATE)
        crow_n = int(crow_dur * SAMPLE_RATE)
        env = env_adsr(crow_n, 0.03, 0.1, 0.7, 0.2)
        for i in range(crow_n):
            t = i / crow_n
            freq = freq_start + (freq_end - freq_start) * t
            s = math.sin(TWO_PI * freq * i / SAMPLE_RATE) * 0.4
            s += math.sin(TWO_PI * freq * 2 * i / SAMPLE_RATE) * 0.15
            s += math.sin(TWO_PI * freq * 3 * i / SAMPLE_RATE) * 0.08
            # Add nasal quality
            s *= (1 + 0.3 * math.sin(TWO_PI * 8 * i / SAMPLE_RATE))
            if start + i < n:
                result[start + i] += s * env[i]
    peak = max(abs(s) for s in result)
    if peak > 0:
        result = [s / peak * 0.7 for s in result]
    return result


def gen_temple_bells():
    """Bell-like tones."""
    dur = 3.5
    n = int(dur * SAMPLE_RATE)
    result = [0.0] * n
    # Two bells
    for j, freq in enumerate([523.25, 659.25]):  # C5, E5
        start = int(j * 1.2 * SAMPLE_RATE)
        bell_n = n - start
        env = env_adsr(bell_n, 0.002, 0.05, 0.2, 2.5)
        for i in range(bell_n):
            s = math.sin(TWO_PI * freq * i / SAMPLE_RATE) * 0.35
            s += math.sin(TWO_PI * freq * 2.76 * i / SAMPLE_RATE) * 0.15  # Inharmonic
            s += math.sin(TWO_PI * freq * 5.4 * i / SAMPLE_RATE) * 0.08
            result[start + i] += s * env[i]
    peak = max(abs(s) for s in result)
    if peak > 0:
        result = [s / peak * 0.7 for s in result]
    return result


def gen_desert_wind():
    """Howling desert wind."""
    dur = 3.5
    n = int(dur * SAMPLE_RATE)
    wind = noise(n)
    wind = lp_filter(wind, 600)
    wind = am_modulate(wind, 0.25, 0.6)
    # Whistling overtone
    whistle = sine(800, n)
    whistle = am_modulate(whistle, 0.15, 0.9)
    env = env_adsr(n, 0.5, 0.3, 0.6, 1.0)
    result = mix([wind, whistle], [0.6, 0.08])
    result = [r * e for r, e in zip(result, env)]
    return result


def gen_hammer_nails():
    """Rhythmic hammer strikes."""
    dur = 3.0
    n = int(dur * SAMPLE_RATE)
    result = [0.0] * n
    # Three strikes
    for j in range(3):
        start = int(j * 0.8 * SAMPLE_RATE)
        strike_n = int(0.3 * SAMPLE_RATE)
        env = env_adsr(strike_n, 0.001, 0.02, 0.05, 0.25)
        for i in range(strike_n):
            s = noise(1)[0] * 0.5  # Impact noise
            s += math.sin(TWO_PI * 150 * i / SAMPLE_RATE) * 0.3  # Low thud
            if start + i < n:
                result[start + i] += s * env[i]
    peak = max(abs(s) for s in result) or 1
    result = [s / peak * 0.7 for s in result]
    return fade(result, 50, 200)


def gen_water_pour():
    """Water pouring/flowing."""
    dur = 3.0
    n = int(dur * SAMPLE_RATE)
    water = noise(n)
    water = lp_filter(water, 1500)
    water = hp_filter(water, 200)
    water = am_modulate(water, 0.8, 0.3)
    env = env_adsr(n, 0.3, 0.2, 0.6, 0.8)
    result = [w * e for w, e in zip(water, env)]
    return result


# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    ensure_dirs()
    random.seed(42)  # Reproducible

    print("Generating character music tracks...")
    tracks = [
        ("exodus-journey.wav", gen_exodus_journey),
        ("shepherd-psalms.wav", gen_shepherd_psalms),
        ("temple-grandeur.wav", gen_temple_grandeur),
        ("galilean-peace.wav", gen_galilean_peace),
        ("mediterranean-voyage.wav", gen_mediterranean_voyage),
        ("fishermans-shore.wav", gen_fishermans_shore),
    ]
    for name, gen_fn in tracks:
        write_wav(os.path.join(MUSIC_DIR, name), gen_fn())

    print("\nGenerating mood overlays...")
    moods = [
        ("mood-divine.wav", gen_mood_divine),
        ("mood-lament.wav", gen_mood_lament),
        ("mood-praise.wav", gen_mood_praise),
        ("mood-trial.wav", gen_mood_trial),
    ]
    for name, gen_fn in moods:
        write_wav(os.path.join(MOODS_DIR, name), gen_fn())

    print("\nGenerating sound effects...")
    sfx = [
        ("shofar-blast.wav", gen_shofar_blast),
        ("thunder-divine.wav", gen_thunder_divine),
        ("sea-waves.wav", gen_sea_waves),
        ("fire-holy.wav", gen_fire_holy),
        ("crowd-multitude.wav", gen_crowd_multitude),
        ("harp-strum.wav", gen_harp_strum),
        ("stone-tablets.wav", gen_stone_tablets),
        ("shepherd-flock.wav", gen_shepherd_flock),
        ("chains-prison.wav", gen_chains_prison),
        ("rooster-crow.wav", gen_rooster_crow),
        ("temple-bells.wav", gen_temple_bells),
        ("desert-wind.wav", gen_desert_wind),
        ("hammer-nails.wav", gen_hammer_nails),
        ("water-pour.wav", gen_water_pour),
    ]
    for name, gen_fn in sfx:
        write_wav(os.path.join(SFX_DIR, name), gen_fn())

    print(f"\nDone! Generated {len(tracks) + len(moods) + len(sfx)} audio files.")


if __name__ == "__main__":
    main()
