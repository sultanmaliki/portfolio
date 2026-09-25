# Syed Mohammed Sultan — Cinematic Portfolio

[![CI](https://github.com/sultanmaliki/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sultanmaliki/portfolio/actions/workflows/ci.yml)

A high-performance, interactive personal portfolio built with a focus on storytelling, motion design, and engineering depth. Designed to feel more like an interactive film or product launch rather than a traditional resume.

## 🚀 Features

- **Cinematic Scrollytelling**: A 150-frame image sequence drawn to an HTML5 `<canvas>`, mapped to scroll progress. Desktop gets the 1080p set, phones the 720p set; frames load coarse-to-fine (fewer on small screens and data-saver) so the page is usable quickly.
- **Recruiter-first basics**: The first screen states availability ("Open to entry-level roles") and offers View projects / Resume / Contact; featured projects carry concrete evidence (stack, what was built, numbers); the resume opens in-page; the email address can be copied.
- **Glassmorphic UI**: Beautiful, interactive glass panels with magnetic hover effects, noise textures, and subtle 3D transformations.
- **Built-in Resume Reader**: The resume opens in an on-page PDF reader (pdf.js, loaded on demand) with zoom, selectable text, clickable links and a Download PDF button, instead of a bare browser PDF tab.
- **In-page Link Viewer**: Project, profile and experience links open in an on-page panel: repos as a preview card (description, topics, language, stars), live demos in an embedded browser with address bar and reload. GitHub and LinkedIn forbid framing, so they always get the card plus an Open button.
- **Animated Navigation**: Nav links scroll through the page (eased, interruptible, reduced-motion aware) so the scroll story plays on the way to a section.
- **Micro-Interactions**: Custom morphing cursors, spring animations, dynamic parallax sections, and smooth transitions powered by Framer Motion.
- **Easter Eggs**: Secret Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`), and hidden tooltips.
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
| `npm test` | Vitest unit tests: repo filtering/sorting, URL safety, click handlers, data integrity |
| `npm run build` | Static export to `out/` |
| `npm run test:e2e` | Playwright smoke tests against `out/` on a desktop and a phone profile (first run: `npx playwright install chromium`; or set `PW_CHANNEL=chrome` to use installed Chrome) |
| `npm run check:links` | Verifies every external link in the built page (also runs weekly in CI: `.github/workflows/link-check.yml`) |
| `npm run check` | lint + typecheck + unit tests + build |

Run the browser tests against the live site with `E2E_BASE_URL=https://portfolio.syedmohammedsultan.online npm run test:e2e`.
GitHub Actions (`.github/workflows/ci.yml`) runs all of the above on every push and pull request; Dependabot opens weekly grouped update PRs.

## 📂 Project Structure

```text
├── public/
│   ├── sequence-720-v2/ # 150 WebP frames, 1280×720 (phones, tablets, data-saver)
│   ├── sequence-hd-v2/  # the same 150 frames at 1920×1080 (desktop)
│   ├── resume.pdf       # Downloadable resume
│   ├── og.jpg           # 1200×630 social preview image
│   ├── robots.txt / sitemap.xml
│   └── _headers         # Cloudflare Pages: cache + security headers
├── src/
│   ├── app/
│   │   ├── globals.css  # Global styles and CSS variables
│   │   ├── layout.tsx   # Root layout: metadata, JSON-LD, no-JS fallback
│   │   ├── not-found.tsx # Custom 404
│   │   └── page.tsx     # Main page stitching components together
│   ├── components/
│   │   ├── CustomCursor.tsx     # Global morphing cursor
│   │   ├── KonamiCode.tsx       # Easter egg logic
│   │   ├── NoiseBackground.tsx  # Grain overlay
│   │   ├── SiteNav.tsx          # Section navigation (appears after the intro)
│   │   ├── Providers.tsx        # Framer Motion reduced-motion config
│   │   ├── Overlay.tsx          # Parallax intro text
│   │   ├── Projects.tsx         # GitHub repos: build-time snapshot + live refresh
│   │   ├── ScrollTimeline.tsx   # Sticky scroll container that exposes progress (0–1)
│   │   ├── ScrollyCanvas.tsx    # Scroll-linked canvas engine & preloader
│   │   ├── SectionContact.tsx   # Footer and links
│   │   ├── SectionEducation.tsx # Degree + certifications, from src/data/education.ts
│   │   ├── SectionExperience.tsx# Work experience, rendered from src/data/experience.ts
│   │   ├── SectionCuriosity.tsx # Floating sticky notes
│   │   ├── SectionSkills.tsx    # Magnetic glass cards
│   │   ├── SectionStory.tsx     # Typographic storytelling
│   │   ├── SectionTimeline.tsx  # Horizontal scroll timeline
│   │   ├── LinkViewer.tsx       # In-page link preview card + embedded browser (src/lib/links.ts)
│   │   ├── SmoothAnchors.tsx    # Animated in-page navigation
│   │   └── ResumeViewer.tsx     # Built-in PDF reader (opened via src/lib/resume.ts)
│   ├── data/
│   │   ├── experience.ts        # Work experience entries (newest first)
│   │   ├── education.ts         # Education and certifications
│   │   ├── config.ts            # GitHub username, excluded repos, contact email, `featured` pins
│   │   ├── projects.ts          # Curated featured projects (role, stack, evidence)
│   │   └── repos.json           # Generated snapshot (committed; refreshed by the sync workflow)
│   ├── lib/
│   │   ├── github.ts            # Repo types, API payload parsing/filtering, sorting
│   ├── links.ts             # openLink()/linkHandler(): opens the in-page link viewer
│   └── resume.ts            # openResume()/handleResumeClick(): opens the resume reader
│   └── utils/
│       ├── scroll.ts            # useScrollTransform: scroll ranges padded to 0–1
│       └── timeline.ts          # Splits a section's scroll range into named phases
├── tools/
│   └── frame-pipeline/          # How the scroll frames were cleaned + upscaled (Real-ESRGAN); reproducible
├── scripts/
│   ├── fetch-repos.mjs          # `prebuild`: snapshots public repos (drops dead homepages) into src/data/repos.json
│   └── check-links.mjs          # Checks every external link in the built page
├── e2e/                         # Playwright smoke tests (desktop + phone)
├── .github/
│   ├── workflows/ci.yml         # Lint, types, unit tests, build, e2e on every push/PR
│   ├── workflows/sync-portfolio.yml # Every 6h: rebuild, commit repos.json if changed
│   ├── workflows/link-check.yml # Weekly: verify every external link
│   └── dependabot.yml           # Weekly grouped dependency updates
├── LICENSE
```

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

## 🎨 Design Language
- **Background**: Deep Dark (`#121212`)
- **Accent**: Soft Blue (`#6EA8FF`)
- **Typography**: `Inter` (self-hosted variable font, OFL) — Focus on huge whitespace, light font weights, and extreme contrast.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
