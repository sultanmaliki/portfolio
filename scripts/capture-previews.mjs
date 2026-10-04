// Regenerates the thumbnails the design switcher shows: public/design-previews/<slug>.jpg
//
//   npm run build && npm run previews
//
// It serves ./out itself, opens every live design at 1280x800 with reduced motion (so animations are
// already at their final frame and the shots are reproducible), hides the switcher, and saves a
// 320x200 JPEG. (Rendering at a tiny device scale factor changes text widths, so it screenshots at full
// size and downsamples in a canvas in two halving steps.) Set PW_CHANNEL=chrome to use an installed Chrome instead of Playwright's Chromium.
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { parseRegistry } from "./new-design.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(ROOT, "out");
const TARGET = join(ROOT, "public", "design-previews");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
};

/** A tiny static server for the exported site: "/designs/x/" maps to out/designs/x/index.html. */
function serve() {
  const server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
    let file = normalize(join(OUT, pathname));
    if (!file.startsWith(OUT + sep) && file !== OUT) {
      res.writeHead(403).end();
      return;
    }
    if (pathname.endsWith("/")) file = join(file, "index.html");
    else if (!extname(file) && existsSync(join(file, "index.html"))) file = join(file, "index.html");
    try {
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" }).end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function main() {
  if (!existsSync(join(OUT, "index.html"))) {
    console.error("out/ is missing. Run `npm run build` first.");
    process.exit(1);
  }

  const registry = await readFile(join(ROOT, "src", "designs", "registry.ts"), "utf8");
  const slugs = parseRegistry(registry)
    .filter((entry) => entry.status === "live")
    .map((entry) => entry.slug);
  const only = process.argv.slice(2);
  const wanted = only.length ? slugs.filter((slug) => only.includes(slug)) : slugs;

  await mkdir(TARGET, { recursive: true });
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});

  const scaler = await (await browser.newContext()).newPage();
  const downscale = (png) =>
    scaler.evaluate(async (base64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${base64}`;
      await img.decode();
      let source = img;
      for (const [w, h] of [[640, 400], [320, 200]]) {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(source, 0, 0, w, h);
        source = canvas;
      }
      return source.toDataURL("image/jpeg", 0.78).split(",")[1];
    }, png.toString("base64"));

  try {
    for (const slug of wanted) {
      const path = slug === "cinematic" ? "/" : `/designs/${slug}/`;
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(base + path, { waitUntil: "load" });
      await page.addStyleTag({ content: "[data-design-switcher]{display:none!important}" });
      await page.getByRole("heading", { level: 1 }).first().waitFor();
      // Fonts, hero animation and (for the cinematic design) the first scroll frames
      await page.waitForTimeout(slug === "cinematic" ? 7000 : 2500);
      const small = await downscale(await page.screenshot({ type: "png" }));
      await writeFile(join(TARGET, `${slug}.jpg`), Buffer.from(small, "base64"));
      await context.close();
      console.log(`captured ${slug}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
