import localFont from "next/font/local";

// Young Serif (warm, soft-cut headlines) and Mulish (friendly sans for text). Both OFL, latin.
export const bohoSerif = localFont({
  src: "./fonts/young-serif-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-boho-serif",
});

export const bohoSans = localFont({
  src: "./fonts/mulish-latin-wght-normal.woff2",
  weight: "200 1000",
  display: "swap",
  variable: "--font-boho-sans",
});
