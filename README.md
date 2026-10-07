# Syed Mohammed Sultan — Cinematic Portfolio

[![CI](https://github.com/sultanmaliki/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sultanmaliki/portfolio/actions/workflows/ci.yml)

A high-performance, interactive personal portfolio built with a focus on storytelling, motion design, and engineering depth. Designed to feel more like an interactive film or product launch rather than a traditional resume.

## 🚀 Features

- **Cinematic Scrollytelling**: A 150-frame image sequence drawn to an HTML5 `<canvas>`, mapped to scroll progress. Desktop gets the 1080p set, phones the 720p set; frames load coarse-to-fine (fewer on small screens and data-saver) so the page is usable quickly.
- **Many designs, one data store**: All content lives in typed TypeScript (`src/data`); each design is a separate route that only arranges it. A **Designs** panel (bottom-left, with a preview of each look) switches between all **23**: Cinematic, Claymorphism, Cybercore, Neo-brutalism, Scrapbook, Surrealism, Y2K, Pixel art, Synthwave, Glassmorphism, Neumorphism, Bento grid, Editorial, Swiss, Minimalism, Maximalism, Luxury typography, Conceptual sketch, Ethereal, Bohemian, Victorian, Cyberpunk and Wabi-sabi. Switching keeps you on the section you were reading (see [docs/DESIGNS.md](docs/DESIGNS.md)).
- **Recruiter-first basics**: The first screen states availability ("Open to entry-level roles") and offers View projects / Resume / Contact; featured projects carry concrete evidence (stack, what was built, numbers); the resume opens in-page; the email address can be copied.
- **Glassmorphic UI**: Beautiful, interactive glass panels with magnetic hover effects, noise textures, and subtle 3D transformations.
- **Built-in Resume Reader**: The resume opens in an on-page PDF reader (pdf.js, loaded on demand) with zoom, page count, selectable text, clickable links and a Download PDF button, instead of a bare browser PDF tab.
- **In-page Link Viewer**: Project, profile and experience links open in an on-page panel: repos as a preview card (description, topics, language, stars), live demos in an embedded browser with tab, address bar, back and reload. GitHub and LinkedIn forbid framing, so they always get the card plus an Open button.
- **Viewers that belong to each design**: the browser window and the PDF reader are one shared implementation, restyled by all 23 designs: frame, title bar and tab, toolbar, buttons, address bar, type, borders, shadows and entrance are each design's own (a taped sheet in Scrapbook, a HUD in Cybercore, a game menu in Pixel art, a bento tray in Bento grid, and so on). Switching design while a viewer is open restyles it in place. See "Themed viewers" in [docs/DESIGNS.md](docs/DESIGNS.md).
- **Animated Navigation**: Nav links scroll through the page (eased, interruptible, reduced-motion aware) so the scroll story plays on the way to a section.
- **Micro-Interactions**: Custom morphing cursors, spring animations, dynamic parallax sections, and smooth transitions powered by Framer Motion.
- **A game in every design**: each of the 23 designs hides its own small game or toy, in character: a working terminal, an MSN chat, a Wordle-style Daily Word, Lights Out, a kerning game, a gold scratch card, bubble wrap, a runner, a driving game, a breach-protocol hack, a broken bowl to mend with gold, and more. Type its secret word, or tap the name five times on a touch screen; the console hints at it. Cinematic keeps the Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`). They are modal dialogs with keyboard and touch controls, inert until triggered, and the full list is in [docs/DESIGNS.md](docs/DESIGNS.md).
- **Secure by default**: A strict Content-Security-Policy plus HSTS, `nosniff`, no-framing and a locked-down Permissions-Policy (see `public/_headers`); external links use `noopener`, embedded demos are sandboxed, and `npm audit` is clean.
- **Accessible & Responsive**: Section nav, skip link, keyboard-operable cards, visible focus, reduced-motion support, and layouts checked from 320px phones to 1920px desktops.
- **High Performance**: Object-fit canvas logic, DPR-aware canvas sizing, staged frame preloading, GPU-accelerated transforms, and a custom frame-loader.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, static export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rendering**: HTML5 Canvas API
- **Testing**: [Vitest](https://vitest.dev/) (unit) and [Playwright](https://playwright.dev/) (browser smoke tests)

## 💻 Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/sultanmaliki/portfolio.git
cd portfolio
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✅ Quality checks

| Command | What it does |
| --- | --- |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` in strict mode |
| `npm test` | Vitest unit tests: repo filtering/sorting, URL safety, click handlers, content and design-registry integrity, the scaffold script |
| `npm run build` | Static export to `out/` |
| `npm run test:e2e` | Playwright smoke tests, the design switcher, the per-design contract and the themed viewers (preview card, embedded browser and PDF reader in every design, with axe, fit, tap targets, focus and switching design while open) against `out/` on a desktop and a phone profile (first run: `npx playwright install chromium`; or set `PW_CHANNEL=chrome` to use installed Chrome) |
| `npm run new-design -- <slug>` | Scaffolds a planned design (component, route, registry status) |
| `npm run previews` | Regenerates the design-switcher thumbnails in `public/design-previews/` from the built site (`npm run build` first) |
| `npm run check:links` | Verifies every external link in the built page (also runs weekly in CI: `.github/workflows/link-check.yml`) |
| `npm run check` | lint + typecheck + unit tests + build |

Run the browser tests against the live site with `E2E_BASE_URL=https://portfolio.syedmohammedsultan.online npm run test:e2e`.
GitHub Actions (`.github/workflows/ci.yml`) runs all of the above on every push and pull request; Dependabot opens weekly grouped update PRs.

## 📂 Project Structure

```text
├── public/
│   ├── sequence-720-v2/   # cinematic design: 150 WebP frames, 1280×720 (phones, data-saver)
│   ├── sequence-hd-v2/    # the same frames at 1920×1080 (desktop)
│   ├── resume.pdf         # Downloadable resume
│   ├── og.jpg             # 1200×630 social preview image
│   ├── design-previews/   # 320×200 thumbnails shown in the design switcher (npm run previews)
│   ├── robots.txt / sitemap.xml
│   └── _headers           # Cloudflare Pages: cache + security headers (CSP, HSTS)
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout: metadata, JSON-LD, no-JS fallback, shared chrome
│   │   ├── page.tsx       # "/" serves the default design
│   │   ├── designs/<slug>/page.tsx  # one tiny route per additional live design (generated)
│   │   ├── globals.css, not-found.tsx
│   ├── data/              # ALL content, typed. Designs only read it.
│   │   ├── index.ts       # `portfolio`: everything below in one object
│   │   ├── profile.ts     # identity, availability, links, story, skills, timeline, interests
│   │   ├── experience.ts / education.ts / projects.ts
│   │   ├── config.ts      # GitHub username, excluded repos
│   │   ├── site.ts        # SEO and sharing copy
│   │   └── repos.json     # Generated GitHub snapshot (committed; refreshed by the sync workflow)
│   ├── designs/
│   │   ├── registry.ts    # every design (live and planned): name, direction, palette, status
│   │   ├── sections.ts    # the nine anchor ids every design provides
│   │   ├── metadata.ts    # route metadata helper
│   │   ├── shared/        # usePortfolio() (content + wired-up links), Reveal, SkipLink, useActiveSection, useEasterEgg + EggDialog + eggKit
│   │   ├── cinematic/     # the default design: scroll-driven film intro + glass panels
│   │   └── <slug>/        # the other 22: index.tsx, styles.module.css, viewer.css, Egg.tsx + egg.module.css, fonts.ts, fonts/ (self-hosted)
│   ├── components/        # shared chrome, mounted once in the root layout
│   │   ├── DesignSwitcher.tsx   # the panel that switches designs (usable above an open viewer)
│   │   ├── ResumeViewer.tsx     # built-in PDF reader
│   │   ├── LinkViewer.tsx       # in-page link preview card + embedded browser
│   │   ├── viewer/              # what both viewers are built from, themed per design
│   │   │   ├── ViewerFrame.tsx  #   window, title bar, toolbar slot, focus trap, Esc, entrance
│   │   │   ├── viewerTheme.tsx  #   <ViewerTheme>: how a design tells the viewers it is active
│   │   │   └── viewer.css       #   structure + --vw-* tokens; each design's viewer.css overrides them
│   │   ├── SmoothAnchors.tsx    # animated in-page navigation
│   │   ├── SiteChrome.tsx, Providers.tsx
│   ├── lib/               # behaviour any design can reuse
│   │   ├── github.ts      # repo types, API parsing/filtering, sorting
│   │   ├── useRepos.ts    # GitHub projects: snapshot first, live refresh after
│   │   ├── projects.ts    # featured/others split
│   │   ├── useCopy.ts     # copy-to-clipboard with feedback
│   │   ├── links.ts / resume.ts / seo.ts
│   └── utils/
│       ├── scroll.ts      # useScrollTransform: scroll ranges padded to 0–1
│       └── timeline.ts    # splits a section's scroll range into named phases
├── docs/DESIGNS.md        # how designs work, the contract, and what shipped in each of the 23
├── e2e/                   # Playwright: site smoke tests, design switcher, design contract
├── scripts/
│   ├── fetch-repos.mjs    # `prebuild`: snapshots public repos (drops dead homepages)
│   ├── check-links.mjs    # checks every external link in the built page
│   ├── new-design.mjs     # scaffolds a planned design (+ templates/)
│   ├── capture-previews.mjs  # renders the switcher thumbnails from out/
├── tools/frame-pipeline/  # how the cinematic frames were cleaned + upscaled (Real-ESRGAN)
├── .github/
│   ├── workflows/ci.yml, link-check.yml, sync-portfolio.yml
│   └── dependabot.yml
├── LICENSE
```

## 🎨 Designs

The portfolio can be shown in many styles from the same content. Everything is data-driven:

- **Content** lives in `src/data`. A design imports `portfolio` and never hard-codes anything.
- **The plan** lives in `src/designs/registry.ts`: 23 designs, each `live` or `planned`, with a one-line direction and a palette. The **Designs** panel is generated from it.
- **One hook** (`usePortfolio()` in `src/designs/shared`) gives every design the content, the GitHub projects and ready-made link props, so the resume reader, link viewer and copy-email behave identically everywhere.
- **Themed viewers:** the browser window and PDF reader behave identically in every design but look like each one's own. A design renders `<ViewerTheme slug fonts />` and ships a `viewer.css` of `--vw-*` tokens and a few rules; the shared `ViewerFrame` does the rest, and an open viewer restyles the moment the design changes.
- **Add a design:** `npm run new-design -- <slug>` scaffolds the component, a starter `viewer.css` and the route and marks it live. The Playwright suite then checks the design contract for it automatically: all content present, resume reader works, the nine section anchors exist, no overflow from 320 px up, no console errors, WCAG 2.1 A/AA via axe, nothing looping under reduced motion, and a viewer theme of its own that passes the same checks, and a game of its own that opens as an accessible dialog and plays.
- **Routes:** the default design is served at `/`; the others at `/designs/<slug>/` with their canonical URL pointing at `/`, so search engines index one page.
- Fonts are self-hosted per design (a visitor only downloads the fonts of the design they open) and there are no image assets: textures and illustrations are CSS and inline SVG.

Details, conventions and notes on each design are in [docs/DESIGNS.md](docs/DESIGNS.md).

## 🔄 GitHub Projects Sync

The Projects section lists your public GitHub repos with no manual edits:

1. **Build time** – `npm run build` runs `scripts/fetch-repos.mjs` first (`prebuild`). It calls the GitHub REST API, drops forks, archived repos, repos without a description, the profile repo and this repo, and writes `src/data/repos.json`. If the API call fails, the existing file is kept and the build continues. Set `GITHUB_TOKEN` to avoid rate limits.
2. **Runtime** – on load the browser fetches the same endpoint, applies the same filter, caches it in `sessionStorage` for ~10 minutes and replaces the snapshot. Repos deleted or made private disappear immediately. If the request fails or is rate-limited (60/hr per IP), the snapshot stays.
3. **Rebuilds** – `.github/workflows/sync-portfolio.yml` runs every 6 hours (and on demand), rebuilds, and commits `repos.json` if it changed. The site is on Cloudflare Pages (Git-connected), so that commit triggers a deploy; no extra secrets are needed.

The **featured** projects at the top come from `src/data/projects.ts` (title, what was built, stack, honest numbers). They only show while their repo is still public, and their live-demo link is the repo's homepage field on GitHub. Everything else follows automatically in a "More from GitHub" grid. **A repo needs a description on GitHub to be listed.**

### Cloudflare Pages settings

- Build command: `npm run build`  ·  Output directory: `out`
- Headers (cache, CSP, HSTS) come from `public/_headers`. If you add a new third-party origin (analytics, fonts, embeds), allow it in the Content-Security-Policy there.
- Optional: add a `GITHUB_TOKEN` environment variable (a fine-grained token with no permissions is enough for public data) so shared build IPs don't hit the unauthenticated rate limit.

## 🎨 Design Language (default Cinematic design)
- **Background**: Deep Dark (`#121212`)
- **Accent**: Soft Blue (`#6EA8FF`)
- **Typography**: `Inter` (self-hosted variable font, OFL) — Focus on huge whitespace, light font weights, and extreme contrast.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
