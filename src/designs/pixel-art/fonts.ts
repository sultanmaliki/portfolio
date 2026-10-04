import localFont from "next/font/local";

// Press Start 2P (pixel font, headings and labels only) and Atkinson Hyperlegible (a typeface made for legibility, for everything that is read). Both OFL, latin.
export const pixel = localFont({
  src: "./fonts/press-start-2p-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-px-display",
});

export const body = localFont({
  src: [
    { path: "./fonts/atkinson-hyperlegible-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "./fonts/atkinson-hyperlegible-latin-700-normal.woff2", style: "normal", weight: "700" },
  ],
  display: "swap",
  variable: "--font-px-body",
});
