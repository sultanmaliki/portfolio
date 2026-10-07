/** The rules of the Victorian tea-pouring egg: each guest asks for a level, and is judged on how close the cup comes. Pure, so it is unit tested. */

export interface Guest {
  name: string;
  request: string;
  /** How full the cup should be, 0 to 1. */
  target: number;
}

export const GUESTS: Guest[] = [
  { name: "Lady Ashworth", request: "Half a cup, and not a drop more.", target: 0.5 },
  { name: "The Colonel", request: "To the brim, if you please.", target: 0.92 },
  { name: "Miss Pemberton", request: "Three quarters, dear.", target: 0.75 },
  { name: "The Vicar", request: "Merely a splash.", target: 0.22 },
  { name: "Aunt Beatrice", request: "A generous pour, I am not made of porcelain.", target: 0.85 },
];

export interface Verdict {
  points: number;
  label: string;
}

/** How a pour is received. Over the brim is a spill, whatever was asked for. */
export function rate(fill: number, target: number): Verdict {
  if (fill > 1) return { points: 0, label: "Spilled! Disgraceful." };
  const off = Math.abs(fill - target);
  if (off <= 0.04) return { points: 3, label: "Perfectly poured." };
  if (off <= 0.09) return { points: 2, label: "Very good." };
  if (off <= 0.16) return { points: 1, label: "Adequate." };
  return { points: 0, label: fill < target ? "Rather stingy." : "Rather too much." };
}

export function rank(points: number, guests: number): string {
  const share = points / (guests * 3);
  if (share >= 0.85) return "Butler of the Year.";
  if (share >= 0.6) return "Excellent service.";
  if (share >= 0.35) return "Passable. The household will not be dismissed.";
  return "Tea is now on the carpet.";
}
