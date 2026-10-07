import { clamp, pick, rand } from "../shared/eggKit";

/** The physics and drawing of the Claymorphism ball pit, kept outside React: it mutates its balls many times a frame. */

export const CLAY = [
  { light: "#ffe6ee", base: "#ffc2d4", dark: "#e79bb4" },
  { light: "#e3f2ff", base: "#bde0fe", dark: "#90bde6" },
  { light: "#fff8cc", base: "#fff0a8", dark: "#e6d276" },
  { light: "#dcfaec", base: "#b9f3d8", dark: "#8ad3b2" },
  { light: "#ece2ff", base: "#d9c8ff", dark: "#b5a0ee" },
  { light: "#ffe6d3", base: "#ffd3b6", dark: "#eeaf88" },
];
export const MAX = 60;
export const SHELF = 64; // space left under the balls for the floating design switcher
const GRAVITY = 1500;
const BOUNCE = 0.78;

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tone: (typeof CLAY)[number];
  /** squash spring: how flat it is, how fast that is changing, and the direction it was hit from */
  s: number;
  sv: number;
  sa: number;
  /** how long it keeps its surprised "o" mouth, and its blink timer */
  oh: number;
  blink: number;
}

export function makeBall(width: number, x?: number, y?: number): Ball {
  const r = rand(24, 38) * (width < 520 ? 0.8 : 1);
  return { x: x ?? rand(r, width - r), y: y ?? -r, vx: rand(-160, 160), vy: rand(0, 120), r, tone: pick(CLAY), s: 0, sv: 0, sa: 0, oh: 0, blink: rand(1, 4) };
}

function bump(b: Ball, speed: number, angle: number) {
  b.sv += clamp(speed * 0.0045, 0, 2.2);
  b.sa = angle;
  if (speed > 140) b.oh = 0.4;
}

/** Moves every ball one frame: gravity, walls, the shelf, and balls bumping into each other. `held` is being dragged and ignores gravity. */
export function step(balls: Ball[], w: number, h: number, dt: number, held?: Ball) {
  const floor = h - SHELF;
  for (let pass = 0; pass < 2; pass++) {
    const t = dt / 2;
    for (const b of balls) {
      if (b === held) continue;
      b.vy += GRAVITY * t;
      b.x += b.vx * t;
      b.y += b.vy * t;
      if (b.x < b.r) {
        b.x = b.r;
        bump(b, Math.abs(b.vx), 0);
        b.vx = Math.abs(b.vx) * BOUNCE;
      } else if (b.x > w - b.r) {
        b.x = w - b.r;
        bump(b, Math.abs(b.vx), 0);
        b.vx = -Math.abs(b.vx) * BOUNCE;
      }
      if (b.y > floor - b.r) {
        b.y = floor - b.r;
        if (Math.abs(b.vy) > 60) bump(b, Math.abs(b.vy), Math.PI / 2);
        b.vy = Math.abs(b.vy) > 60 ? -Math.abs(b.vy) * BOUNCE : 0;
        b.vx *= 1 - Math.min(3 * t, 1);
      }
    }
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i];
        const b = balls[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const min = a.r + b.r;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const ma = a.r * a.r;
        const mb = b.r * b.r;
        const push = (min - d) / 2;
        const aHeld = a === held;
        const bHeld = b === held;
        if (!aHeld) {
          a.x -= nx * push * (bHeld ? 2 : 1);
          a.y -= ny * push * (bHeld ? 2 : 1);
        }
        if (!bHeld) {
          b.x += nx * push * (aHeld ? 2 : 1);
          b.y += ny * push * (aHeld ? 2 : 1);
        }
        const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (vn >= 0) continue;
        const impulse = (-(1 + BOUNCE) * vn) / (1 / ma + 1 / mb);
        if (!aHeld) {
          a.vx -= (impulse / ma) * nx;
          a.vy -= (impulse / ma) * ny;
        }
        if (!bHeld) {
          b.vx += (impulse / mb) * nx;
          b.vy += (impulse / mb) * ny;
        }
        const angle = Math.atan2(ny, nx);
        for (const x of [a, b]) {
          x.sv += clamp(-vn * 0.003, 0, 1.4);
          x.sa = angle;
          if (-vn > 160) x.oh = 0.4;
        }
      }
    }
  }
}

/** Throws everything up and sideways. */
export function shake(balls: Ball[]) {
  for (const b of balls) {
    b.vx += rand(-700, 700);
    b.vy -= rand(500, 1100);
    b.oh = 0.6;
  }
}

/** Lets go of a dragged ball with the speed the pointer had. */
export function throwBall(b: Ball, vx: number, vy: number) {
  b.vx = clamp(vx, -2200, 2200);
  b.vy = clamp(vy, -2200, 2200);
}

/** Picks a ball up: it stops dead and looks surprised. */
export function pickUp(b: Ball) {
  b.vx = 0;
  b.vy = 0;
  b.oh = 0.4;
}

/** Drags a held ball to a point, kept inside the pit. */
export function dragTo(b: Ball, x: number, y: number, w: number, h: number) {
  b.x = clamp(x, b.r, w - b.r);
  b.y = clamp(y, b.r, h - SHELF - b.r);
}

/** Draws the shelf and every ball, springing their squash back towards round. */
export function draw(ctx: CanvasRenderingContext2D, balls: Ball[], w: number, h: number, dpr: number, dt: number) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(108, 79, 224, 0.1)";
  ctx.fillRect(0, h - SHELF, w, 6);

  for (const b of balls) {
    b.sv += (-260 * b.s - 14 * b.sv) * dt;
    b.s = clamp(b.s + b.sv * dt, -0.22, 0.34);
    b.oh = Math.max(0, b.oh - dt);
    b.blink -= dt;
    if (b.blink < -0.12) b.blink = rand(1.5, 4.5);

    // body, squashed along the direction it was hit from
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.sa);
    ctx.scale(1 - b.s, 1 + b.s * 0.9);
    ctx.rotate(-b.sa);
    const g = ctx.createRadialGradient(-b.r * 0.35, -b.r * 0.4, b.r * 0.1, 0, 0, b.r * 1.05);
    g.addColorStop(0, b.tone.light);
    g.addColorStop(0.55, b.tone.base);
    g.addColorStop(1, b.tone.dark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // face: the eyes drift the way it is moving, and it blinks
    const speed = Math.hypot(b.vx, b.vy);
    const lx = clamp(b.vx / (speed + 300), -1, 1) * b.r * 0.08;
    const ly = clamp(b.vy / (speed + 300), -1, 1) * b.r * 0.08;
    const eye = b.r * 0.3;
    ctx.fillStyle = "#3b3548";
    ctx.strokeStyle = "#3b3548";
    ctx.lineWidth = Math.max(1.5, b.r * 0.07);
    ctx.lineCap = "round";
    for (const side of [-1, 1]) {
      const ex = b.x + side * eye + lx;
      const ey = b.y - b.r * 0.08 + ly;
      ctx.beginPath();
      if (b.blink < 0) {
        ctx.moveTo(ex - b.r * 0.1, ey);
        ctx.lineTo(ex + b.r * 0.1, ey);
        ctx.stroke();
      } else {
        ctx.arc(ex, ey, b.r * 0.095, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.beginPath();
    if (b.oh > 0) {
      ctx.arc(b.x + lx, b.y + b.r * 0.34 + ly, b.r * 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.arc(b.x + lx, b.y + b.r * 0.12 + ly, b.r * 0.2, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }
}
