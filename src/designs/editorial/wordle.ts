/** The word game behind the Editorial egg: guess a five-letter word from the developer's vocabulary in six tries. Pure, so it is unit tested. */

export const WORDS = [
  "array", "async", "await", "build", "cache", "class", "clone", "cloud", "const", "debug", "error", "event", "fetch", "field", "hooks", "index",
  "input", "linux", "logic", "login", "merge", "mongo", "mount", "nodes", "patch", "props", "query", "react", "redux", "regex", "route", "scope",
  "shell", "stack", "state", "store", "token", "types", "yield", "while",
] as const;

export const LENGTH = 5;
export const TRIES = 6;

export type Mark = "correct" | "present" | "absent";

/** Marks each letter of `guess` against `answer` the way the newspaper puzzle does, with repeated letters counted correctly. */
export function score(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(guess.length).fill("absent");
  const unused = new Map<string, number>();
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) marks[i] = "correct";
    else unused.set(answer[i], (unused.get(answer[i]) ?? 0) + 1);
  }
  for (let i = 0; i < guess.length; i++) {
    if (marks[i] === "correct") continue;
    const left = unused.get(guess[i]) ?? 0;
    if (left > 0) {
      marks[i] = "present";
      unused.set(guess[i], left - 1);
    }
  }
  return marks;
}

/** Today's word: the same for everyone on a given (UTC) day, so it really is a daily puzzle. */
export function dailyWord(now: Date = new Date()): string {
  const day = Math.floor(now.getTime() / 86_400_000);
  return WORDS[day % WORDS.length];
}

const RANK: Record<Mark, number> = { absent: 0, present: 1, correct: 2 };

/** The best mark each letter has earned so far, for colouring the on-screen keyboard. */
export function keyMarks(guesses: readonly string[], answer: string): Record<string, Mark> {
  const out: Record<string, Mark> = {};
  for (const g of guesses) {
    score(g, answer).forEach((m, i) => {
      const current = out[g[i]];
      if (!current || RANK[m] > RANK[current]) out[g[i]] = m;
    });
  }
  return out;
}
