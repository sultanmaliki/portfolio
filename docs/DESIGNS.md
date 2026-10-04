# Portfolio designs

One person, one set of content, 23 looks. A design is only a *presentation* of the same data. Visitors switch designs from the **Designs** button (bottom-left), which opens the design panel. The default design (**Cinematic**) is served at `/`; the other 22 live at `/designs/<slug>/`.

## How it fits together

```
src/data/            ← all content, in typed TypeScript (the only place content lives)
  profile.ts           identity, availability, links, story, skills, timeline, interests
  experience.ts        work history
  education.ts         degree + certifications
  projects.ts          curated featured projects (what was built, stack, honest numbers)
  repos.json           generated GitHub snapshot (refreshed by the sync workflow)
  index.ts             `portfolio`: everything above in one object
src/lib/             ← behaviour any design can reuse
  useRepos()           GitHub projects: snapshot first, live refresh after, split into featured/others
  useCopy()            copy-to-clipboard with "Copied" feedback
  linkHandler()        external links open in the in-page viewer
  handleResumeClick    resume links open the in-page PDF reader
src/designs/         ← one folder per design + the registry (the plan)
  registry.ts          all 23 designs: name, one-line direction, palette, live | planned
  sections.ts          the nine in-page anchor ids every design provides
  shared/              usePortfolio() (content + wired-up links), Reveal, SkipLink, useActiveSection
  <slug>/              index.tsx, styles.module.css, fonts.ts, fonts/ (self-hosted woff2 + licences)
src/app/designs/<slug>/page.tsx   ← one tiny route per design (generated)
src/components/      ← shared chrome mounted once in the root layout
  DesignSwitcher       the panel that switches designs
  ResumeViewer, LinkViewer, SmoothAnchors
```

A design never owns content. It reads everything through one hook and arranges it:

```tsx
const { profile, projects, skills, resume, mail } = usePortfolio();
<a {...resume} className={styles.button}>Resume</a>     // opens the in-page reader
<a {...projects[0].code}>Code</a>                       // opens the in-page link viewer
```

`usePortfolio()` returns the whole `portfolio` object plus the GitHub projects (already paired with their curated entry), ready-made anchor props for every link, and copy-to-clipboard state. Because every design uses it, a link behaves the same everywhere.

Each design is its own route, so a visitor only downloads the code and fonts of the design they are looking at.

## Adding a design

1. Add an entry to `src/designs/registry.ts` with `status: "planned"` (name, one-line direction, three palette swatches).
2. `npm run new-design -- <slug>` creates `src/designs/<slug>/index.tsx` (a working starter that already renders everything), `src/app/designs/<slug>/page.tsx`, and flips the registry entry to `live`.
3. Copy the font files you need into `src/designs/<slug>/fonts/` (variable `woff2` from the Fontsource packages is the easiest source; keep each family's licence next to it), declare them in `fonts.ts` with `next/font/local`, and write `styles.module.css`.
4. `npm run dev`, open `/designs/<slug>/`, and design it. Keep the contract below.
5. `npm run check && npm run test:e2e`. The e2e suite runs the contract against every live design automatically.
6. `npm run previews` (after a build) captures the thumbnail the switcher shows for each design into `public/design-previews/<slug>.jpg`. A design without a thumbnail falls back to its three palette swatches.

To remove a design, delete `src/designs/<slug>` and `src/app/designs/<slug>` and set its registry status back to `planned` (or delete the entry). If `npm run typecheck` then complains about `.next/types`, delete the `.next` folder; it is generated.

To show a roadmap in the switcher, keep unfinished entries as `planned` and leave `SHOW_PLANNED_DESIGNS = true` in the registry; they show as "Coming soon" and cannot be opened. Set it to `false` to list only finished designs.

## The contract (enforced by `e2e/designs.spec.ts`)

Every live design must:

- render **all** content from `@/data`; nothing hard-coded
- have one `<h1>` containing the full name (put a real space between spans if the name is split) and one `<main>`
- show the availability line near the top, a **Resume** link (via `usePortfolio().resume`, so it opens the in-page reader) and the email address
- show every featured project, job, education entry and skill
- provide the nine anchors in `src/designs/sections.ts` (`#top`, `#story`, `#skills`, `#experience`, `#education`, `#projects`, `#timeline`, `#curiosity`, `#contact`), each exactly once, so the switcher can carry a visitor to the same section of the next design
- run with no console errors and no horizontal scrolling from 320 px to 2560 px wide
- pass the automated WCAG 2.1 A/AA checks (axe) with reduced motion emulated
- leave no infinite animation running when the visitor prefers reduced motion
- be usable by keyboard (visible focus ring, skip link first) and put the first screen to work for a recruiter: who, what role, available, and where to click next

Shared chrome (the switcher, resume reader and link viewer) is dark glass on purpose so it stays legible on top of any design. Designs do not restyle it.

## Conventions

- **Styling:** one CSS Module per design (`styles.module.css`). The design root is `<main id="top" data-design="<slug>">` with the font variables and `styles.page`. Start the stylesheet with `.page :where(a) { color: inherit }` (zero specificity, so button classes can set their own colour) and a `:global(html:has([data-design="<slug>"])) { background: … }` rule so overscroll never flashes the site's dark default.
- **Fonts:** self-host with `next/font/local` inside the design's folder (OFL/open licences only). Builds must work offline and the CSP only allows same-origin fonts. Use the Latin subset and prefer variable fonts. **Name each exported font after the design** (`swissGrotesk`, not `grotesk`): next/font names the `@font-face` family after the exported constant, and the production build merges all designs' CSS into shared chunks, so two designs exporting `display` override each other. A unit test enforces unique names. Pixel and period display faces are for headings and labels only; anything people read is set in a plain readable face.
- **Motion:** use `Reveal` for scroll reveals. It is CSS: hidden until a shared IntersectionObserver marks it `data-shown`, then a keyframe animation plays; reduced motion and print show it immediately. It animates `transform`, so give those elements their resting tilt with the individual `rotate`, `scale` and `translate` properties, never `transform`. Hover effects on revealed elements use `translate` for the same reason. Anything that loops must stop under `prefers-reduced-motion` (the global stylesheet already collapses CSS animations).
- **Reduced motion belongs in CSS.** Do not render different markup depending on `useReducedMotion()`: the server cannot know the preference and React keeps the server's attributes during hydration, so a branch can leave elements stuck at their hidden "initial" style for exactly the visitors it was meant to help. Values that only feed motion (a parallax offset, a counter) may check it.
- **Images and textures:** CSS and inline SVG only. Noise textures are tiny SVG data URIs (the CSP allows `data:` images). There are no raster assets to load.
- **Contrast:** text sits on a solid or heavily tinted surface, never directly on a pattern. Check every fill and text pair (the e2e axe run covers solid backgrounds; blurred or patterned areas need a manual check).
- **Decoration:** purely decorative elements are `aria-hidden`. Generated content (`::before`, `content: attr()`) is for ornament only; meaning stays in the DOM.
- **Mobile:** layouts collapse to one column below ~52 rem; sticky effects must not trap content taller than the viewport.

---

## The designs

Each entry says what shipped. The brief it started from is the first line; the rest are the decisions worth knowing before changing it.

### Cinematic

Scroll-driven film intro (150 frames drawn to a canvas), then glass panels on a dark stage with a single blue accent. Inter, light weights, huge whitespace. Served at `/`. Unchanged apart from reading its content from `@/data`.

### Claymorphism

Soft puffy pastel clay in a fixed six-colour set (pink, blue, butter, mint, lilac, peach), large radii, thick drop shadows with an inner highlight. Fredoka for headings, Nunito for text. Text is always dark plum on pastel; the primary button is a deep purple with white text. Buttons squash when pressed; skills are piles of slightly rotated clay pills; the hero lumps bob (stopped for reduced motion).

### Cybercore

Cold techno: dark glass HUD panels with cyan corner brackets, a brushed-metal nav strip, a faint grid, a slow scan line. Orbitron for headings, JetBrains Mono for readouts, body in Inter. The counters in the hero are real numbers derived from the data (public projects, featured builds, skills listed, certifications) and settle once; no fake percentages anywhere.

### Neo-brutalism

Yellow page, white cards, coral, blue, mint and lilac blocks, 3 px black borders, 6 px hard shadows, sharp corners only. Space Grotesk plus Space Mono. Tilts stay under 1.5° so text remains readable; buttons shift into their shadow when pressed and nothing eases.

### Scrapbook

A desk of paper: taped name card, torn-paper summary (clip-path), sticky notes for skills, an index card for the job, polaroids for projects, ticket stubs for certificates, a strip of photos for the timeline, a postcard for contact. Caveat for notes, Special Elite for labels, Source Serif 4 for everything read. The paper texture is a small SVG noise tile; text never sits on it directly.

### Surrealism

A dusk sky with a moon the size of a building (with an iris), monoliths floating at three depths with scroll parallax (static for reduced motion), a sky that melts into the night (inline SVG), a timeline of stairs, interests as objects drifting in a sky. Content sits on cream cards. Each project card has a hidden layer (the stack): collapsed to a label bar until hover or focus, always open on touch screens. Cormorant Garamond plus DM Sans.

### Y2K aesthetic

An iridescent pastel desktop: translucent windows with gradient title bars (the title bar text is the real section heading; the three controls are decoration), glossy bubble buttons with a shine sweep, sparkles that twinkle slowly. Unbounded plus Outfit. Dark indigo text on pale surfaces, dark plum on pink.

### Pixel art

A 16-bit adventure: PICO-8 palette, 4 px notched frames, a player sprite drawn from rows of letters (blinks and hops with `steps()`), headings with a game alias (Story/Prologue, Skills/Inventory, Experience/Quest log, Projects/Levels, Education/Training, Timeline/Save points, Interests/Side quests, Contact/Continue?). Press Start 2P is used for headings and labels only; paragraphs are Atkinson Hyperlegible.

### Synthwave

A striped neon sun sinking behind a perspective grid (pure CSS; the grid drives forward and the sun pulses, both stopped for reduced motion). Pink accents sit above the horizon line ("who I am"), cyan below it ("what I built"). Chrome gradient headline with a glow; body text solid and bright. Exo 2.

### Glassmorphism

Frosted panels over a drifting violet, pink and cyan field. Every panel has a dark tint under the white film so white text clears AA wherever the colour moves behind it; `prefers-reduced-transparency` swaps in solid panels. Each project is its own frosted card in normal flow with a scroll-in reveal (an earlier sticky card stack covered cards with one another and was removed). Plus Jakarta Sans.

### Neumorphism

One surface (#E0E5EC) with elements extruded or pressed by a light and a dark shadow. A sticky sidebar holds the monogram, a pressed "available" well, the section nav (the current section is pressed in) and the two main actions. Every control also has a visible 1 px edge, text is full-strength dark ink, and focus is a solid blue ring. Quicksand.

### Bento grid

Rounded tiles in groups where the tile count always equals the content count, with a floating pill nav. A GitHub tile shows the real public-project count and the most recently pushed repo (from `useRepos()`). Follows the system light/dark setting. Geist plus Geist Mono.

### Editorial design

A magazine: cover headline with a standfirst, a contents list, text in two columns with a drop cap, a pull quote, projects as features with an "at a glance" box, leaders for the repo list. Playfair Display plus Source Serif 4, kickers in small caps.

### Swiss design

The International Typographic Style: a visible twelve-column grid (toggle it with **Show grid**), flush-left text in Inter Tight, large numerals as the only structure, red as the only colour. Almost no motion.

### Minimalism

One column, one typeface (Hanken Grotesk), plain underlined links, no decoration, light and dark by system setting. Everything is present, just quiet.

### Maximalism

A wall of overlapping posters: three typefaces (Bowlby One, Abril Fatface, Syne), clashing saturated fills, stripes, dots, checks and zigzags on offset backdrops behind solid panels, one marquee of skills (decorative, the real list is in Skills). **Calm mode** removes every pattern and animation; it is also on by default under reduced motion.

### Luxury typography

Black and ivory with gold hairlines. DM Serif Display for headlines, Jost in wide-tracked small caps, a monogram, large numerals above each section title, slow fades and a lot of negative space. No imagery.

### Conceptual sketch

Graph paper with a notebook margin, graphite and one blue ink, hand-lettered notes (Architects Daughter) over plain body text (Karla). Pencil strokes draw themselves once as they scroll in. The LinkedOut architecture diagram is built from the project's own stack and highlight text, so it cannot drift from the data. The wobble on boxes is an SVG filter applied to a border pseudo-element, never to text.

### Ethereal

Pale pearl, lilac and sky with soft light rays and floating orbs; cards emerge from a blur. The orbs follow the pointer a little (fine pointers only, motion values, no re-renders). Outfit plus Newsreader italic, deep indigo text on pale surfaces.

### Bohemian

Terracotta, mustard and sage with rainbow arches, woven stripe bands, scalloped edges, arch-topped project frames and swaying leaves. Fills and text are paired for contrast (cream on deep terracotta, dark ink on mustard and soft sage). Young Serif plus Mulish.

### Victorian

A printed book: title page with a calling card, a contents list with dotted leaders, framed plates with brass corners, a drop cap, a burgundy invitation for contact. IM Fell English for headings only, EB Garamond for text. Headings are reworded in period style (A Biographical Sketch, Accomplishments, Employment, Works Published, Correspondence); the content under them is the data.

### Cyberpunk

Hazard yellow and red on near-black: cut-corner panels, scanlines, a terminal-style availability banner, a condensed industrial headline (Big Shoulders Display) and Share Tech Mono. The name glitches once on load and once per hover (a short slice shift of about 0.4 s, never a flash, never on text being read).

### Wabi-sabi

Plaster-coloured page with a static grain, Lora in a few sizes, asymmetric blocks, slightly crooked rules and uneven stones, an open circle drawn once with a single stroke, the statements from the data as large calm lines between sections, and slow fades. Dark ink on plaster at AA contrast.
