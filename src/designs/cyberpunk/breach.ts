/** Breach protocol, the hacking mini-game of the Cyberpunk egg. Pure, so it is unit tested. */

export const SIZE = 5;
export const BUFFER = 6;
export const CODES = ["1C", "BD", "55", "E9", "7A", "FF"] as const;

export interface Daemon {
  codes: string[];
  name: string;
}

export interface Puzzle {
  grid: string[];
  daemons: Daemon[];
  /** One way through the grid that uploads every daemon: the guarantee that it can be won. */
  solution: number[];
}

const DAEMONS = ["ICE_BREAKER.EXE", "RESUME_DOWNLOAD.BIN", "HIRE_ME.EXE"];

/** Cells the player may pick next: the first pick comes from the top row, then the column and the row alternate. */
export function allowed(path: readonly number[], size = SIZE): number[] {
  const cells: number[] = [];
  const last = path[path.length - 1];
  const inRow = path.length % 2 === 0; // 0 picks so far: row 0; 1: the column of that pick; 2: the row of that pick...
  const row = path.length === 0 ? 0 : Math.floor(last / size);
  const col = path.length === 0 ? 0 : last % size;
  for (let i = 0; i < size * size; i++) {
    if (path.includes(i)) continue;
    if (inRow ? Math.floor(i / size) === row : i % size === col) cells.push(i);
  }
  return cells;
}

/** A random solvable puzzle: walk a legal path through the grid, make its codes the daemons, fill the rest with noise. */
export function generate(rng: () => number = Math.random, size = SIZE): Puzzle {
  const pick = <T,>(items: readonly T[]): T => items[Math.floor(rng() * items.length)];
  const path: number[] = [];
  while (path.length < BUFFER) path.push(pick(allowed(path, size)));
  const grid = Array.from({ length: size * size }, () => pick(CODES) as string);
  const codes = path.map(() => pick(CODES) as string);
  path.forEach((cell, i) => (grid[cell] = codes[i]));
  const daemons: Daemon[] = [
    { codes: codes.slice(0, 3), name: DAEMONS[0] },
    { codes: codes.slice(2, 5), name: DAEMONS[1] },
    { codes: codes.slice(1, 6), name: DAEMONS[2] },
  ];
  return { grid, daemons, solution: path };
}

/** True when the daemon's codes appear in a row anywhere in the buffer. */
export function uploaded(buffer: readonly string[], daemon: Daemon): boolean {
  const { codes } = daemon;
  for (let start = 0; start + codes.length <= buffer.length; start++) {
    if (codes.every((c, i) => buffer[start + i] === c)) return true;
  }
  return false;
}

/** Whether a daemon can still be finished with the slots left (its start may overlap the end of the buffer). */
export function reachable(buffer: readonly string[], daemon: Daemon, size = BUFFER): boolean {
  if (uploaded(buffer, daemon)) return true;
  const left = size - buffer.length;
  const { codes } = daemon;
  for (let overlap = Math.min(buffer.length, codes.length - 1); overlap >= 0; overlap--) {
    const tail = buffer.slice(buffer.length - overlap);
    if (tail.every((c, i) => c === codes[i]) && codes.length - overlap <= left) return true;
  }
  return false;
}
