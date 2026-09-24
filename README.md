# Syed Mohammed Sultan — Cinematic Portfolio

A high-performance, interactive personal portfolio built with a focus on storytelling, motion design, and engineering depth. Designed to feel more like an interactive film or product launch rather than a traditional resume.

## 🚀 Features

- **Cinematic Scrollytelling**: A 150-frame image sequence drawn to an HTML5 `<canvas>`, mapped to scroll progress. Frames load in a coarse-to-fine order (fewer frames on small screens and Save-Data) so the page is usable quickly.
- **Glassmorphic UI**: Beautiful, interactive glass panels with magnetic hover effects, noise textures, and subtle 3D transformations.
- **Interactive Terminal Overlay**: A fully functional pseudo-terminal (press `~`) containing hidden commands, personal thoughts, and direct links.
- **Micro-Interactions**: Custom morphing cursors, spring animations, dynamic parallax sections, and smooth transitions powered by Framer Motion.
- **Easter Eggs**: Secret Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`), hidden tooltips, and terminal discoveries.
- **High Performance**: Object-fit canvas logic, DPR-aware canvas sizing, staged frame preloading, GPU-accelerated transforms, and a custom frame-loader.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, static export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rendering**: HTML5 Canvas API

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

## 📂 Project Structure

```text
├── public/
│   ├── sequence/        # 150 WebP frames for the scroll animation
│   └── resume.pdf       # Downloadable resume
├── src/
│   ├── app/
│   │   ├── globals.css  # Global styles and CSS variables
│   │   ├── layout.tsx   # Root layout wrapping the app
│   │   └── page.tsx     # Main page stitching components together
│   ├── components/
│   │   ├── CustomCursor.tsx     # Global morphing cursor
│   │   ├── KonamiCode.tsx       # Easter egg logic
│   │   ├── NoiseBackground.tsx  # Grain overlay
│   │   ├── Overlay.tsx          # Parallax intro text
│   │   ├── Projects.tsx         # GitHub repos: build-time snapshot + live refresh
│   │   ├── ScrollTimeline.tsx   # Sticky scroll container that exposes progress (0–1)
│   │   ├── ScrollyCanvas.tsx    # Scroll-linked canvas engine & preloader
│   │   ├── SectionContact.tsx   # Footer and links
│   │   ├── SectionCuriosity.tsx # Floating sticky notes
│   │   ├── SectionHobbies.tsx   # Interactive icons
│   │   ├── SectionQueryCraft.tsx# Product launch style showcase
│   │   ├── SectionSkills.tsx    # Magnetic glass cards
│   │   ├── SectionStory.tsx     # Typographic storytelling
│   │   ├── SectionTimeline.tsx  # Horizontal scroll timeline
│   │   └── Terminal.tsx         # Interactive global terminal
│   ├── data/
│   │   ├── config.ts            # GitHub username, excluded repos, `featured` pins
│   │   └── repos.json           # Generated snapshot (committed; refreshed by the sync workflow)
│   ├── lib/
│   │   └── github.ts            # Repo types, API payload parsing/filtering, sorting
│   └── utils/
│       ├── scroll.ts            # useScrollTransform: scroll ranges padded to 0–1
│       └── timeline.ts          # Splits a section's scroll range into named phases
├── scripts/
│   └── fetch-repos.mjs          # `prebuild`: snapshots public repos into src/data/repos.json
├── .github/workflows/
│   └── sync-portfolio.yml       # Every 6h: rebuild, commit repos.json if changed
├── LICENSE
```

## 🔄 GitHub Projects Sync

The Projects section lists your public GitHub repos with no manual edits:

1. **Build time** – `npm run build` runs `scripts/fetch-repos.mjs` first (`prebuild`). It calls the GitHub REST API, drops forks, archived repos, the profile repo and this repo, and writes `src/data/repos.json`. If the API call fails, the existing file is kept and the build continues. Set `GITHUB_TOKEN` to avoid rate limits.
2. **Runtime** – on load the browser fetches the same endpoint, applies the same filter, caches it in `sessionStorage` for ~10 minutes and replaces the snapshot. Repos deleted or made private disappear immediately. If the request fails or is rate-limited (60/hr per IP), the snapshot stays.
3. **Rebuilds** – `.github/workflows/sync-portfolio.yml` runs every 6 hours (and on demand), rebuilds, and commits `repos.json` if it changed. The site is on Cloudflare Pages (Git-connected), so that commit triggers a deploy; no extra secrets are needed.

Pin repos to the top by adding names to `featured` in `src/data/config.ts`.

### Cloudflare Pages settings

- Build command: `npm run build`  ·  Output directory: `out`
- Optional: add a `GITHUB_TOKEN` environment variable (a fine-grained token with no permissions is enough for public data) so shared build IPs don't hit the unauthenticated rate limit.

## 🎨 Design Language
- **Background**: Deep Dark (`#121212`)
- **Accent**: Soft Blue (`#6EA8FF`)
- **Typography**: `Inter` (self-hosted variable font, OFL) — Focus on huge whitespace, light font weights, and extreme contrast.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
