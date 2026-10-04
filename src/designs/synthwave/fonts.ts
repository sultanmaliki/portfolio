import localFont from "next/font/local";

// Exo 2 (variable, roman and italic, latin, OFL): wide black italics for the chrome headlines, regular weights for text.
export const exo = localFont({
  src: [
    { path: "./fonts/exo-2-latin-wght-normal.woff2", style: "normal", weight: "100 900" },
    { path: "./fonts/exo-2-latin-wght-italic.woff2", style: "italic", weight: "100 900" },
  ],
  display: "swap",
  variable: "--font-synth",
});
