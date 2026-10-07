import { rand } from "../shared/eggKit";

/** The world, rules and drawing of the Pixel-art coin runner, kept outside React: it changes every frame. */

export const W = 320;
export const H = 180;
const GROUND = 140;
const GRAVITY = 950;
export const JUMP = 340;
const HERO_X = 44;
const BODY = 16;

const PALETTE: Record<string, string> = { r: "#ff004d", w: "#fff1e8", k: "#0d1530", b: "#29adff", y: "#ffec27" };
const HERO = ["..rrrr..", ".rrrrrr.", ".wwkwwk.", ".wwwwww.", "..bbbb..", ".bbbbbb.", ".bb..bb.", ".yy..yy."];

export interface Thing {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "spike" | "block" | "coin";
}

export interface World {
  y: number;
  vy: number;
  things: Thing[];
  speed: number;
  dist: number;
  coins: number;
  nextAt: number;
  t: number;
}

export const fresh = (): World => ({ y: GROUND - BODY, vy: 0, things: [], speed: 95, dist: 0, coins: 0, nextAt: 140, t: 0 });
export const score = (w: World) => w.coins * 10 + Math.floor(w.dist / 8);
export const onGround = (w: World) => w.y >= GROUND - BODY - 0.5;

export function jumpIfGrounded(w: World) {
  if (onGround(w)) w.vy = -JUMP;
}

/** Letting go of the jump early cuts it short, for a low hop. */
export function shortHop(w: World) {
  if (w.vy < -130) w.vy = -130;
}

/** Runs the world one frame. Returns true when the hero has hit something that hurts. */
export function advance(w: World, dt: number): boolean {
  w.t += dt;
  w.speed = Math.min(95 + w.t * 4.5, 215);
  w.dist += w.speed * dt;
  w.vy += GRAVITY * dt;
  w.y = Math.min(w.y + w.vy * dt, GROUND - BODY);
  if (w.y >= GROUND - BODY) w.vy = 0;

  // the next obstacle (with a little arc of coins over it) appears once enough ground has scrolled by
  w.nextAt -= w.speed * dt;
  if (w.nextAt <= 0) {
    const spike = Math.random() < 0.55;
    const width = spike ? (Math.random() < 0.4 ? 24 : 12) : 16;
    const height = spike ? 10 : Math.random() < 0.5 ? 16 : 24;
    const x = W + 8;
    w.things.push({ x, y: GROUND - height, w: width, h: height, kind: spike ? "spike" : "block" });
    const mid = x + width / 2;
    for (let i = -1; i <= 1; i++) w.things.push({ x: mid + i * 14 - 4, y: GROUND - height - 22 - (i === 0 ? 14 : 4), w: 8, h: 8, kind: "coin" });
    w.nextAt = w.speed * 0.85 + width + 20 + rand(0, 90);
  }

  for (const t of w.things) t.x -= w.speed * dt;
  w.things = w.things.filter((t) => t.x + t.w > -20);

  // collisions, a little forgiving
  const hero = { x: HERO_X + 3, y: w.y + 3, w: 10, h: 12 };
  let hurt = false;
  for (const t of w.things) {
    const touching = hero.x < t.x + t.w - 1 && hero.x + hero.w > t.x + 1 && hero.y < t.y + t.h - 1 && hero.y + hero.h > t.y + 1;
    if (!touching) continue;
    if (t.kind === "coin") {
      w.coins += 1;
      t.x = -999;
    } else {
      hurt = true;
    }
  }
  return hurt;
}

/** Draws the scene: sky, hills, ground, things and hero. `running` makes the hero's legs move. */
export function draw(ctx: CanvasRenderingContext2D, w: World, hills: readonly number[], running: boolean) {
  ctx.fillStyle = "#0d1530";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#1d2b53";
  for (let i = 0; i < hills.length; i++) {
    const span = hills.length * 26;
    const hx = ((((i * 26 - w.dist * 0.2) % span) + span) % span) - 26;
    ctx.fillRect(hx, GROUND - hills[i], 26, hills[i]);
  }
  ctx.fillStyle = "#fff1e8";
  for (let i = 0; i < 24; i++) {
    const sx = (((i * 53) % W) - w.dist * 0.05 + W * 2) % W;
    ctx.fillRect(sx, (i * 29) % 80, 1, 1);
  }
  ctx.fillStyle = "#5f574f";
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = "#00e436";
  ctx.fillRect(0, GROUND, W, 3);
  ctx.fillStyle = "#3b2f28";
  for (let i = 0; i < 24; i++) ctx.fillRect((((i * 16 - w.dist) % 384) + 384) % 384 - 16, GROUND + 12, 8, 2);

  for (const t of w.things) {
    if (t.kind === "coin") {
      const spin = Math.abs(Math.sin(w.t * 8 + t.x * 0.05));
      const cw = 2 + Math.round(spin * 6);
      ctx.fillStyle = "#ffec27";
      ctx.fillRect(Math.round(t.x + (8 - cw) / 2), Math.round(t.y), cw, 8);
      ctx.fillStyle = "#ff9d00";
      ctx.fillRect(Math.round(t.x + (8 - cw) / 2), Math.round(t.y) + 6, cw, 2);
    } else if (t.kind === "block") {
      ctx.fillStyle = "#83769c";
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.fillStyle = "#c2c3c7";
      ctx.fillRect(t.x, t.y, t.w, 2);
      ctx.fillStyle = "#5f574f";
      ctx.fillRect(t.x, t.y + t.h - 2, t.w, 2);
    } else {
      ctx.fillStyle = "#ff004d";
      for (let s = 0; s < t.w / 12; s++) {
        for (let row = 0; row < t.h; row += 2) ctx.fillRect(t.x + s * 12 + row * 0.6, t.y + row, 12 - row * 1.2, 2);
      }
    }
  }

  // the hero, two pixels per sprite pixel; the legs alternate while running on the ground
  const step = running && onGround(w) && Math.floor(w.t * 10) % 2 === 0;
  HERO.forEach((row, ry) => {
    [...row].forEach((c, rx) => {
      if (c === ".") return;
      const legShift = ry >= 6 && step ? (rx < 4 ? 1 : -1) : 0;
      ctx.fillStyle = PALETTE[c];
      ctx.fillRect(HERO_X + rx * 2 + legShift, Math.round(w.y) + ry * 2, 2, 2);
    });
  });
}
