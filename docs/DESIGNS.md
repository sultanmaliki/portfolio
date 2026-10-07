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
  shared/              usePortfolio() (content + wired-up links), Reveal, SkipLink, useActiveSection, useEasterEgg + EggDialog + eggKit
  <slug>/              index.tsx, styles.module.css, viewer.css, Egg.tsx + egg.module.css, fonts.ts, fonts/ (self-hosted woff2 + licences)
src/app/designs/<slug>/page.tsx   ← one tiny route per design (generated)
src/components/      ← shared chrome mounted once in the root layout
  DesignSwitcher       the panel that switches designs (stays usable above an open viewer)
  ResumeViewer         the PDF reader         ┐ both are built from the same themed window,
  LinkViewer           preview card + browser ┘ restyled per design (see "Themed viewers")
  viewer/              ViewerFrame (the shared window), viewerTheme (which design is active), viewer.css (structure + tokens)
  SmoothAnchors
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
4. Theme the viewers: the scaffold gives you `viewer.css` (a starter theme) and a `<ViewerTheme>` in `index.tsx`. Pass it the design's font `variable` classes and restyle `viewer.css` from the design's own palette, type and shapes. See "Themed viewers" below.
5. `npm run dev`, open `/designs/<slug>/`, and design it. Keep the contract below.
6. `npm run check && npm run test:e2e`. The e2e suite runs the contract and the viewer checks against every live design automatically.
7. `npm run previews` (after a build) captures the thumbnail the switcher shows for each design into `public/design-previews/<slug>.jpg`. A design without a thumbnail falls back to its three palette swatches.

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

- hide a game of its own (`Egg.tsx`, see "Easter eggs"), unit- and e2e-tested like everything else
- render `<ViewerTheme slug="<slug>" fonts={…} />` and ship a `viewer.css` that styles `[data-viewer-theme="<slug>"]` (unit-tested), so the browser window and PDF reader belong to the design. `e2e/viewers.spec.ts` then walks the preview card, embedded browser and PDF reader of every design: axe, fits the screen, tappable controls on a phone, focus kept inside, and a look no other design shares

The design switcher is dark glass on purpose so it stays legible on top of any design; designs do not restyle it. It sits above an open viewer, so you can change design while the PDF or browser window is showing.

## Conventions

- **Styling:** one CSS Module per design (`styles.module.css`). The design root is `<main id="top" data-design="<slug>">` with the font variables and `styles.page`. Start the stylesheet with `.page :where(a) { color: inherit }` (zero specificity, so button classes can set their own colour) and a `:global(html:has([data-design="<slug>"])) { background: … }` rule so overscroll never flashes the site's dark default.
- **Fonts:** self-host with `next/font/local` inside the design's folder (OFL/open licences only). Builds must work offline and the CSP only allows same-origin fonts. Use the Latin subset and prefer variable fonts. **Name each exported font after the design** (`swissGrotesk`, not `grotesk`): next/font names the `@font-face` family after the exported constant, and the production build merges all designs' CSS into shared chunks, so two designs exporting `display` override each other. A unit test enforces unique names. Pixel and period display faces are for headings and labels only; anything people read is set in a plain readable face.
- **Motion:** use `Reveal` for scroll reveals. It is CSS: hidden until a shared IntersectionObserver marks it `data-shown`, then a keyframe animation plays; reduced motion and print show it immediately. It animates `transform`, so give those elements their resting tilt with the individual `rotate`, `scale` and `translate` properties, never `transform`. Hover effects on revealed elements use `translate` for the same reason. Anything that loops must stop under `prefers-reduced-motion` (the global stylesheet already collapses CSS animations).
- **Reduced motion belongs in CSS.** Do not render different markup depending on `useReducedMotion()`: the server cannot know the preference and React keeps the server's attributes during hydration, so a branch can leave elements stuck at their hidden "initial" style for exactly the visitors it was meant to help. Values that only feed motion (a parallax offset, a counter) may check it.
- **Images and textures:** CSS and inline SVG only. Noise textures are tiny SVG data URIs (the CSP allows `data:` images). There are no raster assets to load.
- **Contrast:** text sits on a solid or heavily tinted surface, never directly on a pattern. Check every fill and text pair (the e2e axe run covers solid backgrounds; blurred or patterned areas need a manual check).
- **Decoration:** purely decorative elements are `aria-hidden`. Generated content (`::before`, `content: attr()`) is for ornament only; meaning stays in the DOM.
- **Mobile:** layouts collapse to one column below ~52 rem; sticky effects must not trap content taller than the viewport.

## Themed viewers

The in-page **browser window** (a repo preview card, or a live demo in an iframe with back, reload, address bar and "open in a new tab") and the **PDF reader** (pdf.js with zoom, page count, selectable text, clickable links and Download) are one implementation each, shared by all 23 designs and restyled by every design. Behaviour lives in `src/components`; look lives in each design's `viewer.css`.

```
ResumeViewer / LinkViewer        what they do (pdf.js, iframe, reload, zoom, links)    shared, written once
  └─ viewer/ViewerFrame          overlay, window, title bar, toolbar slot, body,        shared, written once
                                 status strip; focus trap, Esc, scroll lock, entrance
       └─ viewer/viewer.css      structure + the --vw-* design tokens, with defaults    shared, written once
            └─ <slug>/viewer.css how this design restyles all of it                     one small file per design
```

**How the active design reaches the viewers.** They live in the root layout, outside any design, so each design renders `<ViewerTheme slug fonts entrance />`. It renders nothing: it publishes the slug, the design's font classes and the entrance animation to a tiny store. `ViewerFrame` reads the store and sets `data-viewer-theme="<slug>"` and the font classes on the overlay. Switching design swaps the store value, so an open viewer restyles in place without closing, reloading the PDF or losing its scroll position. A design's `viewer.css` is imported by that design, so a visitor only downloads the viewer CSS of the design they open.

**The window's parts** (the contract `viewer.css` styles; the top of `src/components/viewer/viewer.css` is the reference):

| Part | Class | Notes |
| --- | --- | --- |
| Scrim | `.vw-overlay` | carries `data-viewer-theme` and `data-viewer-kind` (`card`, `browser` or `pdf`) |
| Window frame | `.vw-window` | border, radius, shadow; its `::before` and `::after` are free for decoration that sticks out (tape, a gold ring, HUD brackets) |
| Clipped content | `.vw-inner` | holds `.vw-titlebar`, `.vw-toolbar`, `.vw-body`, `.vw-status` in that order |
| Title bar | `.vw-titlebar` | decorative and `aria-hidden`, so a theme may hide it: `.vw-dots` (window controls) and `.vw-tab` (tab or file name) |
| Controls | `.vw-toolbar`, `.vw-group`, `.vw-btn` (+ `--primary`, `--solid`, `--label`), `.vw-address`, `.vw-doc`, `.vw-zoom-level` | the real, accessible controls |
| Content | `.vw-page` (iframe), `.vw-pages` and `.vw-paper` (PDF), `.vw-card`, `.vw-chip`, `.vw-meta` (preview card) | |
| Status | `.vw-status` | one help line; keeps clear of the switcher button on phones |

A theme sets tokens (`--vw-bg`, `--vw-frame`, `--vw-radius`, `--vw-shadow`, `--vw-scrim`, `--vw-bar-*`, `--vw-btn-*`, `--vw-pri-*`, `--vw-solid-*`, `--vw-addr-*`, `--vw-chip-*`, `--vw-status-*`, `--vw-font*`, `--vw-icon-stroke` and more) and then adds rules for what colour alone cannot express: a toolbar moved below the content (`--vw-bar-order`), a hidden title bar, a clipped corner, a stepped border, a drop cap, a different shape for the window buttons.

**Rules of the road**

- Derive the theme from the design itself (palette, type, borders, radii, shadows, how it draws surfaces) so it looks like that design's own window, not the default with a new accent. Two designs may not end up with the same set of key tokens; an e2e test compares them.
- Keep every text and background pair AA-contrast. The e2e run applies axe to the open card, browser and PDF reader in each design. Where the accent does not contrast with the status strip, set `--vw-status-link`.
- Controls stay at least 44 px on touch screens (the base does this; do not shrink them) and the window must fit from 320 px up, so no fixed widths. Use `--vw-pad`, `--vw-pad-sm` and `--vw-radius-sm` to say how the window sits on a phone.
- Selectors start with `[data-viewer-theme="<slug>"]` and may only name your own slug (unit-tested). Pick the entrance with `<ViewerTheme entrance>`: `rise`, `pop`, `drop`, `slide`, `fade` or `snap`. Reduced motion is handled globally.
- Decoration is CSS only and nothing new gets an accessible role. The real controls are the shared buttons and links.
- Never branch behaviour per design. If a design needs something the structure cannot express, extend `ViewerFrame` for everyone.

**What each design does**

| Design | Viewer treatment |
| --- | --- |
| Cinematic | Dark stage: glass bars, hairline frame, wide-tracked uppercase labels, a lit blue edge under the label bar, pill controls like the page's own calls to action |
| Claymorphism | Puffy pastel clay: pink title bar with three clay beads, bulging buttons that squash when pressed, a dented address field and page tray, mint status strip |
| Cybercore | HUD panel: cyan corner brackets, brushed-metal title bar, coordinate grid behind the content, square outlined controls, `SYS //` mono status line |
| Neo-brutalism | Yellow and coral blocks with 3 px black borders and hard offset shadows, square window buttons, controls that press into their shadow |
| Scrapbook | Taped sheet of paper: two tape strips, typewriter label tab, crooked sticker buttons, handwritten notes, craft-paper tray under the PDF |
| Surrealism | Plum arch with a gold frame, a gold ring and a blue moon drifting off its edge, leaf-shaped controls, italic serif titles |
| Y2K aesthetic | Early-2000s window: glossy gradient title bar with bevelled buttons on the right, 3D bevel controls, sunken address field, star-dot body |
| Pixel art | Game menu: 4 px block borders, solid black step shadow, pixel-font labels, tiles that drop into their shadow, entrance in four hard frames |
| Synthwave | Neon sign over a sunset: pink and cyan glow, italic tracked labels, perspective-grid floor, setting sun behind the window |
| Glassmorphism | Frosted translucent layers over the blurred violet, pink and teal light field, bright top edge, small glass tiles |
| Neumorphism | One soft plastic surface: extruded window and buttons, pressed-in address, tab and page tray |
| Bento grid | A bento box: title bar, toolbar, content and status are separate rounded tiles on an off-white tray, one dark tile |
| Editorial design | Broadsheet: thick-over-double rules, serif masthead, small-caps text-link controls, a drop cap, crimson only for the main action |
| Swiss design | International Typographic Style: red 6 px rule over a black 4 px one, square boxes that invert on hover, no shadows, one grotesque |
| Minimalism | Almost nothing: no title bar, hairlines, muted icons and words, one dark button |
| Maximalism | Striped title bar, zigzag toolbar, dotted and checked backgrounds, stacked two-colour hard shadows, a different sticker colour per chip |
| Luxury typography | Black with a double gold hairline frame, centred serif title, quiet wide-tracked words for controls |
| Conceptual sketch | Graph-paper notebook page: pencil outlines with uneven corners, dashed construction lines, hollow doodle dots, handwritten labels and notes |
| Ethereal | Pearl frosted glass in a halo over a pale haze, big gentle radii, accent-tinted shadows, italic serif notes |
| Bohemian | Arched cream window, a woven terracotta band under the title, earthy rounded buttons, serif italics |
| Victorian | Parlour display case: burgundy mat and brass frame, small-caps title between brass diamonds, brass-plated buttons, a drop cap |
| Cyberpunk | Terminal with two cut corners, hazard-striped title strip, skewed status lights, scanlines, clipped primary buttons |
| Wabi-sabi | Plaster and handmade paper: slightly off-square edges, a small rust seal in the title bar, almost no shadow |

---

## Easter eggs

Every design hides a small game or toy, written in that design's own voice. They are for the curious, never for the recruiter in a hurry: inert until triggered, and always one Esc away from the page.

**Triggers.** Type the design's secret word anywhere on the page (not in a field), or tap the name (the `h1`) five times quickly, which is how it works on a phone. The browser console mentions the word once per page load. Nothing fires while a viewer is open. Cinematic also keeps its original Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`).

**How one is built.** `useEasterEgg({ slug, word, duration: 0 })` (in `src/designs/shared`) owns the trigger and Esc, and marks `main[data-design]` with `data-egg-active` while the egg is open. `<EggDialog>` is the frame: a modal dialog (`role="dialog"`, named, focus moves in and Tab stays inside, Esc or `<EggClose>` leave, focus goes back to where it was) in one of two shapes: `window` (a panel centred over a backdrop) or `stage` (the whole viewport as a play field). The game component mounts only while the egg is open, so every play starts fresh. `eggKit.ts` has the small shared helpers (`useFrame`, `clamp`, `rand`, a best score kept in `localStorage`, guarded). The design supplies `Egg.tsx` and `egg.module.css`, rendered once in `index.tsx` beside `<ViewerTheme>`. Anything with real rules lives in a plain module next to it (`terminal.ts`, `lightsout.ts`, `wordle.ts`, `breach.ts`, ...) so it is unit tested.

**Rules**

- Inert until triggered, and it only *starts* on a user action (a Start button, a first tap, a key) so reduced-motion visitors are never surprised. Nothing loops by itself under reduced motion.
- Keyboard and touch both work: every control is a real button or field, and anything pointer-only (dragging, scratching, tapping the page) has a keyboard route (arrow keys, Enter, a "Reveal" or "Drop one" button).
- It fits a 375 px phone and a short desktop window, never scrolls the page sideways, and has a visible Close.
- Result text goes in a `role="status"` element so it is announced; decorative canvases are `role="img"` with a label.
- Keep the rules out of React. Physics and scoring that mutate state many times a frame belong in a module-level engine (the React compiler lint rejects mutating refs in render closures, and a plain function is easier to test).
- No sound, no network, no tracking, no emoji. Text comes from `@/data` where it states facts about the candidate. Pick a lowercase word of three or more letters that no other design uses (unit-tested).

| Design | Secret word | What you play |
| --- | --- | --- |
| Cinematic | `action` (or Konami) | A movie trailer for the portfolio, cut from its real content: scenes advance on a tap, with pause and replay, ending on "Book a screening" |
| Claymorphism | `boing` | A pit of squishy clay balls with faces that blink and gasp. Tap to drop, drag to throw, shake the pit |
| Cybercore | `sudo` | A working terminal: `help`, `skills`, `projects`, `cat`, `neofetch`, `sudo hire me`, history and tab completion |
| Neo-brutalism | `bam` | Squash the bugs, spare the features: a 30 second whack-a-mole on a numpad grid (keys 1 to 9) |
| Scrapbook | `stick` | A sticker sheet: pick one, tap the page to slap it down, drag to rearrange, with labels like "HIRE ME" |
| Surrealism | `ceci` | Magritte's pipe for the whole page: tap anything and a museum plaque declares "Ceci n'est pas un lien" |
| Y2K aesthetic | `msn` | An instant-messenger chat with the candidate: ask `asl?`, about skills, hiring, hear a joke, send a nudge that shakes the window |
| Pixel art | `coin` | An endless pixel runner: jump over spikes and blocks, grab coins, keep your best |
| Synthwave | `drive` | Outrun: steer a neon car across three lanes of a perspective road, dodge barriers, grab orbs |
| Glassmorphism | `pop` | A sheet of glass bubble wrap: pop all 40, swipe to pop a row, race your best time |
| Neumorphism | `press` | Lights Out on soft buttons: every press flips its neighbours. Levels, hints that really solve it |
| Bento grid | `bento` | A sliding-tile puzzle of the stack's own tiles: rebuild the bento, hold to peek |
| Editorial design | `extra` | The Daily Word: a newspaper five-letter puzzle in developer vocabulary, a new word every day |
| Swiss design | `baseline` | The kerning game: space five words the way the typeface intended, scored against the font's own kerning |
| Minimalism | `less` | Do nothing for twenty seconds. Any movement resets it |
| Maximalism | `more` | The MORE machine: every press adds shapes and every five unlock a louder layer. There is a "less?" button too |
| Luxury typography | `gold` | A gold scratch card: scratch the foil to find the prize, then redeem it |
| Conceptual sketch | `draw` | Connect the dots, 1 to 25: a light bulb appears, line by wobbly pencil line |
| Ethereal | `wish` | A night sky of wishing lanterns: write a wish and release it, or tap the sky |
| Bohemian | `bloom` | A garden: tap to plant, stems grow and flowers open, and a butterfly visits once there are four |
| Victorian | `tea` | Pour tea for five guests, each with their own idea of "a cup", scored on how close you stop |
| Cyberpunk | `glitch` | Breach protocol: pick codes along the grid, alternating row and column, to upload daemons before the timer runs out |
| Wabi-sabi | `kintsugi` | Mend a broken bowl: drag the shards together and the cracks fill with gold |

`e2e/eggs.spec.ts` opens every one on a desktop and a phone profile and checks what they must all do: hidden before, a named modal dialog, focus moves in and stays in, Close and Esc work, five taps work, it fits the screen, axe-clean, and nothing running by itself under reduced motion. `e2e/eggs-play.spec.ts` then plays each one (solves the Lights Out, scratches the card, mends the bowl, chats on Y2K, runs a terminal command) and runs axe again on the state after playing. The rules of each game are in `src/designs/eggs.logic.test.ts`.

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
