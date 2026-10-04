import localFont from "next/font/local";

// DM Serif Display (high-contrast display serif) for headlines; Jost (variable geometric sans) for text and small caps. Both OFL.
export const serif = localFont({
  src: [
    { path: "./fonts/dm-serif-display-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "./fonts/dm-serif-display-latin-400-italic.woff2", style: "italic", weight: "400" },
  ],
  display: "swap",
  variable: "--font-lux-serif",
});

export const sans = localFont({
  src: "./fonts/jost-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-lux-sans",
});
