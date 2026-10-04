import localFont from "next/font/local";

// Caveat (handwriting, variable), Special Elite (typewriter) and Source Serif 4 (readable body). All OFL, latin.
export const scrapHand = localFont({
  src: "./fonts/caveat-latin-wght-normal.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-scrap-hand",
});

export const scrapTypewriter = localFont({
  src: "./fonts/special-elite-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-scrap-type",
});

export const scrapSerif = localFont({
  src: [
    { path: "./fonts/source-serif-4-latin-wght-normal.woff2", style: "normal", weight: "200 900" },
    { path: "./fonts/source-serif-4-latin-wght-italic.woff2", style: "italic", weight: "200 900" },
  ],
  display: "swap",
  variable: "--font-scrap-serif",
});
