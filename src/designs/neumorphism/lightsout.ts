/** Lights Out, the puzzle behind the Neumorphism egg: pressing a cell flips it and its four neighbours; switch every light off. Pure, so it is unit tested. */

export const SIZE = 5;

/** Presses cell `i`: flips it and the cells above, below, left and right of it. */
export function press(board: readonly boolean[], i: number, size = SIZE): boolean[] {
  const next = board.slice();
  const row = Math.floor(i / size);
  const col = i % size;
  const flip = (r: number, c: number) => {
    if (r >= 0 && r < size && c >= 0 && c < size) next[r * size + c] = !next[r * size + c];
  };
  flip(row, col);
  flip(row - 1, col);
  flip(row + 1, col);
  flip(row, col - 1);
  flip(row, col + 1);
  return next;
}

export const isSolved = (board: readonly boolean[]) => board.every((lit) => !lit);

export interface Puzzle {
  board: boolean[];
  /** The presses that made it, so pressing the same cells again solves it. This is what hints are drawn from. */
  presses: number[];
}

/**
 * A puzzle that is always solvable: start from all lights off and press `2 + level` distinct cells (capped), then
 * hand over the result. Higher levels mean more presses to undo.
 */
export function scramble(level: number, rng: () => number = Math.random, size = SIZE): Puzzle {
  const cells = size * size;
  const count = Math.min(2 + level, 14);
  for (;;) {
    const chosen = new Set<number>();
    while (chosen.size < count) chosen.add(Math.floor(rng() * cells));
    const presses = [...chosen];
    const board = presses.reduce<boolean[]>((b, i) => press(b, i, size), Array(cells).fill(false));
    if (!isSolved(board)) return { board, presses };
  }
}

/** The presses still needed: the scramble presses with the visitor's own presses cancelled out (a cell pressed twice is back to normal). */
export function remaining(presses: readonly number[], pressed: readonly number[]): number[] {
  const left = new Set(presses);
  for (const i of pressed) {
    if (left.has(i)) left.delete(i);
    else left.add(i);
  }
  return [...left];
}
