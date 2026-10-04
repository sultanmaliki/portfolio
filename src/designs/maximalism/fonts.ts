import localFont from "next/font/local";

// Three faces on purpose: Bowlby One (poster-heavy display), Abril Fatface (fat didone accents) and Syne (wide, quirky text). All OFL, latin.
export const bowlby = localFont({
  src: "./fonts/bowlby-one-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-max-bowlby",
});

export const abril = localFont({
  src: "./fonts/abril-fatface-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-max-abril",
});

export const syne = localFont({
  src: "./fonts/syne-latin-wght-normal.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--font-max-syne",
});
