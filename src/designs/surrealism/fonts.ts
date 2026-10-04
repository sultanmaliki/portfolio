import localFont from "next/font/local";

// Cormorant Garamond (classical display serif) and DM Sans (plain text sans), so the strangeness stays in the layout. Both variable, latin, OFL.
export const serif = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-wght-normal.woff2", style: "normal", weight: "300 700" },
    { path: "./fonts/cormorant-garamond-latin-wght-italic.woff2", style: "italic", weight: "300 700" },
  ],
  display: "swap",
  variable: "--font-dream-serif",
});

export const sans = localFont({
  src: "./fonts/dm-sans-latin-wght-normal.woff2",
  weight: "100 1000",
  display: "swap",
  variable: "--font-dream-sans",
});
