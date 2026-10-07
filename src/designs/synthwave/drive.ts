import { clamp, rand } from "../shared/eggKit";

/** The road, rules and drawing of the Synthwave outrun game, kept outside React: it changes every frame. */

export const W = 480;
export const H = 270;
const HORIZON = 118;
const LANES = [-0.62, 0, 0.62];
const ROAD = 200; // half the road's width at the bottom of the screen

export interface Item {
  lane: number;
  z: number;
  kind: "wall" | "orb";
}

export interface Run {
  lane: number; // 0..2
  x: number; // smoothed lane position, in lanes
  items: Item[];
  speed: number;
  dist: number;
  orbs: number;
  next: number;
  t: number;
}

export const fresh = (): Run => ({ lane: 1, x: 1, items: [], speed: 16, dist: 0, orbs: 0, next: 18, t: 0 });
export const points = (r: Run) => Math.floor(r.dist / 2) + r.orbs * 10;
const project = (z: number) => 1 / (1 + z * 0.16);
const rowY = (p: number) => HORIZON + (H - HORIZON) * p;

export function steer(r: Run, dir: -1 | 1) {
  r.lane = clamp(r.lane + dir, 0, 2);
}

/** Runs the road one frame. Returns true when the car has hit a barrier. */
export function advance(r: Run, dt: number): boolean {
  r.t += dt;
  r.speed = Math.min(16 + r.t * 0.55, 40);
  r.dist += r.speed * dt;
  r.x += (r.lane - r.x) * Math.min(dt * 14, 1);
  r.next -= r.speed * dt;
  if (r.next <= 0) {
    // always one open lane, sometimes with an orb in it
    const open = Math.floor(rand(0, 3));
    for (let lane = 0; lane < 3; lane++) {
      if (lane === open) {
        if (Math.random() < 0.6) r.items.push({ lane, z: 62, kind: "orb" });
      } else if (Math.random() < 0.7) r.items.push({ lane, z: 62, kind: "wall" });
    }
    r.next = rand(14, 24) + r.speed * 0.2;
  }
  for (const it of r.items) it.z -= r.speed * dt;
  r.items = r.items.filter((it) => it.z > -1);
  let crashed = false;
  for (const it of r.items) {
    if (it.z > 0.2 && it.z < 1.8 && Math.abs(it.lane - r.x) < 0.55) {
      if (it.kind === "orb") {
        r.orbs += 1;
        it.z = -5;
      } else crashed = true;
    }
  }
  return crashed;
}

export function draw(ctx: CanvasRenderingContext2D, r: Run, crashed: boolean) {
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
  sky.addColorStop(0, "#14072a");
  sky.addColorStop(0.6, "#7a1b7d");
  sky.addColorStop(1, "#ff2a6d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, HORIZON);
  // sun with slats
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, HORIZON);
  ctx.clip();
  const sun = ctx.createLinearGradient(0, 40, 0, HORIZON);
  sun.addColorStop(0, "#ffd166");
  sun.addColorStop(1, "#ff2a6d");
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(W / 2, HORIZON - 8, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7a1b7d";
  for (let i = 0; i < 6; i++) ctx.fillRect(W / 2 - 60, HORIZON - 52 + i * 11, 120, 1.5 + i * 0.7);
  ctx.restore();

  // ground and its grid
  ctx.fillStyle = "#14072a";
  ctx.fillRect(0, HORIZON, W, H - HORIZON);
  ctx.strokeStyle = "rgba(5, 217, 232, 0.55)";
  ctx.lineWidth = 1;
  for (let k = 0; k < 18; k++) {
    const z = k * 3.5 - (r.dist % 3.5);
    if (z < 0) continue;
    const y = rowY(project(z));
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let i = -9; i <= 9; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2, HORIZON);
    ctx.lineTo(W / 2 + i * 90, H);
    ctx.stroke();
  }

  // the road, edged in neon, with scrolling lane dashes
  ctx.fillStyle = "#1a0b2e";
  ctx.beginPath();
  ctx.moveTo(W / 2 - 2, HORIZON);
  ctx.lineTo(W / 2 + 2, HORIZON);
  ctx.lineTo(W / 2 + ROAD, H);
  ctx.lineTo(W / 2 - ROAD, H);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ff2a6d";
  ctx.shadowColor = "#ff2a6d";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 2, HORIZON);
  ctx.lineTo(W / 2 - ROAD, H);
  ctx.moveTo(W / 2 + 2, HORIZON);
  ctx.lineTo(W / 2 + ROAD, H);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#05d9e8";
  ctx.lineWidth = 2;
  for (const off of [-0.31, 0.31]) {
    for (let k = 0; k < 14; k++) {
      const z0 = k * 4 - (r.dist % 4);
      if (z0 < 0) continue;
      const p0 = project(z0);
      const p1 = project(z0 + 2);
      ctx.beginPath();
      ctx.moveTo(W / 2 + off * 2 * ROAD * p0, rowY(p0));
      ctx.lineTo(W / 2 + off * 2 * ROAD * p1, rowY(p1));
      ctx.stroke();
    }
  }

  // barriers and orbs, far to near
  for (const it of [...r.items].sort((a, b) => b.z - a.z)) {
    if (it.z < -0.5) continue;
    const p = project(Math.max(it.z, 0));
    const cx = W / 2 + LANES[it.lane] * ROAD * p;
    const y = rowY(p);
    const lane = ROAD * 0.62 * p;
    if (it.kind === "wall") {
      const w = lane * 0.9;
      const h = lane * 0.55;
      ctx.fillStyle = "#14072a";
      ctx.strokeStyle = "#ff2a6d";
      ctx.lineWidth = Math.max(1, 3 * p);
      ctx.shadowColor = "#ff2a6d";
      ctx.shadowBlur = 8;
      ctx.fillRect(cx - w / 2, y - h, w, h);
      ctx.strokeRect(cx - w / 2, y - h, w, h);
      ctx.shadowBlur = 0;
      ctx.beginPath();
      for (let s = -1; s <= 1; s += 0.5) {
        ctx.moveTo(cx + (s * w) / 2 - w * 0.12, y);
        ctx.lineTo(cx + (s * w) / 2 + w * 0.12, y - h);
      }
      ctx.stroke();
    } else {
      const rad = Math.max(2, lane * 0.2);
      ctx.fillStyle = "#05d9e8";
      ctx.shadowColor = "#05d9e8";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx, y - rad * 1.8, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // the car, seen from behind
  ctx.save();
  ctx.translate(W / 2 + (r.x - 1) * 0.62 * ROAD, H - 22);
  if (crashed) ctx.rotate(0.35);
  ctx.fillStyle = "#14072a";
  ctx.strokeStyle = "#ff2a6d";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#ff2a6d";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(-34, 0);
  ctx.lineTo(-28, -22);
  ctx.lineTo(-14, -34);
  ctx.lineTo(14, -34);
  ctx.lineTo(28, -22);
  ctx.lineTo(34, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#7a1b7d";
  ctx.fillRect(-18, -29, 36, 11);
  ctx.fillStyle = "#05d9e8";
  ctx.fillRect(-30, -12, 14, 5);
  ctx.fillRect(16, -12, 14, 5);
  ctx.restore();
}
