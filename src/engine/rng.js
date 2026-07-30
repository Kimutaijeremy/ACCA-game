// rng.js — a tiny seeded PRNG, so parameterized items regenerate their numbers reproducibly.
//
// Parameterized templates (Brief §6.3 anti-memorisation) author the skeleton once and let the
// numbers change per attempt. For the attempt log to stay the single source of truth, an instance
// must be reproducible from a seed: the app picks a seed, logs it, and the exact item can be
// rebuilt for review or audit. mulberry32 is small, fast and deterministic — enough for drilling,
// and it is NOT used for anything security-sensitive.

/** mulberry32 — a 32-bit seeded generator returning floats in [0,1). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A convenience wrapper handed to generators, so item authors never touch raw floats.
 * @param {number} seed
 */
export function makeRng(seed) {
  const next = mulberry32(seed);
  const api = {
    /** float in [0,1). */
    unit: () => next(),
    /** inclusive integer in [min,max]. */
    int(min, max) { return min + Math.floor(next() * (max - min + 1)); },
    /** float in [min,max), rounded to dp decimals. */
    float(min, max, dp = 2) {
      const v = min + next() * (max - min);
      const f = 10 ** dp;
      return Math.round(v * f) / f;
    },
    /** a random element of arr. */
    pick(arr) { return arr[Math.floor(next() * arr.length)]; },
    /** true with probability p. */
    bool(p = 0.5) { return next() < p; },
    /** an integer multiple of `step` in [min,max] (e.g. round money to the nearest 50). */
    step(min, max, step) {
      const n = Math.floor((max - min) / step) + 1;
      return min + step * Math.floor(next() * n);
    },
  };
  return api;
}

/** A stable-ish seed from a string id, for deterministic previews/tests. */
export function seedFromString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
