// Checks every external link in the built page (run `npm run build` first).
// Exits non-zero when a link is dead, so the weekly workflow turns red and GitHub emails the owner.
//
// 401/403/429 and LinkedIn's 999 count as alive: those sites answer scripts with bot protection
// even when the page works fine for people.
import { readFile } from "node:fs/promises";

const PAGE = new URL("../out/index.html", import.meta.url);
const OWN_HOST = "portfolio.syedmohammedsultan.online";
const ALIVE_ODD = new Set([401, 403, 429, 999]);

const html = await readFile(PAGE, "utf8").catch(() => {
  console.error("out/index.html not found. Run `npm run build` first.");
  process.exit(2);
});

const links = [
  ...new Set(
    [...html.matchAll(/href="(https?:\/\/[^"#]+)/g)]
      .map((m) => m[1].replace(/&amp;/g, "&"))
      .filter((url) => new URL(url).hostname !== OWN_HOST)
  ),
].sort();

async function check(url) {
  let last = "no response";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "User-Agent": "Mozilla/5.0 (portfolio link check)" },
      });
      if (res.status < 400 || ALIVE_ODD.has(res.status)) return { url, ok: true, status: res.status };
      last = `HTTP ${res.status}`;
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
    }
  }
  return { url, ok: false, status: last };
}

const results = await Promise.all(links.map(check));
for (const r of results) console.log(`${r.ok ? "ok  " : "DEAD"} ${String(r.status).padEnd(8)} ${r.url}`);

const dead = results.filter((r) => !r.ok);
console.log(`\n${results.length} external links checked, ${dead.length} dead.`);
if (dead.length) process.exit(1);
