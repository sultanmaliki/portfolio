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
│   └── utils/
│       └── timeline.ts          # Splits a section's scroll range into named phases
├── LICENSE
```

## 🎨 Design Language
- **Background**: Deep Dark (`#121212`)
- **Accent**: Soft Blue (`#6EA8FF`)
- **Typography**: `Inter` — Focus on huge whitespace, light font weights, and extreme contrast.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
