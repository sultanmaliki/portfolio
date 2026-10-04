import localFont from "next/font/local";

// Architects Daughter (hand-lettered annotations) and Karla (plain, readable body text). Both OFL, latin.
export const hand = localFont({
  src: "./fonts/architects-daughter-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-sketch-hand",
});

export const body = localFont({
  src: "./fonts/karla-latin-wght-normal.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-sketch-body",
});
