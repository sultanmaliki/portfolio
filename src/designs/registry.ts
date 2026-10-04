/**
 * Every portfolio design, built or planned. This file is the plan.
 *
 * - `status: "live"` means the design exists, has a route and shows up as selectable in the switcher.
 * - `status: "planned"` means it is on the roadmap; the switcher shows it as "Coming soon".
 *
 * To start a planned design run `npm run new-design -- <slug>`: it scaffolds the component and the
 * route and flips the status below. See docs/DESIGNS.md for the full brief of each design.
 *
 * Keep this file free of path aliases and React so Node, Vitest and Playwright can import it too.
 */

export type DesignStatus = "live" | "planned";

export interface DesignMeta {
  /** URL segment and folder name: src/designs/<slug>, src/app/designs/<slug>. */
  slug: string;
  name: string;
  /** One-line visual direction, shown in the switcher. */
  tagline: string;
  /** Swatches shown in the switcher: background, accent, ink. */
  palette: readonly [string, string, string];
  status: DesignStatus;
}

/** The design served at "/" (the one search engines and first-time visitors see). */
export const DEFAULT_DESIGN = "cinematic";

/**
 * Show roadmap designs in the switcher as "Coming soon". Set to false to list only live designs
 * (the switcher hides itself while there is only one).
 */
export const SHOW_PLANNED_DESIGNS = true;

export const designs: readonly DesignMeta[] = [
  {
    slug: "cinematic",
    name: "Cinematic",
    tagline: "Scroll-driven film intro, glass panels and a calm dark stage.",
    palette: ["#121212", "#6EA8FF", "#F5F5F5"],
    status: "live",
  },
  {
    slug: "claymorphism",
    name: "Claymorphism",
    tagline: "Soft, puffy 3D shapes in pastel fills with chunky rounded corners.",
    palette: ["#FFE5EC", "#BDE0FE", "#4A4458"],
    status: "live",
  },
  {
    slug: "cybercore",
    name: "Cybercore",
    tagline: "Cold techno: brushed metal, HUD overlays and data-grid details.",
    palette: ["#0B0F14", "#7CF7E4", "#C3C9D4"],
    status: "live",
  },
  {
    slug: "neo-brutalism",
    name: "Neo-brutalism",
    tagline: "Raw borders, hard offset shadows and loud flat colour.",
    palette: ["#FFE156", "#FF6B6B", "#111111"],
    status: "live",
  },
  {
    slug: "scrapbook",
    name: "Scrapbook",
    tagline: "Taped photos, torn paper, handwritten notes and stickers.",
    palette: ["#F4E9D8", "#E07A5F", "#3D405B"],
    status: "live",
  },
  {
    slug: "surrealism",
    name: "Surrealism",
    tagline: "Dreamlike scale shifts, floating objects and impossible layouts.",
    palette: ["#F6AE2D", "#33658A", "#3B1F2B"],
    status: "live",
  },
  {
    slug: "y2k",
    name: "Y2K aesthetic",
    tagline: "Glossy bubbles, iridescent gradients and early-web optimism.",
    palette: ["#B8F2FF", "#FF9AD5", "#C9B8FF"],
    status: "live",
  },
  {
    slug: "pixel-art",
    name: "Pixel art",
    tagline: "8/16-bit sprites, tile borders and a quest-log layout.",
    palette: ["#1D2B53", "#FF004D", "#FFEC27"],
    status: "live",
  },
  {
    slug: "synthwave",
    name: "Synthwave",
    tagline: "Neon sunset grids, chrome type and a retro-futurist glow.",
    palette: ["#1A0B2E", "#FF2A6D", "#05D9E8"],
    status: "live",
  },
  {
    slug: "glassmorphism",
    name: "Glassmorphism",
    tagline: "Frosted translucent panels floating over vivid gradients.",
    palette: ["#4F46E5", "#A78BFA", "#F0ABFC"],
    status: "live",
  },
  {
    slug: "neumorphism",
    name: "Neumorphism",
    tagline: "Soft extruded surfaces lit from two sides, all in one tone.",
    palette: ["#E0E5EC", "#FFFFFF", "#A3B1C6"],
    status: "live",
  },
  {
    slug: "bento-grid",
    name: "Bento grid",
    tagline: "Modular rounded tiles of mixed sizes, each telling one fact.",
    palette: ["#F4F4F0", "#111111", "#5B8CFF"],
    status: "live",
  },
  {
    slug: "editorial",
    name: "Editorial design",
    tagline: "Magazine layout: big serif headlines, columns and pull quotes.",
    palette: ["#F7F3EC", "#1A1A1A", "#B3261E"],
    status: "live",
  },
  {
    slug: "swiss",
    name: "Swiss design",
    tagline: "International Typographic Style: strict grid, one sans, one red.",
    palette: ["#FFFFFF", "#111111", "#E4002B"],
    status: "live",
  },
  {
    slug: "minimalism",
    name: "Minimalism",
    tagline: "Almost nothing: one typeface, generous whitespace, one accent.",
    palette: ["#FAFAFA", "#111111", "#6B7280"],
    status: "live",
  },
  {
    slug: "maximalism",
    name: "Maximalism",
    tagline: "More is more: clashing patterns, layered type, saturated colour.",
    palette: ["#FF3CAC", "#FFD600", "#2B86C5"],
    status: "live",
  },
  {
    slug: "luxury-typography",
    name: "Luxury typography",
    tagline: "High-contrast serifs, gold hairlines and slow, quiet motion.",
    palette: ["#0E0E0E", "#C9A227", "#F2EBDD"],
    status: "live",
  },
  {
    slug: "conceptual-sketch",
    name: "Conceptual sketch",
    tagline: "Pencil and ink on paper; the page looks like a drafted idea.",
    palette: ["#FAF8F1", "#2B2B2B", "#3A6EA5"],
    status: "live",
  },
  {
    slug: "ethereal",
    name: "Ethereal",
    tagline: "Pale glowing gradients, soft blur and floating light.",
    palette: ["#E8F0FF", "#F6E6FF", "#CFFAFE"],
    status: "live",
  },
  {
    slug: "bohemian",
    name: "Bohemian",
    tagline: "Earthy terracotta, woven patterns and warm hand-crafted texture.",
    palette: ["#C2674A", "#E9C46A", "#6B8F71"],
    status: "live",
  },
  {
    slug: "victorian",
    name: "Victorian",
    tagline: "Ornate borders, engraved flourishes and aged paper in jewel tones.",
    palette: ["#4A1C26", "#C8A96A", "#F1E6CF"],
    status: "live",
  },
  {
    slug: "cyberpunk",
    name: "Cyberpunk",
    tagline: "Dystopian neon on black: glitch, scanlines and hazard yellow.",
    palette: ["#0A0A0F", "#FCEE0A", "#FF003C"],
    status: "live",
  },
  {
    slug: "wabi-sabi",
    name: "Wabi-sabi",
    tagline: "Imperfect, muted and natural: raw textures, asymmetry, calm.",
    palette: ["#D8D2C4", "#8A8577", "#4B4A44"],
    status: "live",
  },
];

/** Where a design lives. The default design owns the site root. */
export const designPath = (slug: string): string => (slug === DEFAULT_DESIGN ? "/" : `/designs/${slug}/`);

export const findDesign = (slug: string): DesignMeta | undefined => designs.find((d) => d.slug === slug);

const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

/** The design that owns a pathname ("/", "/designs/pixel-art/"), if any. */
export const designForPath = (pathname: string): DesignMeta | undefined =>
  designs.find((d) => trimSlash(designPath(d.slug)) === trimSlash(pathname));

export const liveDesigns = (): DesignMeta[] => designs.filter((d) => d.status === "live");
export const plannedDesigns = (): DesignMeta[] => designs.filter((d) => d.status === "planned");
