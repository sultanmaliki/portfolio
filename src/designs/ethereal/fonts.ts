import localFont from "next/font/local";

// Outfit (light, airy sans) for headlines and text; Newsreader italic (delicate serif) for the quiet asides. Both variable, latin, OFL.
export const sans = localFont({
  src: "./fonts/outfit-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-ether-sans",
});

export const serif = localFont({
  src: [
    { path: "./fonts/newsreader-latin-wght-normal.woff2", style: "normal", weight: "200 800" },
    { path: "./fonts/newsreader-latin-wght-italic.woff2", style: "italic", weight: "200 800" },
  ],
  display: "swap",
  variable: "--font-ether-serif",
});
