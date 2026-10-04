import localFont from "next/font/local";

// Geist and Geist Mono (variable, latin, OFL).
export const bentoSans = localFont({
  src: "./fonts/geist-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-bento",
});

export const bentoMono = localFont({
  src: "./fonts/geist-mono-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-bento-mono",
});
