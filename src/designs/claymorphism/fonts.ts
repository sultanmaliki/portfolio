import localFont from "next/font/local";

// Fredoka (rounded, chunky headlines) and Nunito (friendly text), both variable, latin, OFL.
export const display = localFont({
  src: "./fonts/fredoka-latin-wght-normal.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-clay-display",
});

export const text = localFont({
  src: "./fonts/nunito-latin-wght-normal.woff2",
  weight: "200 1000",
  display: "swap",
  variable: "--font-clay-text",
});
