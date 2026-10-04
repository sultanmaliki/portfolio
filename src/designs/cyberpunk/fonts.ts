import localFont from "next/font/local";

// Big Shoulders Display (condensed industrial headlines, variable) and Share Tech Mono (readouts and text). Both OFL, latin.
export const display = localFont({
  src: "./fonts/big-shoulders-display-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-cp-display",
});

export const mono = localFont({
  src: "./fonts/share-tech-mono-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-cp-mono",
});
