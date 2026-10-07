/** The sliding-tile puzzle behind the Bento egg. `order[position] = tile id`, 0 is the empty cell. Pure, so it is unit tested. */

export const SIZE = 3;
export const CELLS = SIZE * SIZE;

export const solved = (): number[] => Array.from({ length: CELLS }, (_, i) => (i + 1) % CELLS);

export const isSolved = (order: readonly number[]) => order.every((tile, i) => tile === (i + 1) % CELLS);

/** Positions next to `i` (no wrapping around the edges). */
export function neighbours(i: number): number[] {
  const row = Math.floor(i / SIZE);
  const col = i % SIZE;
  const out: number[] = [];
  if (row > 0) out.push(i - SIZE);
  if (row < SIZE - 1) out.push(i + SIZE);
  if (col > 0) out.push(i - 1);
  if (col < SIZE - 1) out.push(i + 1);
  return out;
}

/** Slides the tile at `i` into the empty cell if they touch; null when it cannot move. */
export function slide(order: readonly number[], i: number): number[] | null {
  const empty = order.indexOf(0);
  if (!neighbours(i).includes(empty)) return null;
  const next = order.slice();
  [next[i], next[empty]] = [next[empty], next[i]];
  return next;
}

/** The position whose tile moves when an arrow key is pressed (the tile slides the way the arrow points), or null. */
export function tileForArrow(order: readonly number[], key: string): number | null {
  const empty = order.indexOf(0);
  const row = Math.floor(empty / SIZE);
  const col = empty % SIZE;
  switch (key) {
    case "ArrowLeft":
      return col < SIZE - 1 ? empty + 1 : null;
    case "ArrowRight":
      return col > 0 ? empty - 1 : null;
    case "ArrowUp":
      return row < SIZE - 1 ? empty + SIZE : null;
    case "ArrowDown":
      return row > 0 ? empty - SIZE : null;
    default:
      return null;
  }
}

/** A shuffled, always solvable board: random legal slides from the solved one (never undoing the last, never ending solved). */
export function shuffle(moves = 80, rng: () => number = Math.random): number[] {
  for (;;) {
    let order = solved();
    let last = -1;
    for (let n = 0; n < moves; n++) {
      const empty = order.indexOf(0);
      const options = neighbours(empty).filter((p) => p !== last);
      const pick = options[Math.floor(rng() * options.length)];
      last = empty;
      order = slide(order, pick)!;
    }
    if (!isSolved(order)) return order;
  }
}
