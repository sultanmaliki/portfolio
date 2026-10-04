import localFont from "next/font/local";

// Playfair Display for headlines, Source Serif 4 for running text (both variable, latin, OFL).
export const editorialDisplay = localFont({
  src: [
    { path: "./fonts/playfair-display-latin-wght-normal.woff2", style: "normal", weight: "400 900" },
    { path: "./fonts/playfair-display-latin-wght-italic.woff2", style: "italic", weight: "400 900" },
  ],
  display: "swap",
  variable: "--font-ed-display",
});

export const editorialText = localFont({
  src: [
    { path: "./fonts/source-serif-4-latin-wght-normal.woff2", style: "normal", weight: "200 900" },
    { path: "./fonts/source-serif-4-latin-wght-italic.woff2", style: "italic", weight: "200 900" },
  ],
  display: "swap",
  variable: "--font-ed-text",
});
