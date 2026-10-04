import localFont from "next/font/local";

// Plus Jakarta Sans (variable, latin, OFL): a modern geometric sans that stays crisp on translucent panels.
export const glassSans = localFont({
  src: "./fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-glass",
});
