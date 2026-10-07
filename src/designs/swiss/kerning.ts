/** Scoring for the Swiss kerning egg. Offsets are in em: how far each letter sits from where the typeface's own kerning put it. Pure, so it is unit tested. */

export const WORDS = ["WAVE", "TYPO", "AWAY", "FAVOR", "LAYOUT"] as const;

/** How far a letter may be moved either way, in em. */
export const RANGE = 0.3;

/** A starting position that is clearly wrong: every letter after the first pushed 0.06 to 0.16 em off, either way. */
export function mess(length: number, rng: () => number = Math.random): number[] {
  return Array.from({ length }, (_, i) => {
    if (i === 0) return 0;
    const size = 0.06 + rng() * 0.1;
    return rng() < 0.5 ? -size : size;
  });
}

/** 0 to 100: the mean distance of the letters from their true place, where 0.12 em or more off scores nothing. */
export function scoreOffsets(offsets: readonly number[]): number {
  const moved = offsets.slice(1);
  if (!moved.length) return 100;
  const mean = moved.reduce((sum, o) => sum + Math.abs(o), 0) / moved.length;
  return Math.round(100 * Math.max(0, 1 - mean / 0.12));
}

export function rank(total: number, rounds: number): string {
  const average = total / rounds;
  if (average >= 90) return "Typographer. The grid salutes you.";
  if (average >= 75) return "A designer's eye.";
  if (average >= 55) return "Competent. Nobody will notice. Everybody will feel it.";
  return "Needs more time with a type specimen.";
}
