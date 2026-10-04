import localFont from "next/font/local";

// Orbitron (squared techno display) and JetBrains Mono (readouts). Both variable, latin, OFL. Body text uses the site-wide Inter.
export const cybercoreOrbitron = localFont({
  src: "./fonts/orbitron-latin-wght-normal.woff2",
  weight: "400 900",
  display: "swap",
  variable: "--font-core-display",
});

export const cybercoreMono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-core-mono",
});
