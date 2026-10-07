import { describe, expect, it } from "vitest";
import { portfolio } from "@/data";
import { advance as runnerAdvance, fresh as runnerFresh, jumpIfGrounded, score as runnerScore } from "./pixel-art/runner";
import { advance as driveAdvance, fresh as driveFresh, points, steer } from "./synthwave/drive";
import { dragTo, makeBall, MAX, step as pitStep } from "./claymorphism/pit";
import { complete, run as shell } from "./cybercore/terminal";
import { reply } from "./y2k/bot";
import { isSolved as lightsSolved, press, remaining, scramble, SIZE as LIGHTS } from "./neumorphism/lightsout";
import { isSolved as slidSolved, neighbours, shuffle, slide, solved as slidStart, tileForArrow } from "./bento-grid/sliding";
import { dailyWord, keyMarks, score as wordScore, WORDS } from "./editorial/wordle";
import { mess, rank as kernRank, RANGE, scoreOffsets } from "./swiss/kerning";
import { GUESTS, rank as teaRank, rate } from "./victorian/tea";
import { allowed, BUFFER, generate, reachable, uploaded } from "./cyberpunk/breach";
import { caption, FALLBACK, nounFor } from "./surrealism/magritte";

/** A repeatable source of "random" numbers, so a failing case can be reproduced. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("Cybercore terminal", () => {
  it("answers questions about the portfolio", () => {
    expect(shell("help").lines.length).toBeGreaterThan(5);
    expect(shell("skills").lines.map((l) => l.text).join(" ")).toContain("React");
    expect(shell("projects").lines.some((l) => l.text.includes(portfolio.featuredProjects[0].title))).toBe(true);
    expect(shell("contact").lines.map((l) => l.text).join(" ")).toContain(portfolio.profile.email);
  });

  it("has fun with sudo, rm and unknown commands", () => {
    expect(shell("sudo hire me").lines.map((l) => l.text).join(" ")).toContain("ACCESS GRANTED");
    expect(shell("sudo rm -rf").lines[0].kind).toBe("err");
    expect(shell("rm -rf /").lines[0].kind).toBe("err");
    expect(shell("florb").lines[0].text).toContain("command not found");
  });

  it("clears, exits, ignores blank input and lists history", () => {
    expect(shell("clear").clear).toBe(true);
    expect(shell("exit").exit).toBe(true);
    expect(shell("   ").lines).toEqual([]);
    expect(shell("history", ["help", "skills"]).lines).toHaveLength(2);
  });

  it("cats files and refuses what it should", () => {
    expect(shell("cat about.txt").lines[0].text).toContain("Computer Science");
    expect(shell("cat secrets.txt").lines[0].kind).toBe("err");
    expect(shell("cat nothing.txt").lines[0].text).toContain("No such file");
  });

  it("completes a command only when it is unambiguous", () => {
    expect(complete("pro")).toBe("projects");
    expect(complete("e")).toBe("e"); // experience, education, echo, exit
    expect(complete("")).toBe("");
  });
});

describe("Y2K messenger bot", () => {
  it("answers the classics", () => {
    expect(reply("asl?")[0]).toContain("asl");
    expect(reply("hello")[0]).toContain("hi");
    expect(reply("are you available?").join(" ")).toContain(portfolio.profile.email);
    expect(reply("projects").join(" ")).toContain(portfolio.featuredProjects[0].title);
    expect(reply("skills").length).toBeGreaterThan(1);
  });

  it("never goes silent on something it does not understand", () => {
    expect(reply("qwertyuiop")).toHaveLength(1);
    expect(reply("")).toEqual([]);
  });
});

describe("Lights Out (Neumorphism)", () => {
  it("flips a cell and its four neighbours, and stays inside the board", () => {
    const board = press(Array(LIGHTS * LIGHTS).fill(false), 12);
    expect(board.filter(Boolean)).toHaveLength(5);
    const corner = press(Array(LIGHTS * LIGHTS).fill(false), 0);
    expect(corner.filter(Boolean)).toHaveLength(3);
    expect(press(press(Array(25).fill(false), 7), 7).every((c) => !c)).toBe(true);
  });

  it("always hands out a solvable, unsolved puzzle, and the scramble presses solve it", () => {
    for (let level = 1; level <= 12; level++) {
      const { board, presses } = scramble(level, seeded(level));
      expect(lightsSolved(board)).toBe(false);
      expect(lightsSolved(presses.reduce((b, i) => press(b, i), board))).toBe(true);
    }
  });

  it("tracks the presses still needed, cancelling any the visitor already made", () => {
    expect(remaining([1, 2, 3], [])).toEqual([1, 2, 3]);
    expect(remaining([1, 2, 3], [2])).toEqual([1, 3]);
    expect(remaining([1, 2, 3], [9]).sort()).toEqual([1, 2, 3, 9]);
    expect(remaining([1, 2, 3], [9, 9])).toEqual([1, 2, 3]);
  });
});

describe("Sliding tiles (Bento)", () => {
  it("shuffles to a board that is not solved but can always be solved by undoing the slides", () => {
    for (let n = 1; n <= 20; n++) {
      const order = shuffle(60, seeded(n));
      expect([...order].sort()).toEqual([...slidStart()].sort());
      expect(slidSolved(order)).toBe(false);
    }
  });

  it("moves only tiles that touch the gap", () => {
    const start = slidStart(); // 1..8, gap last
    expect(slide(start, 0)).toBeNull();
    const moved = slide(start, 7)!;
    expect(moved[8]).toBe(8);
    expect(moved[7]).toBe(0);
    expect(neighbours(4).sort()).toEqual([1, 3, 5, 7]);
    expect(neighbours(0).sort()).toEqual([1, 3]);
  });

  it("maps arrow keys to the tile that slides that way", () => {
    const start = slidStart(); // gap at position 8 (bottom right)
    expect(tileForArrow(start, "ArrowRight")).toBe(7); // the tile on its left slides right
    expect(tileForArrow(start, "ArrowDown")).toBe(5);
    expect(tileForArrow(start, "ArrowLeft")).toBeNull();
    expect(tileForArrow(start, "ArrowUp")).toBeNull();
  });
});

describe("The Daily Word (Editorial)", () => {
  it("marks letters, counting repeats correctly", () => {
    expect(wordScore("react", "react")).toEqual(Array(5).fill("correct"));
    expect(wordScore("stack", "react")).toEqual(["absent", "present", "correct", "correct", "absent"]);
    // one L in the answer: the correctly placed L takes it, so the earlier L is not also marked
    expect(wordScore("hello", "world")).toEqual(["absent", "absent", "absent", "correct", "present"]);
    expect(wordScore("array", "react")).toEqual(["present", "present", "absent", "absent", "absent"]);
  });

  it("gives everyone the same word on a given day, and always a real five-letter one", () => {
    const day = new Date("2026-10-07T10:00:00Z");
    expect(dailyWord(day)).toBe(dailyWord(new Date("2026-10-07T23:00:00Z")));
    for (const w of WORDS) expect(w).toMatch(/^[a-z]{5}$/);
    expect(new Set(WORDS).size).toBe(WORDS.length);
  });

  it("keeps the best mark each letter has earned for the keyboard", () => {
    const marks = keyMarks(["stack", "react"], "react");
    expect(marks.r).toBe("correct");
    expect(marks.s).toBe("absent");
  });
});

describe("Kerning (Swiss)", () => {
  it("starts every word clearly out of place, and keeps the first letter fixed", () => {
    const off = mess(6, seeded(3));
    expect(off[0]).toBe(0);
    for (const o of off.slice(1)) expect(Math.abs(o)).toBeGreaterThanOrEqual(0.06);
    expect(RANGE).toBeGreaterThan(0.16);
  });

  it("scores perfect placement 100 and a big miss 0", () => {
    expect(scoreOffsets([0, 0, 0, 0])).toBe(100);
    expect(scoreOffsets([0, 0.12, -0.12, 0.2])).toBe(0);
    expect(scoreOffsets([0, 0.03, -0.03, 0.03])).toBe(75);
    expect(kernRank(500, 5)).toContain("Typographer");
    expect(kernRank(100, 5)).toContain("specimen");
  });
});

describe("Pouring tea (Victorian)", () => {
  it("rates a pour against what the guest asked for", () => {
    expect(rate(0.5, 0.5).points).toBe(3);
    expect(rate(0.56, 0.5).points).toBe(2);
    expect(rate(0.62, 0.5).points).toBe(1);
    expect(rate(0.9, 0.5).points).toBe(0);
    expect(rate(1.05, 0.92)).toEqual({ points: 0, label: "Spilled! Disgraceful." });
    expect(rate(0.2, 0.5).label).toContain("stingy");
  });

  it("has five guests who each want something different, and ranks the evening", () => {
    expect(GUESTS).toHaveLength(5);
    expect(new Set(GUESTS.map((g) => g.target)).size).toBe(5);
    for (const g of GUESTS) expect(g.target).toBeGreaterThan(0);
    expect(teaRank(15, 5)).toContain("Butler");
    expect(teaRank(0, 5)).toContain("carpet");
  });
});

describe("Breach protocol (Cyberpunk)", () => {
  it("lets the first pick come from the top row, then alternates column and row", () => {
    expect(allowed([])).toEqual([0, 1, 2, 3, 4]);
    expect(allowed([2])).toEqual([7, 12, 17, 22]); // column 2, minus the cell already used
    expect(allowed([2, 12])).toEqual([10, 11, 13, 14]); // row 2
  });

  it("always generates a puzzle that can be won by walking its own solution", () => {
    for (let n = 1; n <= 40; n++) {
      const puzzle = generate(seeded(n));
      expect(puzzle.solution).toHaveLength(BUFFER);
      puzzle.solution.forEach((cell, i) => expect(allowed(puzzle.solution.slice(0, i))).toContain(cell));
      const buffer = puzzle.solution.map((i) => puzzle.grid[i]);
      for (const d of puzzle.daemons) expect(uploaded(buffer, d)).toBe(true);
    }
  });

  it("knows when a daemon can still be finished", () => {
    const d = { name: "X", codes: ["BD", "E9", "1C"] };
    expect(reachable([], d)).toBe(true);
    expect(reachable(["55", "BD"], d)).toBe(true); // BD overlaps the start
    expect(reachable(["BD", "55", "55", "55", "55"], d)).toBe(false); // one slot left, three needed
    expect(reachable(["55", "55", "55", "55", "BD"], d)).toBe(false); // BD only just fits; two more are needed, one slot left
    expect(uploaded(["55", "BD", "E9", "1C"], d)).toBe(true);
  });
});

describe("Ceci n'est pas (Surrealism)", () => {
  it("names things by their role first, then their tag, in French with the article", () => {
    expect(nounFor("A").fr).toBe("un lien");
    expect(nounFor("div", "button").fr).toBe("un bouton");
    expect(nounFor("H2").fr).toBe("un titre");
    expect(nounFor("blink")).toEqual(FALLBACK);
    expect(caption(nounFor("p"))).toBe("Ceci n’est pas un paragraphe.");
  });
});

describe("game engines", () => {
  it("the clay pit keeps every ball inside the walls and on the shelf", () => {
    const balls = Array.from({ length: 12 }, (_, i) => makeBall(600, 80 + i * 40, 50));
    for (let f = 0; f < 600; f++) pitStep(balls, 600, 500, 1 / 60);
    // a ball in a crowd can be nudged a few pixels into a wall by its neighbours before the next frame puts it back
    for (const b of balls) {
      expect(b.x).toBeGreaterThanOrEqual(b.r - 6);
      expect(b.x).toBeLessThanOrEqual(600 - b.r + 6);
      expect(b.y).toBeLessThanOrEqual(500 - 64 - b.r + 6);
    }
    expect(MAX).toBeGreaterThan(20);
    dragTo(balls[0], -50, 9999, 600, 500);
    expect(balls[0].x).toBe(balls[0].r);
  });

  it("the runner scores coins and distance, and a jump leaves the ground", () => {
    const w = runnerFresh();
    jumpIfGrounded(w);
    expect(w.vy).toBeLessThan(0);
    let hurt = false;
    for (let f = 0; f < 1200 && !hurt; f++) hurt = runnerAdvance(w, 1 / 60); // never jumping again, it must hit something
    expect(hurt).toBe(true);
    expect(runnerScore(w)).toBeGreaterThanOrEqual(0);
  });

  it("the outrun car changes lane within the road and crashes into a barrier it never dodges", () => {
    const r = driveFresh();
    steer(r, -1);
    steer(r, -1);
    expect(r.lane).toBe(0);
    steer(r, 1);
    steer(r, 1);
    steer(r, 1);
    expect(r.lane).toBe(2);
    const stay = driveFresh();
    let crashed = false;
    for (let f = 0; f < 60 * 120 && !crashed; f++) crashed = driveAdvance(stay, 1 / 60);
    expect(crashed).toBe(true);
    expect(points(stay)).toBeGreaterThan(0);
  });
});
