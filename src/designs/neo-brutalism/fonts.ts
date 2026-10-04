import localFont from "next/font/local";

// Space Grotesk (variable) for everything loud, Space Mono for labels and code. Both OFL.
export const grotesk = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-nb-grotesk",
});

export const mono = localFont({
  src: [
    { path: "./fonts/space-mono-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "./fonts/space-mono-latin-700-normal.woff2", style: "normal", weight: "700" },
  ],
  display: "swap",
  variable: "--font-nb-mono",
});
