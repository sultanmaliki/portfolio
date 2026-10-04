import localFont from "next/font/local";

// Unbounded (wide, rounded display, variable) and Outfit (clean text sans, variable). Both OFL, latin.
export const display = localFont({
  src: "./fonts/unbounded-latin-wght-normal.woff2",
  weight: "200 900",
  display: "swap",
  variable: "--font-y2k-display",
});

export const text = localFont({
  src: "./fonts/outfit-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-y2k-text",
});
